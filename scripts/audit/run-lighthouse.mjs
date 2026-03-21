#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_BASE_URL,
  ensureAuditDir,
  loadAuthModule,
  loadDiscoveredUrls,
  parsePositiveInt,
  sanitizeUrlToFilename,
  writeJson
} from "./shared.mjs";

const baseUrl = process.env.AUDIT_BASE_URL || DEFAULT_BASE_URL;
const maxUrls = parsePositiveInt(process.env.AUDIT_LIGHTHOUSE_MAX_URLS, Number.MAX_SAFE_INTEGER);
const urls = (await loadDiscoveredUrls(baseUrl)).slice(0, maxUrls);
const outputDir = await ensureAuditDir("lighthouse");
const timeoutMs = parsePositiveInt(process.env.AUDIT_LIGHTHOUSE_TIMEOUT_MS, 60000);
const chromeFlags = process.env.AUDIT_CHROME_FLAGS || "--headless=new --no-sandbox";
const chromePath = await resolveChromePath();

if (urls.length === 0) {
  throw new Error("No URLs available for Lighthouse. Run npm run audit:crawl first.");
}

const authModule = await loadAuthModule();
const authHeadersFromScript =
  authModule && typeof authModule.getLighthouseExtraHeaders === "function"
    ? await authModule.getLighthouseExtraHeaders({ baseUrl, urls })
    : null;

const authHeadersFromEnv = parseHeaders(process.env.AUDIT_LIGHTHOUSE_EXTRA_HEADERS);
const extraHeaders = {
  ...(authHeadersFromScript || {}),
  ...(authHeadersFromEnv || {})
};

const summary = [];
const lighthouseBin = process.platform === "win32" ? "lighthouse.cmd" : "lighthouse";

for (const targetUrl of urls) {
  const slug = sanitizeUrlToFilename(targetUrl);
  const jsonPath = path.join(outputDir, `${slug}.json`);
  const htmlPath = path.join(outputDir, `${slug}.html`);

  const outputErrors = [];
  for (const outputType of ["json", "html"]) {
    const outputPath = outputType === "json" ? jsonPath : htmlPath;
    const args = [
      targetUrl,
      "--quiet",
      "--output",
      outputType,
      "--output-path",
      outputPath,
      "--throttling-method",
      "simulate",
      "--preset",
      "desktop",
      "--max-wait-for-load",
      String(timeoutMs),
      "--only-categories",
      "performance",
      "--only-categories",
      "seo",
      "--only-categories",
      "accessibility",
      "--only-categories",
      "best-practices",
      "--chrome-flags",
      chromeFlags
    ];

    if (Object.keys(extraHeaders).length > 0) {
      args.push("--extra-headers", JSON.stringify(extraHeaders));
    }

    const run = await runCommandWithTimeout(
      lighthouseBin,
      args,
      timeoutMs + 20000,
      chromePath ? { CHROME_PATH: chromePath } : {}
    );
    if (run.code !== 0) {
      outputErrors.push(
        `${outputType.toUpperCase()} run failed (${run.code})${run.timedOut ? " [timeout]" : ""}: ${
          run.stderr || run.stdout || "unknown error"
        }`
      );
    }
  }

  if (outputErrors.length > 0) {
    const message = outputErrors.join(" | ");
    const artifactPaths = await writeErrorArtifacts({ outputDir, slug, targetUrl, message });
    summary.push({
      url: targetUrl,
      error: message,
      ...artifactPaths
    });
    console.error(`Lighthouse failed for ${targetUrl}: ${message}`);
    continue;
  }

  try {
    const parsed = JSON.parse(await readFile(jsonPath, "utf8"));
    summary.push({
      url: targetUrl,
      score: {
        performance: toPercent(parsed.categories?.performance?.score),
        accessibility: toPercent(parsed.categories?.accessibility?.score),
        seo: toPercent(parsed.categories?.seo?.score),
        bestPractices: toPercent(parsed.categories?.["best-practices"]?.score)
      },
      jsonReport: path.relative(process.cwd(), jsonPath),
      htmlReport: path.relative(process.cwd(), htmlPath)
    });
    console.log(`Lighthouse completed: ${targetUrl}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const artifactPaths = await writeErrorArtifacts({ outputDir, slug, targetUrl, message });
    summary.push({
      url: targetUrl,
      error: message,
      ...artifactPaths
    });
    console.error(`Lighthouse parse failed for ${targetUrl}: ${message}`);
  }
}

const summaryPath = path.join(outputDir, "summary.json");
await writeJson(summaryPath, {
  generatedAt: new Date().toISOString(),
  baseUrl,
  chromeFlags,
  chromePath: chromePath || null,
  urlsScanned: urls.length,
  summary
});

if (process.env.AUDIT_FAIL_ON_LIGHTHOUSE_ERRORS === "1") {
  const failedCount = summary.filter((entry) => entry.error).length;
  if (failedCount > 0) {
    process.exit(1);
  }
}

function parseHeaders(rawHeaders) {
  if (!rawHeaders) {
    return null;
  }

  try {
    return JSON.parse(rawHeaders);
  } catch {
    return null;
  }
}

function toPercent(score) {
  if (typeof score !== "number") {
    return null;
  }
  return Math.round(score * 100);
}

async function writeErrorArtifacts({ outputDir, slug, targetUrl, message }) {
  const jsonPath = path.join(outputDir, `${slug}.json`);
  const htmlPath = path.join(outputDir, `${slug}.html`);
  const payload = {
    generatedAt: new Date().toISOString(),
    url: targetUrl,
    error: message
  };
  const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Lighthouse Error</title></head><body><h1>Lighthouse Error</h1><p><strong>URL:</strong> ${escapeHtml(
    targetUrl
  )}</p><p><strong>Error:</strong> ${escapeHtml(message)}</p></body></html>`;
  await writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(htmlPath, html, "utf8");

  return {
    jsonReport: path.relative(process.cwd(), jsonPath),
    htmlReport: path.relative(process.cwd(), htmlPath)
  };
}

function runCommandWithTimeout(command, args, timeoutMs, extraEnv = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        ...extraEnv
      }
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ code: 1, stdout, stderr: `${stderr}\n${error.message}`.trim(), timedOut });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, stdout, stderr, timedOut });
    });
  });
}

async function resolveChromePath() {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  if (process.env.AUDIT_CHROME_PATH) {
    return process.env.AUDIT_CHROME_PATH;
  }

  try {
    const { chromium } = await import("playwright");
    return chromium.executablePath();
  } catch {
    return null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}
