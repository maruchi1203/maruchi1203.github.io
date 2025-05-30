import theme from "@styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Article {
  guid: string;
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  thumbnail: string;
}

interface ArticleContainerProps {
  velogName: string;
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

const ArtcTitleContainer = styled.div`
  ${theme.flex.flexRow}
  align-items: center;
  font-size: larger;

  gap: 10px;

  .logo {
    width: 36px;
    height: auto;
  }
`;

const ArtcCardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 10px;

  width: 100%;
  height: fit-content;
`;

const ArtcCard = styled.div`
  ${theme.flex.flexCol}
  align-items: start;

  width: auto;
  height: fit-content;

  background-color: ${theme.lightColors.primary};

  box-shadow: 0 10px 10px ${theme.lightColors.secondary};

  :hover {
    cursor: pointer;
  }

  a {
    ${theme.flex.flexCol}
    align-items: start;
    padding: 20px;
    gap: 20px;

    width: 100%;
    height: 100%;
  }

  span {
    display: block;
    width: 100%;
  }

  .title {
    font-size: large;
  }

  .date {
    color: ${theme.lightColors.secondary};
  }
`;

/**
 * 리포지토리
 */
function ArticleContainer(props: ArticleContainerProps) {
  const { velogName } = props;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/velog/${velogName}`
        );

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const domParser = new DOMParser();

        const xmlText = await res.text();
        const xmlDoc = domParser.parseFromString(xmlText, "application/xml");
        const rawArtcs = Array.from(xmlDoc.querySelectorAll("item"));

        const articles: Article[] = rawArtcs.map((item) => {
          const descText = item.querySelector("description")?.textContent ?? "";
          const doc = domParser.parseFromString(descText, "text/html");
          const thumbnail = doc.querySelector("img")?.getAttribute("src") ?? "";

          return {
            guid: item.querySelector("guid")?.textContent ?? "",
            title: item.querySelector("title")?.textContent ?? "",
            link: item.querySelector("link")?.textContent ?? "",
            pubDate: new Date(item.querySelector("pubDate")?.textContent ?? ""),
            description: item.querySelector("description")?.textContent ?? "",
            thumbnail: thumbnail,
          };
        });

        setArticles(articles);
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
  }, [velogName]);

  if (loading) {
    return <Wrapper>💁‍♂️로딩 중......</Wrapper>;
  }
  if (error) {
    return (
      <Wrapper>
        ❓죄송합니다. 해당 리포지토리를 찾을 수 없습니다. {error}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ArtcTitleContainer>
        <div className="logo">
          <img
            src={`${import.meta.env.BASE_URL}images/velog.png`}
            width="100%"
            height="auto"
          />
        </div>
        Velog 글 목록
      </ArtcTitleContainer>
      <ArtcCardContainer>
        {articles.map((article) => (
          <ArtcCard key={article.guid}>
            <a href={article.link}>
              <span className="title">{article.title}</span>
              <span className="date">{article.pubDate.toDateString()}</span>
              <img src={article.thumbnail} width="100%" />
            </a>
          </ArtcCard>
        ))}
      </ArtcCardContainer>
    </Wrapper>
  );
}

export default ArticleContainer;
