import { runtimeConfig } from "../config/runtime-config";

export async function fetchVelogRss(name: string) {
  const url = new URL(name, runtimeConfig.velogRssBaseUrl).toString();
  const response = await fetch(url);
  return response.text();
}
