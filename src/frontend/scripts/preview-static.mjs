import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT || 3000);
const OUT_DIR = normalize(join(process.cwd(), "out"));

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

function resolveFilePath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const target = cleanPath.endsWith("/")
    ? join(OUT_DIR, cleanPath, "index.html")
    : join(OUT_DIR, cleanPath);
  return normalize(target);
}

if (!existsSync(OUT_DIR)) {
  console.error("Static output not found. Run `npm run build` first.");
  process.exit(1);
}

createServer(async (req, res) => {
  const filePath = resolveFilePath(req.url);
  if (!filePath.startsWith(OUT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let targetPath = filePath;
  try {
    const info = await stat(targetPath);
    if (info.isDirectory()) {
      targetPath = join(targetPath, "index.html");
    }
  } catch {
    if (!extname(targetPath)) {
      targetPath = `${targetPath}.html`;
    }
  }

  if (!existsSync(targetPath)) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  const contentType = CONTENT_TYPES[extname(targetPath)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(targetPath).pipe(res);
}).listen(PORT, () => {
  console.log(`Static preview running on http://localhost:${PORT}`);
});
