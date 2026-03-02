import { Router, Request, Response } from "express";
import { fetchVelogRss } from "../services/velog.service";

const namePattern = /^[a-zA-Z0-9-_]+$/;

export const velogRouter = Router();

velogRouter.get("/velog/:name", async (req: Request, res: Response) => {
  const { name } = req.params;

  if (!name || !namePattern.test(name)) {
    res.status(400).json({ error: "velog name parameter is required" });
    return;
  }

  try {
    const data = await fetchVelogRss(name);
    res.type("text/xml").send(data);
  } catch (err: unknown) {
    res.status(500).json({ error: `Velog API request failed: ${err}` });
  }
});
