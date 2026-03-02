import { cleanEnv, port, str, url } from "envalid";

function ensureTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  PORT: port({ default: 4000 }),
  GITHUB_TOKEN: str({ default: "" }),
  GITHUB_API_BASE_URL: url({ default: "https://api.github.com" }),
  VELOG_RSS_BASE_URL: url({ default: "https://v2.velog.io/rss/" }),
  CORS_WHITELIST: str({
    default:
      "https://maruchi1203.github.io,http://localhost:3000,http://localhost:4000",
  }),
});

export const runtimeConfig = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  githubToken: env.GITHUB_TOKEN,
  githubApiBaseUrl: env.GITHUB_API_BASE_URL,
  velogRssBaseUrl: ensureTrailingSlash(env.VELOG_RSS_BASE_URL),
  corsWhitelist: env.CORS_WHITELIST.split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0),
};
