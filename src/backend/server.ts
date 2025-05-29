import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../../dist")));

app.get("/github/:name/profile", async (req, res) => {
  const { name } = req.params;
  const token = process.env.VITE_GITHUB_TOKEN;

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
});

app.get("/github/:name/repos", async (req, res) => {
  const { name } = req.params;
  const token = process.env.VITE_GITHUB_TOKEN;

  try {
    const response = await fetch(`https://api.github.com/users/${name}/repos`, {
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
});

app.get("/velog/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const response = await fetch(`https://v2.velog.io/rss/${name}`);

    const data = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err: unknown) {
    res.status(500).json({ error: `Github API 호출 실패 ${err}` });
  }
});

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
