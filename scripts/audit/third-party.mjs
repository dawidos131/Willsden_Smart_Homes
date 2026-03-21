#!/usr/bin/env node
import path from "node:path";
import { chromium } from "playwright";
import {
  AUDIT_DIR,
  DEFAULT_BASE_URL,
  loadAuthModule,
  loadDiscoveredUrls,
  parsePositiveInt,
  writeJson
} from "./shared.mjs";

const baseUrl = process.env.AUDIT_BASE_URL || DEFAULT_BASE_URL;
const baseHost = new URL(baseUrl).hostname;
const maxUrls = parsePositiveInt(process.env.AUDIT_THIRD_PARTY_MAX_URLS, Number.MAX_SAFE_INTEGER);
const timeoutMs = parsePositiveInt(process.env.AUDIT_THIRD_PARTY_TIMEOUT_MS, 45000);
const settleMs = parsePositiveInt(process.env.AUDIT_THIRD_PARTY_SETTLE_MS, 1500);
const launchTimeoutMs = parsePositiveInt(process.env.AUDIT_THIRD_PARTY_LAUNCH_TIMEOUT_MS, 15000);
const urls = (await loadDiscoveredUrls(baseUrl)).slice(0, maxUrls);

if (urls.length === 0) {
  throw new Error("No URLs available for third-party inventory. Run npm run audit:crawl first.");
}

const authModule = await loadAuthModule();
const hostMap = new Map();
const pageSummaries = [];
const errors = [];
let browser = null;
try {
  browser = await withTimeout(
    chromium.launch({
      headless: true,
      args: ["--no-sandbox"]
    }),
    launchTimeoutMs,
    "Playwright launch"
  );
} catch (error) {
  errors.push({
    url: baseUrl,
    message: `Browser launch failed: ${error instanceof Error ? error.message : String(error)}`
  });
}

if (browser) {
  try {
    const context = await browser.newContext();

    if (authModule && typeof authModule.authenticate === "function") {
      await authModule.authenticate({ context, baseUrl, urls });
    }

    for (const targetUrl of urls) {
      const pageHosts = new Map();
      const page = await context.newPage();

      page.on("request", (request) => {
        const requestUrl = request.url();

        try {
          const parsed = new URL(requestUrl);
          if (!["http:", "https:"].includes(parsed.protocol)) {
            return;
          }

          const host = parsed.hostname.toLowerCase();

          const global = hostMap.get(host) || { requests: 0, pages: new Set(), firstParty: isFirstParty(host, baseHost) };
          global.requests += 1;
          global.pages.add(targetUrl);
          hostMap.set(host, global);

          const pageCount = pageHosts.get(host) || 0;
          pageHosts.set(host, pageCount + 1);
        } catch {
          // Ignore malformed request URLs.
        }
      });

      try {
        await page.goto(targetUrl, { timeout: timeoutMs, waitUntil: "networkidle" });
        await page.waitForTimeout(settleMs);
      } catch (error) {
        errors.push({
          url: targetUrl,
          message: error instanceof Error ? error.message : String(error)
        });
      } finally {
        await page.close();
      }

      pageSummaries.push({
        url: targetUrl,
        hostRequests: Array.from(pageHosts.entries())
          .map(([host, requests]) => ({ host, requests, firstParty: isFirstParty(host, baseHost) }))
          .sort((a, b) => b.requests - a.requests)
      });

      console.log(`Third-party scan complete: ${targetUrl}`);
    }

    await context.close();
  } finally {
    await browser.close();
  }
}

const hosts = Array.from(hostMap.entries())
  .map(([host, data]) => ({
    host,
    requests: data.requests,
    pages: Array.from(data.pages).sort(),
    firstParty: data.firstParty
  }))
  .sort((a, b) => b.requests - a.requests || a.host.localeCompare(b.host));

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  pagesScanned: urls.length,
  uniqueHosts: hosts.length,
  thirdPartyHosts: hosts.filter((host) => !host.firstParty).length,
  hosts,
  pages: pageSummaries,
  errors
};

await writeJson(path.join(AUDIT_DIR, "third-party.json"), report);

if (process.env.AUDIT_FAIL_ON_THIRD_PARTY_ERRORS === "1" && errors.length > 0) {
  process.exit(1);
}

function isFirstParty(host, referenceHost) {
  return host === referenceHost || host.endsWith(`.${referenceHost}`);
}

async function withTimeout(promise, timeout, label) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeout}ms`)), timeout);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}
