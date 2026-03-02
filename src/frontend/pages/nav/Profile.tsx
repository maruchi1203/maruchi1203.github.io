import { useEffect, useState } from "react";

interface Profile {
  login: string;
  name: string;
  bio: string;
  email: string;
  avatar_url: string;
  html_url: string;
  company: string;
  public_repos: number;
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function Profile() {
  const githubName = process.env.NEXT_PUBLIC_GITHUB_USER_NAME ?? "";
  const velogName = process.env.NEXT_PUBLIC_VELOG_NAME ?? "";

  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!githubName) {
        setError("NEXT_PUBLIC_GITHUB_USER_NAME is not set.");
        setLoading(false);
        return;
      }

      try {
        const repoUrl = `${apiBase}/github/${githubName}/profile`;
        const res = await fetch(repoUrl);

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        setProfile(data);
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

    fetchProfile();
  }, [githubName]);

  if (loading) {
    return (
      <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
        Loading profile...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
        Profile error: {error}
      </div>
    );
  }

  return (
    <div className="rounded-md bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex gap-4">
        <img
          src={profile?.avatar_url}
          className="h-[75px] w-[75px] rounded-full"
          draggable="false"
        />
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-lg font-extrabold">{profile?.name}</span>
          <span className="font-bold text-neutral-500 dark:text-neutral-400">
            {profile?.login}
          </span>
          <span className="font-bold text-neutral-500 dark:text-neutral-400">
            {profile?.bio}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[26px_1fr] items-center gap-x-3 gap-y-2">
        <img src="/images/gmail.png" className="h-6 w-6" />
        <span className="selectable">{profile?.email}</span>
        <img src="/images/github.png" className="h-6 w-6" />
        <a className="hover:text-white" href={profile?.html_url}>
          Open GitHub
        </a>
        <img src="/images/velog.png" className="h-6 w-6" />
        <a className="hover:text-white" href={`https://velog.io/@${velogName}`}>
          Open Velog
        </a>
      </div>
    </div>
  );
}

export default Profile;
