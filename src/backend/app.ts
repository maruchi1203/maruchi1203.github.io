import express from "express";
import helmet from "helmet";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { requestGuardMiddleware } from "./middlewares/request-guard.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { githubRouter } from "./routes/github.routes";
import { velogRouter } from "./routes/velog.routes";

export const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(requestGuardMiddleware);

app.use(githubRouter);
app.use(velogRouter);

app.use(notFoundMiddleware);
