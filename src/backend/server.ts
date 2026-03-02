import express, { NextFunction } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("Server starting...");

const app = express();
const PORT = process.env.PORT || 4000;

const whitelist = [
  "https://maruchi1203.github.io",
  "http://localhost:3000",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);
      console.log("NODE_ENV:", process.env.NODE_ENV);

      const isAllowed = !origin || whitelist.includes(origin);
      if (isAllowed) {
        console.log("CORS allowed");
        callback(null, true);
      } else {
        console.warn("CORS blocked");
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: false,
  }),
);

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
      res.status(400).json({ error: "github name parameter is required" });
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/users/${name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const data = await response.json();
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: `Github API request failed: ${err}` });
    }
  },
);

app.get(
  "/github/:name/repos",
  async (req: express.Request, res: express.Response) => {
    const { name } = req.params;
    const token = process.env.GITHUB_TOKEN;

    if (!name || !/^[a-zA-Z0-9-_]+$/.test(name)) {
      res.status(400).json({ error: "github name parameter is required" });
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
        },
      );

      const data = await response.json();
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: `Github API request failed: ${err}` });
    }
  },
);

app.get("/velog/:name", async (req: express.Request, res: express.Response) => {
  const { name } = req.params;

  if (!name || !/^[a-zA-Z0-9-_]+$/.test(name)) {
    res.status(400).json({ error: "velog name parameter is required" });
    return;
  }

  try {
    const response = await fetch(`https://v2.velog.io/rss/${name}`);
    const data = await response.text();

    return res.type("text/xml").send(data);
  } catch (err: unknown) {
    res.status(500).json({ error: `Velog API request failed: ${err}` });
  }
});

app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});


