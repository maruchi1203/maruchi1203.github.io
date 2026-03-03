/** @type {import("next").NextConfig} */
const repository = process.env.GITHUB_REPOSITORY || "";
const repositoryName = repository.split("/")[1] || "";
const isUserPageRepository =
  repositoryName.toLowerCase() === "maruchi1203.github.io";
const basePath =
  repositoryName && !isUserPageRepository ? `/${repositoryName}` : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
