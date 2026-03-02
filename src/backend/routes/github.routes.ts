import { Router, Request, Response } from "express";
import { runtimeConfig } from "../config/runtime-config";
import { fetchGithubProfile, fetchGithubRepos } from "../services/github.service";

const namePattern = /^[a-zA-Z0-9-_]+$/;

export const githubRouter = Router();

githubRouter.get("/github/:name/profile", async (req: Request, res: Response) => {
  const { name } = req.params;

  if (!name || !namePattern.test(name)) {
    res.status(400).json({ error: "github name parameter is required" });
    return;
  }

  try {
    const data = await fetchGithubProfile(name, runtimeConfig.githubToken);
    res.json(data);
  } catch (err: unknown) {
    res.status(500).json({ error: `Github API request failed: ${err}` });
  }
});

githubRouter.get("/github/:name/repos", async (req: Request, res: Response) => {
  const { name } = req.params;

  if (!name || !namePattern.test(name)) {
    res.status(400).json({ error: "github name parameter is required" });
    return;
  }

  try {
    const data = await fetchGithubRepos(name, runtimeConfig.githubToken);
    res.json(data);
  } catch (err: unknown) {
    res.status(500).json({ error: `Github API request failed: ${err}` });
  }
});
