import { NextFunction, Request, Response } from "express";

export function requestGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path.startsWith("http")) {
    res.status(400).send("Not allowed request");
    return;
  }

  next();
}
