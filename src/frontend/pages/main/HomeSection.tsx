import ArticleContainer from "./ArticleContainer";
import RepositoryContainer from "./RepositoryContainer";

export default function HomeSection() {
  const githubName = process.env.NEXT_PUBLIC_GITHUB_USER_NAME ?? "";
  const velogName = process.env.NEXT_PUBLIC_VELOG_NAME ?? "";

  return (
    <section className="flex flex-1 flex-col gap-4">
      <RepositoryContainer githubName={githubName} />
      <ArticleContainer velogName={velogName} />
    </section>
  );
}
