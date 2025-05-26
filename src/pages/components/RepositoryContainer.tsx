import theme from "@src/styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  private: boolean;
  thumbnail: string;
}

interface RepositoryContainerProps {
  username: string;
  [key: string]: unknown;
}

const Wrapper = styled.div`
  ${theme.flex.flexCol}
  align-items: start;
  padding: 20px;
  gap: 20px;

  width: 100%;

  border-radius: 5px;

  background-color: ${theme.lightColors.primary};
`;

const RepoCardContainer = styled.div`
  ${theme.flex.flexRow}
  padding: 10px;

  width: 100%;
`;

const RepoCard = styled.div`
  ${theme.flex.flexCol}
  align-items: start;
  padding: 20px;

  width: 400px;
  height: 300px;

  background-color: ${theme.lightColors.primary};

  box-shadow: 0 10px 10px ${theme.lightColors.secondary};

  span {
    height: 30px;
  }
`;

/**
 * 리포지토리
 */
function RepositoryContainer(props: RepositoryContainerProps) {
  const { username } = props;

  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = import.meta.env.VITE_GITHUB_TOKEN;

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`/api/users/${username}/repos`, {
          headers: {
            Authorization: `token ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data: Repo[] = await res.json();

        setRepos(data);
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
  }, [username]);

  const getThumbNail = async (repo: string) => {
    const url = `https://raw.githubusercontent.com/${username}/${repo}/main/.github/thumbnail.png`;
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) return url;

    return "";
  };

  if (loading) {
    return <Wrapper>💁‍♂️로딩 중......</Wrapper>;
  }
  if (error) {
    return <Wrapper>❓죄송합니다. 해당 리포지토리를 찾을 수 없습니다.</Wrapper>;
  }

  return (
    <Wrapper>
      <span className="text-xl flex gap-[10px] items-center">
        <div className="w-8 h-8">
          <img src="/src/images/github.png" width="100%" height="auto" />
        </div>
        Github 리포지토리 목록
      </span>
      <RepoCardContainer>
        {/* <RepoArwLeftBtn />
      <RepoArwRightBtn /> */}
        {repos.map(async (repo) => (
          <RepoCard key={repo.id}>
            <span className="text-xl font-extrabold">{repo.name}</span>
            <span>{repo.description}</span>
            <img
              src={await getThumbNail(repo.name)}
              width="auto"
              height="200px"
            />
          </RepoCard>
        ))}
      </RepoCardContainer>
    </Wrapper>
  );
}

export default RepositoryContainer;
