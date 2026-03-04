import VelogContainer from "./container/VelogContainer";
import GithubContainer from "./container/GithubContainer";

export default function HomeSection() {
  const githubName = process.env.NEXT_PUBLIC_GITHUB_USER_NAME ?? "";
  const velogName = process.env.NEXT_PUBLIC_VELOG_NAME ?? "";

  return (
    <section className="flex flex-1 flex-col gap-4">
      <GithubContainer githubName={githubName} />
      <VelogContainer velogName={velogName} />
    </section>
  );
}
