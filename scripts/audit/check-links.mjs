#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import {
  AUDIT_DIR,
  DEFAULT_BASE_URL,
  loadDiscoveredUrls,
  parsePositiveInt,
  readJsonIfExists,
  writeJson
} from "./shared.mjs";

const baseUrl = process.env.AUDIT_BASE_URL || DEFAULT_BASE_URL;
const maxUrls = parsePositiveInt(process.env.AUDIT_LINKS_MAX_URLS, Number.MAX_SAFE_INTEGER);
const urls = (await loadDiscoveredUrls(baseUrl)).slice(0, maxUrls);

if (urls.length === 0) {
  throw new Error("No URLs available for link checking. Run npm run audit:crawl first.");
}

const linkinatorArgs = ["--format", "JSON", ...urls];
const linkinatorOutput = await runCommand(process.platform === "win32" ? "linkinator.cmd" : "linkinator", linkinatorArgs);

let parsedOutput = null;
if (linkinatorOutput.stdout.trim()) {
  try {
    parsedOutput = JSON.parse(linkinatorOutput.stdout);
  } catch {
    parsedOutput = null;
  }
}

const brokenLinks = extractBrokenLinks(parsedOutput);
const report = {
  tool: "linkinator",
  generatedAt: new Date().toISOString(),
  baseUrl,
  urlsChecked: urls,
  exitCode: linkinatorOutput.code,
  summary: {
    brokenCount: brokenLinks.length
  },
  brokenLinks,
  raw: parsedOutput || {
    stdout: linkinatorOutput.stdout,
    stderr: linkinatorOutput.stderr
  }
};

await writeJson(path.join(AUDIT_DIR, "link-check.json"), report);

console.log(`Link check complete: ${urls.length} URLs scanned, ${brokenLinks.length} broken links found.`);

if (process.env.AUDIT_FAIL_ON_BROKEN_LINKS === "1" && brokenLinks.length > 0) {
  process.exit(1);
}

if (linkinatorOutput.code !== 0 && !parsedOutput) {
  throw new Error(`linkinator failed with exit code ${linkinatorOutput.code}: ${linkinatorOutput.stderr}`);
}

function extractBrokenLinks(parsed) {
  if (!parsed) {
    return [];
  }

  const rows = [];
  collectRows(parsed, rows);

  return rows.filter((entry) => {
    if (typeof entry.status === "number" && entry.status >= 400) {
      return true;
    }

    const state = String(entry.state || entry.statusText || "").toUpperCase();
    return state.includes("BROKEN") || state.includes("ERROR") || state.includes("FAIL");
  });
}

function collectRows(value, rows) {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectRows(entry, rows);
    }
    return;
  }

  if (typeof value !== "object") {
    return;
  }

  const hasLinkShape = "url" in value || "status" in value || "state" in value;
  if (hasLinkShape) {
    rows.push(value);
  }

  for (const nested of Object.values(value)) {
    collectRows(nested, rows);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr
      });
    });
  });
}
