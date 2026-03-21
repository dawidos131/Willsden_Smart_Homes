#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  AUDIT_DIR,
  DEFAULT_BASE_URL,
  ensureAuditDir,
  loadDiscoveredUrls,
  parsePositiveInt,
  writeJson
} from "./shared.mjs";

const baseUrl = process.env.AUDIT_BASE_URL || DEFAULT_BASE_URL;
const maxUrls = parsePositiveInt(process.env.AUDIT_PA11Y_MAX_URLS, Number.MAX_SAFE_INTEGER);
const discoveredUrls = (await loadDiscoveredUrls(baseUrl)).slice(0, maxUrls);
const fallbackUrls = await readFallbackUrls();
const targetUrls = discoveredUrls.length > 0 ? discoveredUrls : fallbackUrls;

if (targetUrls.length === 0) {
  throw new Error("No URLs available for Pa11y CI.");
}

await ensureAuditDir("a11y");

const pa11yArgs = ["--config", ".pa11yci.json", "--json", ...targetUrls];
const pa11yResult = await runCommand(process.platform === "win32" ? "pa11y-ci.cmd" : "pa11y-ci", pa11yArgs);

let parsedOutput = null;
if (pa11yResult.stdout.trim()) {
  try {
    parsedOutput = JSON.parse(pa11yResult.stdout);
  } catch {
    parsedOutput = null;
  }
}

const report = {
  tool: "pa11y-ci",
  generatedAt: new Date().toISOString(),
  baseUrl,
  urlsChecked: targetUrls,
  exitCode: pa11yResult.code,
  results: parsedOutput ?? {
    stdout: pa11yResult.stdout,
    stderr: pa11yResult.stderr
  }
};

const outputPath = path.join(AUDIT_DIR, "a11y", "pa11y.json");
await writeJson(outputPath, report);

console.log(`Pa11y CI complete: ${targetUrls.length} URLs scanned.`);

if (process.env.AUDIT_FAIL_ON_A11Y === "1" && hasIssues(parsedOutput)) {
  process.exit(1);
}

if (process.env.AUDIT_FAIL_ON_A11Y_ERRORS === "1" && pa11yResult.code !== 0 && !parsedOutput) {
  throw new Error(`pa11y-ci failed with exit code ${pa11yResult.code}: ${pa11yResult.stderr}`);
}

function hasIssues(value) {
  if (!value) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => {
      if (Array.isArray(entry.issues)) {
        return entry.issues.length > 0;
      }
      if (Array.isArray(entry.errors)) {
        return entry.errors.length > 0;
      }
      return false;
    });
  }

  return false;
}

async function readFallbackUrls() {
  try {
    const raw = await readFile(path.resolve(process.cwd(), ".pa11yci.json"), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.urls)) {
      return parsed.urls;
    }
  } catch {
    return [];
  }

  return [];
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
