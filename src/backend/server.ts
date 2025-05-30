import express, { NextFunction } from "express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../../dist")));

app.get(
  "/github/:name/profile",
  async (req: express.Request, res: express.Response) => {
    const { name } = req.params;
    const token = process.env.GITHUB_TOKEN;

    if (!name || name.trim() === "") {
      res.status(400).json({ error: "github name 파라미터가 필요합니다." });
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/users/${name}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
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

    if (!name || name.trim() === "") {
      res.status(400).json({ error: "github name 파라미터가 필요합니다." });
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/users/${name}/repos`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(data);
    } catch (err: unknown) {
      res.status(500).json({ error: `Github API 호출 실패 ${err}` });
    }
  }
);

app.get("/velog/:name", async (req: express.Request, res: express.Response) => {
  const { name } = req.params;

  if (!name || name.trim() === "") {
    res.status(400).json({ error: "velog name 파라미터가 필요합니다." });
    return;
  }

  try {
    const response = await fetch(`https://v2.velog.io/rss/${name}`);

    const data = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err: unknown) {
    res.status(500).json({ error: `Velog API 호출 실패 ${err}` });
  }
});

app.get(
  "*",
  (req: express.Request, res: express.Response, next: NextFunction) => {
    if (req.url.startsWith("http")) {
      res.status(400).send("잘못된 요청 형식입니다.");
      return;
    }
    next();
  }
);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
