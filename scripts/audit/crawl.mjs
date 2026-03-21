#!/usr/bin/env node
import path from "node:path";
import { load } from "cheerio";
import {
  AUDIT_DIR,
  DEFAULT_BASE_URL,
  detectProjectType,
  ensureAuditDir,
  normalizeUrl,
  parsePositiveInt,
  writeJson
} from "./shared.mjs";

const baseUrl = normalizeUrl(process.env.AUDIT_BASE_URL || DEFAULT_BASE_URL);
const maxDepth = parsePositiveInt(process.env.AUDIT_CRAWL_DEPTH, 2);
const timeoutMs = parsePositiveInt(process.env.AUDIT_HTTP_TIMEOUT_MS, 15000);
const sameOrigin = new URL(baseUrl).origin;

const urls = new Set();
const externalUrls = new Set();
const ignoredLinks = new Set();
const errors = [];
const queue = [{ url: baseUrl, depth: 0 }];
const seen = new Set();

await ensureAuditDir();

const projectDetection = await detectProjectType();
await writeJson(path.join(AUDIT_DIR, "project-detection.json"), projectDetection);

while (queue.length > 0) {
  const current = queue.shift();
  if (!current) {
    break;
  }

  const currentUrl = current.url;
  if (seen.has(currentUrl)) {
    continue;
  }

  seen.add(currentUrl);
  urls.add(currentUrl);

  let html;
  try {
    html = await fetchHtml(currentUrl, timeoutMs);
  } catch (error) {
    errors.push({
      url: currentUrl,
      depth: current.depth,
      message: error instanceof Error ? error.message : String(error)
    });
    continue;
  }

  const extracted = extractLinks(html, currentUrl, sameOrigin);
  for (const externalUrl of extracted.external) {
    externalUrls.add(externalUrl);
  }
  for (const ignored of extracted.ignored) {
    ignoredLinks.add(ignored);
  }

  if (current.depth >= maxDepth) {
    continue;
  }

  for (const discoveredInternalUrl of extracted.internal) {
    if (!seen.has(discoveredInternalUrl)) {
      queue.push({
        url: discoveredInternalUrl,
        depth: current.depth + 1
      });
    }
  }
}

const crawlOutput = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  maxDepth,
  projectDetection,
  urls: Array.from(urls).sort(),
  externalUrls: Array.from(externalUrls).sort(),
  ignoredLinkPatterns: Array.from(ignoredLinks).sort(),
  errors
};

await writeJson(path.join(AUDIT_DIR, "urls.json"), crawlOutput);

console.log(
  `Crawl complete: ${crawlOutput.urls.length} internal URLs, ${crawlOutput.externalUrls.length} external URLs, ${crawlOutput.errors.length} fetch errors.`
);

async function fetchHtml(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "audit-crawler/1.0"
      }
    });

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      return "";
    }

    return response.text();
  } finally {
    clearTimeout(timer);
  }
}

function extractLinks(html, pageUrl, origin) {
  const internal = new Set();
  const external = new Set();
  const ignored = new Set();

  if (!html) {
    return {
      internal,
      external,
      ignored
    };
  }

  const $ = load(html);
  const selectors = [
    ["a", "href"],
    ["link", "href"],
    ["script", "src"],
    ["img", "src"],
    ["source", "src"],
    ["iframe", "src"],
    ["video", "src"],
    ["audio", "src"],
    ["form", "action"]
  ];

  for (const [tag, attribute] of selectors) {
    $(tag).each((_, element) => {
      const rawValue = ($(element).attr(attribute) || "").trim();
      if (!rawValue || rawValue.startsWith("#")) {
        return;
      }

      if (shouldIgnore(rawValue)) {
        ignored.add(rawValue);
        return;
      }

      let normalized;
      try {
        const resolved = new URL(rawValue, pageUrl);
        if (!["http:", "https:"].includes(resolved.protocol)) {
          ignored.add(rawValue);
          return;
        }

        if (resolved.hostname === "wa.me") {
          ignored.add(rawValue);
          return;
        }

        normalized = normalizeUrl(resolved.toString());
      } catch {
        ignored.add(rawValue);
        return;
      }

      if (new URL(normalized).origin === origin) {
        internal.add(normalized);
      } else {
        external.add(normalized);
      }
    });
  }

  return {
    internal,
    external,
    ignored
  };
}

function shouldIgnore(candidate) {
  const value = candidate.toLowerCase();
  return (
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("sms:") ||
    value.startsWith("javascript:") ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("https://wa.me/") ||
    value.startsWith("http://wa.me/")
  );
}
