import { useEffect, useState } from "react";

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

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function VelogContainer(props: ArticleContainerProps) {
  const { velogName } = props;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!velogName) {
        setError("NEXT_PUBLIC_VELOG_NAME is not set.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiBase}/velog/${velogName}`);

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
            thumbnail,
          };
        });

        setArticles(rawArticleDatas);
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
    return (
      <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
        Loading articles...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
        Article error: {error}
      </div>
    );
  }

  return (
    <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center gap-3 text-lg">
        <div className="h-9 w-9">
          <img src="/images/velog.png" className="h-full w-full" />
        </div>
        Velog
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((artcData) => (
          <div
            key={artcData.guid}
            className="rounded-md bg-white p-5 shadow-lg transition hover:cursor-pointer dark:bg-neutral-900"
          >
            <a href={artcData.link} className="flex flex-col gap-5">
              <span className="text-lg">{artcData.title}</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {artcData.pubDate.toDateString()}
              </span>
              <img className="w-full" src={artcData.thumbnail} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VelogContainer;
