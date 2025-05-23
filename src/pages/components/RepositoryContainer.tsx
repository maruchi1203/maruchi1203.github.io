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

const RepoCard = styled.div`
  ${theme.flex.flexCol}
  align-items: start;
  position: absolute;
  padding: 20px;

  width: 400px;
  height: 300px;

  background-color: ${theme.lightColors.secondary};
`;

const RepoArwLeftBtn = styled.button`
  width: 100px;
  height: 100px;
  border-right: 10px solid black;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  transform: rotate(45deg);
`;

const RepoArwRightBtn = styled.button`
  width: 100px;
  height: 100px;
  border-right: 10px solid black;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  transform: rotate(45deg);
`;

/**
 * 리포지토리
 */
function RepositoryContainer(props: RepositoryContainerProps) {
  const { username } = props;

  const [repos, setRepos] = useState<Repo[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
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

        const data: Repo[] = await res.json();
        data.map(async (repo) => {
          const readme = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/contents/README.md`,
            {
              headers: { "X-GitHub-Api-Version": "2022-11-28" },
            }
          );

          const mdContentBase64 = atob((await readme.json())["content"]);
          const bytes = new Uint8Array(
            [...mdContentBase64].map((char) => char.charCodeAt(0))
          );

          const reg = new RegExp(
            `https:\\/\\/github\\.com\\/user-attachments\\/assets\\/[^\\s)]+(?=\\))`,
            "g"
          );
          const mdContentUTF8 = new TextDecoder().decode(bytes);
          const thumbnail = reg.exec(mdContentUTF8)?.toString();

          setThumbnails([...thumbnails, thumbnail ? thumbnail : ""]);
        });

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
  }, [username, thumbnails]);

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
      {/* <RepoArwLeftBtn />
      <RepoArwRightBtn /> */}
      {repos.map((repo, index) => (
        <RepoCard key={repo.id}>
          <span>{repo.name}</span>
          <span>{repo.description}</span>
          <img src={thumbnails[index]} width="100px" height="100px" />
        </RepoCard>
      ))}
    </Wrapper>
  );
}

export default RepositoryContainer;
