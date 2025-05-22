import theme from "@src/styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  private: boolean;
}

interface RepositoryContainerProps {
  username: string;
  [key: string]: unknown;
}

const Wrapper = styled.div`
  padding: 20px;

  width: 100%;

  border-radius: 5px;

  background-color: ${theme.lightColors.primary};
`;

/**
 * 리포지토리
 */
function RepositoryContainer(props: RepositoryContainerProps) {
  const { username } = props;

  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos`
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
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

  if (loading) {
    return <Wrapper>💁‍♂️로딩 중......</Wrapper>;
  }
  if (error) {
    return <Wrapper>❓죄송합니다. 해당 리포지토리를 찾을 수 없습니다.</Wrapper>;
  }

  return (
    <Wrapper>
      <span className="text-xl flex gap-[10px] items-center mb-[20px]">
        <div className="w-8 h-8">
          <img src="/src/images/github.png" width="100%" height="auto" />
        </div>
        Github 리포지토리 목록
      </span>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            {repo.description && <p>{repo.description}</p>}
          </li>
        ))}
      </ul>
    </Wrapper>
  );
}

export default RepositoryContainer;
