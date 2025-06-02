import express, { NextFunction } from "express";
import cors from "cors";
import path from "path";

console.log("📦 서버 시작됨");

const app = express();
const distPath = path.resolve(__dirname);
const PORT = process.env.PORT || 4000;

const whitelist = [
  "https://maruchi1203.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🛜 Origin : ", origin);
      console.log("🧑‍💻 ENV : ", process.env.NODE_ENV);

      if (origin && whitelist.includes(origin)) {
        console.log("✅ CORS Allowed");
        callback(null, true);
      } else {
        console.warn("💥 CORS Blocked");
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: false,
  })
);

app.use(express.static(distPath));
app.use((req: express.Request, res: express.Response, next: NextFunction) => {
  if (req.path.startsWith("http")) {
    res.status(400).send("Not allowed request");
    return;
  }
  next();
});

app.get(
  "/github/:name/profile",
  async (req: express.Request, res: express.Response) => {
    const { name } = req.params;
    const token = process.env.GITHUB_TOKEN;

    if (!name || !/^[a-zA-Z0-9-_]+$/.test(name)) {
      res.status(400).json({ error: "github name 파라미터가 필요합니다." });
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/users/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const data = await response.json();
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: `Github API 호출 실패 ${err}` });
    }
  }
);

app.get(
  "/github/:name/repos",
  async (req: express.Request, res: express.Response) => {
    const { name } = req.params;
    const token = process.env.GITHUB_TOKEN;

    if (!name || !/^[a-zA-Z0-9-_]+$/.test(name)) {
      res.status(400).json({ error: "github name 파라미터가 필요합니다." });
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/users/${name}/repos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      const data = await response.json();
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: `Github API 호출 실패 ${err}` });
    }
  }
);

app.get("/velog/:name", async (req: express.Request, res: express.Response) => {
  const { name } = req.params;

  if (!name || !/^[a-zA-Z0-9-_]+$/.test(name)) {
    res.status(400).json({ error: "velog name 파라미터가 필요합니다." });
    return;
  }

  try {
    const response = await fetch(`https://v2.velog.io/rss/${name}`);
    const data = await response.text();

    return res.type("text/xml").send(data);
  } catch (err: unknown) {
    res.status(500).json({ error: `Velog API 호출 실패 ${err}` });
  }
});

app.get("*", (_, res: express.Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
