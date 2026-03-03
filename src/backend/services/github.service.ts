import { runtimeConfig } from "../config/runtime-config";
type GithubEndpoint = "profile" | "repos";

function createGithubHeaders(token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGithub(name: string, endpoint: GithubEndpoint, token?: string) {
  const path = endpoint === "profile" ? `/users/${name}` : `/users/${name}/repos`;
  const url = new URL(path, runtimeConfig.githubApiBaseUrl).toString();

  const response = await fetch(url, {
    headers: createGithubHeaders(token),
  });

  return response.json();
}

export async function fetchGithubProfile(name: string, token?: string) {
  return fetchGithub(name, "profile", token);
}

export async function fetchGithubRepos(name: string, token?: string) {
  return fetchGithub(name, "repos", token);
}
