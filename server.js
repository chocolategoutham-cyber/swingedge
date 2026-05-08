const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const data = require("./data/site-data");

const root = __dirname;
const port = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const pages = new Set([
  "",
  "scaner-wins",
  "pre-breakout",
  "breakouts",
  "breakdowns",
  "insights",
  "how-we-scan-stocks"
]);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendJson(res, 404, { error: "Not found" });
        return;
      }
      sendJson(res, 500, { error: "Failed to read file" });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
    res.end(content);
  });
}

function apiPayload(pathname) {
  switch (pathname) {
    case "/api/meta":
      return data.meta;
    case "/api/scanner-wins":
      return data.scannerWins;
    case "/api/pre-breakout":
      return data.preBreakout;
    case "/api/breakouts":
      return data.breakouts;
    case "/api/breakdowns":
      return data.breakdowns;
    case "/api/insights":
      return data.insights;
    case "/api/methodology":
      return data.methodology;
    case "/api/universe":
      return {
        eligibleUniverseSize: data.preBreakout.universeSize,
        note: "Universe is modeled from the public methodology page using liquidity, stage, RS, volume, and risk heuristics."
      };
    default:
      return null;
  }
}

function safePathname(pathname) {
  const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return normalized;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname.replace(/\/+$/, "");

  if (pathname.startsWith("/api/")) {
    const payload = apiPayload(pathname);
    if (!payload) {
      sendJson(res, 404, { error: "Unknown API endpoint" });
      return;
    }
    sendJson(res, 200, payload);
    return;
  }

  if (pathname === "") {
    sendFile(res, path.join(root, "index.html"));
    return;
  }

  const route = pathname.slice(1);
  if (pages.has(route)) {
    const targetDir = route === "" ? root : path.join(root, route);
    sendFile(res, path.join(targetDir, "index.html"));
    return;
  }

  const resolved = path.join(root, safePathname(pathname));
  if (!resolved.startsWith(root)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.stat(resolved, (error, stats) => {
    if (error) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    if (stats.isDirectory()) {
      sendFile(res, path.join(resolved, "index.html"));
      return;
    }

    sendFile(res, resolved);
  });
});

server.listen(port, () => {
  console.log(`Swing Edge Replica server running at http://localhost:${port}`);
});
