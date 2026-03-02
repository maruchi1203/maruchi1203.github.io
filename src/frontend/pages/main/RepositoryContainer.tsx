import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  thumbnail?: string;
  md?: string;
}

interface RepositoryContainerProps {
  githubName: string;
  [key: string]: unknown;
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function isRepoArray(data: unknown): data is Repo[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "name" in item &&
        "html_url" in item,
    )
  );
}

function RepositoryContainer(props: RepositoryContainerProps) {
  const { githubName } = props;

  const [leftIconVisibility, setLeftIconVisibility] = useState(false);
  const [rightIconVisibility, setRightIconVisibility] = useState(true);

  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!githubName) {
        setError("NEXT_PUBLIC_GITHUB_USER_NAME is not set.");
        setLoading(false);
        return;
      }

      try {
        const repoUrl = `${apiBase}/github/${githubName}/repos`;
        const res = await fetch(repoUrl);

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const payload: unknown = await res.json();
        if (!isRepoArray(payload)) {
          throw new Error("Invalid repository response format.");
        }

        const reposWithThumbnail = await Promise.all(
          payload.map(async (repo) => {
            const thumbnailUrl = `https://raw.githubusercontent.com/${githubName}/${repo.name}/main/.github/thumbnail.png`;
            const thumbnailRes = await fetch(thumbnailUrl, { method: "HEAD" });
            return {
              ...repo,
              md: thumbnailRes.ok ? thumbnailUrl : "",
            };
          }),
        );

        setRepos(reposWithThumbnail);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          console.error("Unknown error", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [githubName]);

  useEffect(() => {
    setLeftIconVisibility(selectedRepo > 0);
    setRightIconVisibility(selectedRepo < repos.length - 1);
  }, [selectedRepo, repos.length]);

  const leftIconOnClick = () => {
    setSelectedRepo((prev) => {
      if (selectedRepo > 0) return selectedRepo - 1;
      return prev;
    });
  };

  const rightIconOnClick = () => {
    setSelectedRepo((prev) => {
      if (selectedRepo < repos.length - 1) return selectedRepo + 1;
      return prev;
    });
  };

  if (loading) {
    return (
      <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
        Loading repositories...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
        Repository error: {error}
      </div>
    );
  }

  return (
    <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center gap-3 text-lg">
        <div className="h-9 w-9">
          <img src="/images/github.png" className="h-full w-full" />
        </div>
        GitHub Repository List
      </div>
      <div className="mt-4 flex items-center z-1">
        <button
          className={leftIconVisibility ? "visible" : "invisible"}
          onClick={leftIconOnClick}
        >
          <ChevronLeftIcon className="h-16 w-16" />
        </button>
        <div className="relative mx-2 h-[400px] flex-1 z-0">
          {repos.map((repo, index) => (
            <div
              key={repo.id}
              className={`absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-5 shadow-lg transition-transform dark:bg-neutral-900 ${
                Math.abs(index - selectedRepo) <= 2 ? "block" : "hidden"
              }`}
              style={{
                transform: `translate(-50%, -50%) translateX(${
                  (index - selectedRepo) * 15
                }%) scale(${1 - 0.1 * Math.abs(index - selectedRepo)})`,
                zIndex: 100 - Math.abs(index - selectedRepo),
              }}
            >
              <a href={repo.html_url} className="flex h-full flex-col">
                <span className="text-xl font-semibold">{repo.name}</span>
                <span className="mt-2 text-neutral-500 dark:text-neutral-400">
                  {repo.description}
                </span>
                {repo.md ? (
                  <img className="mt-4 max-h-[200px] w-auto" src={repo.md} />
                ) : null}
              </a>
            </div>
          ))}
        </div>
        <button
          className={`${rightIconVisibility ? "visible" : "invisible"} z-1`}
          onClick={rightIconOnClick}
        >
          <ChevronRightIcon className="h-16 w-16 z-1" />
        </button>
      </div>
    </div>
  );
}

export default RepositoryContainer;
