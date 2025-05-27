import theme from "@src/styles/theme";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  private: boolean;
  thumbnail: string;
  md: string;
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

const RepoTitleContainer = styled.div`
  ${theme.flex.flexRow}
  align-items: center;
  font-size: larger;

  gap: 10px;

  .logo {
    width: 36px;
    height: auto;
  }
`;

const RepoCardContainer = styled.div`
  flex-grow: 1;
  ${theme.flex.flexRow}
  position: relative;
  display: inline-block;

  align-items: center;
  padding: 10px;

  width: 100%;
  height: 400px;

  :hover {
    cursor: pointer;
  }
`;

const IconButtonContainer = styled.div<{ $visible: boolean }>`
  flex-grow: 0;

  > * {
    visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
  }
`;

const RepoCard = styled.div<{ $renderedindex: number }>`
  display: ${(props) =>
    Math.abs(props.$renderedindex) <= 2 ? "block" : "none"};
  z-index: ${(props) => `${100 - Math.abs(props.$renderedindex)}`};
  scale: ${(props) => `${1 - 0.1 * Math.abs(props.$renderedindex)}`};

  position: absolute;
  align-items: start;

  width: 500px;
  height: 350px;

  top: 50%;
  left: ${(props) => `${50 + 10 * props.$renderedindex}%`};
  transform: translate(-50%, -50%);
  transition: transform 4s scale 4s z-index 4s;

  background-color: ${theme.lightColors.primary};

  box-shadow: 0 10px 10px ${theme.lightColors.secondary};

  a {
    ${theme.flex.flexCol}
    align-items: start;
    padding: 20px;

    width: 100%;
    height: 100%;
  }

  span {
    display: inline-block;
    width: 100%;
    height: 30px;
  }

  .name {
    font-size: x-large;
  }

  .description {
    color: ${theme.lightColors.secondary};
  }
`;

/**
 * 리포지토리
 */
function RepositoryContainer(props: RepositoryContainerProps) {
  const { username } = props;

  const [leftIconVisibility, SetLeftIconVisibility] = useState(false);
  const [rightIconVisibility, SetRightIconVisibility] = useState(true);

  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, SetSelectedRepo] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repoRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const leftArrow = document.getElementById("left-arrow");
  const rightArrow = document.getElementById("right-arrow");

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
        for (let i = 0; i < data.length; i++) {
          const url = `https://raw.githubusercontent.com/${username}/${data[i].name}/main/.github/thumbnail.png`;
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) {
            data[i]["md"] = url;
          } else {
            data[i]["md"] = "";
          }
        }

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

  useEffect(() => {
    requestAnimationFrame(() => {
      changeRepoCard();
    });
  }, [repos, selectedRepo]);

  const leftIconOnClick = () => {
    SetSelectedRepo((prev) => {
      if (selectedRepo > 0) return selectedRepo - 1;
      return prev;
    });
  };

  const rightIconOnClick = () => {
    SetSelectedRepo((prev) => {
      if (selectedRepo < repos.length - 1) return selectedRepo + 1;
      return prev;
    });
  };

  const changeRepoCard = () => {
    if (leftArrow && rightArrow) {
      SetLeftIconVisibility(selectedRepo > 0 ? true : false);
      SetRightIconVisibility(selectedRepo < repos.length - 1 ? true : false);
    }
  };

  if (loading) {
    return <Wrapper>💁‍♂️로딩 중......</Wrapper>;
  }
  if (error) {
    return <Wrapper>❓죄송합니다. 해당 리포지토리를 찾을 수 없습니다.</Wrapper>;
  }

  return (
    <Wrapper>
      <RepoTitleContainer>
        <div className="logo">
          <img src="/src/images/github.png" width="100%" height="auto" />
        </div>
        Github 리포지토리 목록
      </RepoTitleContainer>
      <div className="w-full flex items-center">
        <IconButtonContainer
          onClick={leftIconOnClick}
          $visible={leftIconVisibility}
        >
          <ChevronLeftIcon id="left-arrow" width="64px" />
        </IconButtonContainer>
        <RepoCardContainer>
          {repos.map((repo, index) => (
            <RepoCard
              key={repo.id}
              ref={(el) => {
                repoRefs.current.set(repo.id, el);
              }}
              $renderedindex={index - selectedRepo}
            >
              <a href={repo.html_url}>
                <span className="name">{repo.name}</span>
                <span className="description">{repo.description}</span>
                {repo.md ? (
                  <img
                    className="thumbnail"
                    src={repo.md}
                    width="auto"
                    height="200px"
                  />
                ) : null}
              </a>
            </RepoCard>
          ))}
        </RepoCardContainer>
        <IconButtonContainer
          onClick={rightIconOnClick}
          $visible={rightIconVisibility}
        >
          <ChevronRightIcon id="right-arrow" width="64px" />
        </IconButtonContainer>
      </div>
    </Wrapper>
  );
}

export default RepositoryContainer;
