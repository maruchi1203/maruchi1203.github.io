import cors from "cors";
import { runtimeConfig } from "../config/runtime-config";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    console.log("Origin:", origin);
    console.log("NODE_ENV:", runtimeConfig.nodeEnv);

    const isAllowed = !origin || runtimeConfig.corsWhitelist.includes(origin);
    if (isAllowed) {
      console.log("CORS allowed");
      callback(null, true);
      return;
    }

    console.warn("CORS blocked");
    callback(new Error("Not allowed by CORS"));
  },
  credentials: false,
});
