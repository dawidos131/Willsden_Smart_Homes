import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const DEFAULT_BASE_URL = "https://4f832c8c2c1563.lhr.life";
export const AUDIT_DIR = path.resolve(process.cwd(), ".audit");

export function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function normalizeUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.hash = "";
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }
  return url.toString();
}

export function sanitizeUrlToFilename(rawUrl) {
  const url = new URL(rawUrl);
  const normalizedPath = url.pathname === "/" ? "home" : url.pathname.replace(/^\//, "").replace(/\/+$/, "");
  const raw = `${url.hostname}-${normalizedPath}${url.search}`;
  return raw.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 140) || "page";
}

export async function ensureAuditDir(...segments) {
  const outputPath = path.join(AUDIT_DIR, ...segments);
  await mkdir(outputPath, { recursive: true });
  return outputPath;
}

export async function readJsonIfExists(filePath) {
  try {
    const value = await readFile(filePath, "utf8");
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function writeJson(filePath, payload) {
  const parent = path.dirname(filePath);
  await mkdir(parent, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function detectProjectType(cwd = process.cwd()) {
  const frameworkSignals = [
    { type: "nextjs", files: ["next.config.js", "next.config.mjs", "next.config.ts"] },
    { type: "astro", files: ["astro.config.js", "astro.config.mjs", "astro.config.ts"] },
    { type: "nuxt", files: ["nuxt.config.js", "nuxt.config.ts"] },
    { type: "sveltekit", files: ["svelte.config.js", "svelte.config.cjs"] },
    { type: "gatsby", files: ["gatsby-config.js", "gatsby-config.ts"] },
    { type: "vite", files: ["vite.config.js", "vite.config.mjs", "vite.config.ts"] }
  ];

  for (const signal of frameworkSignals) {
    for (const relativeFile of signal.files) {
      const candidate = path.join(cwd, relativeFile);
      if (await fileExists(candidate)) {
        return {
          detectedAt: new Date().toISOString(),
          type: signal.type,
          reason: `Detected ${relativeFile}`,
          root: cwd
        };
      }
    }
  }

  const rootEntries = await readdir(cwd, { withFileTypes: true });
  const rootHtml = rootEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".html")).map((entry) => entry.name);

  if (rootHtml.length > 0) {
    return {
      detectedAt: new Date().toISOString(),
      type: "static-html",
      reason: `Detected ${rootHtml.length} HTML files in repository root`,
      root: cwd,
      sampleFiles: rootHtml.slice(0, 10)
    };
  }

  const distDir = path.join(cwd, "dist");
  if (await fileExists(distDir)) {
    const distEntries = await readdir(distDir, { withFileTypes: true });
    const distHtml = distEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".html")).map((entry) => entry.name);
    if (distHtml.length > 0) {
      return {
        detectedAt: new Date().toISOString(),
        type: "static-html-dist",
        reason: `Detected ${distHtml.length} HTML files in dist/`,
        root: cwd,
        sampleFiles: distHtml.slice(0, 10)
      };
    }
  }

  return {
    detectedAt: new Date().toISOString(),
    type: "unknown",
    reason: "No known framework markers found",
    root: cwd
  };
}

export async function loadDiscoveredUrls(baseUrl) {
  const urlsPath = path.join(AUDIT_DIR, "urls.json");
  const parsed = await readJsonIfExists(urlsPath);

  if (parsed && Array.isArray(parsed.urls) && parsed.urls.length > 0) {
    return parsed.urls;
  }

  return [normalizeUrl(baseUrl)];
}

export async function loadAuthModule() {
  const authScript = process.env.AUDIT_AUTH_SCRIPT;
  if (!authScript) {
    return null;
  }

  const resolvedPath = path.resolve(process.cwd(), authScript);
  const moduleUrl = pathToFileURL(resolvedPath).href;
  return import(moduleUrl);
}

export function parseJsonInput(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
