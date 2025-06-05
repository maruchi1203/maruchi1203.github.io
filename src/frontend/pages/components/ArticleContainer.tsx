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
  ${(props) => props.theme.flex.flexCol}
  align-items: start;
  justify-content: center;
  padding: 20px;
  gap: 20px;

  width: 100%;

  border-radius: 5px;

  background-color: ${(props) => props.theme.primary};

  #icon-down {
    width: max-content;
    text-align: center;
  }
`;

const ArtcTitleContainer = styled.div`
  ${(props) => props.theme.flex.flexRow}
  align-items: center;
  font-size: larger;

  gap: 10px;

  .logo {
    width: 36px;
    height: auto;
  }
`;

const ArtcCardContainer = styled.div`
  ${(props) => props.theme.flex.flexRow}
  flex-direction: row-reverse;
  gap: 1rem;
  padding: 10px;

  width: 100%;
  height: fit-content;
`;

const ArtcCardColumn = styled.div`
  ${(props) => props.theme.flex.flexCol}
  flex: 1;
  gap: 1rem;
`;

const ArtcCard = styled.div`
  ${(props) => props.theme.flex.flexCol}
  align-items: start;

  width: auto;
  height: fit-content;

  background-color: ${(props) => props.theme.primary};

  box-shadow: 0 8px 6px ${(props) => props.theme.secondary};

  :hover {
    cursor: pointer;
  }

  a {
    ${(props) => props.theme.flex.flexCol}
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
    color: ${(props) => props.theme.secondary};
  }
`;

/**
 * 리포지토리
 */
function ArticleContainer(props: ArticleContainerProps) {
  const { velogName } = props;

  const colCount = 3;

  // const [articleDatas, setArticleDatas] = useState<Article[]>([]);
  const [articleElems, setArticleElems] = useState<React.ReactNode[]>([]);
  const [distributed, setDistributed] = useState<React.ReactNode[][]>([]);

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

        const rawArticleDatas: Article[] = rawArtcs.map((item) => {
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

        const rawArticleElems = rawArticleDatas.map((artcData) => (
          <ArtcCard key={artcData.guid}>
            <a href={artcData.link}>
              <span className="title">{artcData.title}</span>
              <span className="date">{artcData.pubDate.toDateString()}</span>
              <img className="artc-img" src={artcData.thumbnail} width="100%" />
            </a>
          </ArtcCard>
        ));

        // setArticleDatas(rawArticleDatas);
        setArticleElems(rawArticleElems);
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

  useEffect(() => {
    const imgElem = document.getElementsByClassName(
      "artc-img"
    ) as HTMLCollectionOf<HTMLImageElement>;

    const loadImages = Array.from(imgElem).map(
      (value) =>
        new Promise((resolve) => {
          if (value.complete) resolve(true);
          else value.onload = () => resolve(false);
        })
    );

    Promise.all(loadImages).then(() => {
      const distributed: React.ReactNode[][] = Array.from(
        { length: colCount },
        () => []
      );
      articleElems.forEach((artc) => {
        const shortest = distributed.reduce((a, b) =>
          a.length < b.length ? a : b
        );
        shortest.push(artc);
      });
      setDistributed(distributed);
    });
  }, [articleElems]);

  if (loading) {
    return <Wrapper>🖥️ 서버 구동 중......</Wrapper>;
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
        {distributed.map((column, colIdx) => (
          <ArtcCardColumn key={colIdx}>
            {column.map((artc) => artc)}
          </ArtcCardColumn>
        ))}
      </ArtcCardContainer>
    </Wrapper>
  );
}

export default ArticleContainer;
