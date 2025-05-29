import theme from "@styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";

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

interface ProfileProps {
  githubName: string;
  velogName: string;
  [key: string]: unknown;
}

const Wrapper = styled.div`
  ${theme.flex.flexCol}
  gap: 10px;
  padding: 20px;

  background-color: ${theme.lightColors.primary};
  border-radius: 5px;
`;

const BasicInfoContainer = styled.div`
  ${theme.flex.flexRow}
  flex-basis: max-content;
  padding: 10px;
`;

const Avatar = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 50%;
`;

const ContextContainer = styled.span`
  ${theme.flex.flexCol}
  justify-content: center;

  width: 100%;

  margin: 0px 20px 0px 15px;

  span {
    flex-basis: max-content;
  }

  .name {
    width: 100%;

    font-size: larger;
    font-weight: bolder;
  }

  .login {
    width: max-content;

    font-size: medium;
    font-weight: bold;

    color: ${theme.lightColors.secondary};
  }

  .bio {
    width: max-content;

    font-size: medium;
    font-weight: bold;

    color: ${theme.lightColors.secondary};
  }
`;

const LinkContainer = styled.div`
  display: grid;
  grid-template-columns: 26px 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  gap: 12px;

  width: 100%;

  padding-left: 20px;
`;

const LinkButton = styled.a`
  gap: 10px;

  width: 100%;

  color: ${theme.lightColors.text};

  :hover {
    color: white;
  }
`;

const LogoImg = styled.img`
  width: 30px;
  height: inherit;
`;

function Profile(props: ProfileProps) {
  const { githubName, velogName } = props;

  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const repoUrl = `${
          import.meta.env.VITE_API_BASE_URL
        }github/${githubName}/profile`;
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
    return <Wrapper>🚚 로딩 중......</Wrapper>;
  }
  if (error) {
    return <Wrapper>❓프로필 데이터에 오류가 있습니다 {error} </Wrapper>;
  }

  return (
    <Wrapper>
      <BasicInfoContainer>
        <Avatar src={profile?.avatar_url} draggable="false" />
        <ContextContainer>
          <span className="name">{profile?.name}</span>
          <span className="login">{profile?.login}</span>
          <span className="bio">{profile?.bio}</span>
        </ContextContainer>
      </BasicInfoContainer>
      <LinkContainer>
        <LogoImg src={`${import.meta.env.BASE_URL}images/gmail.png`} />
        <span className="selectable">{profile?.email}</span>
        <LogoImg src={`${import.meta.env.BASE_URL}images/github.png`} />
        <LinkButton href={profile?.html_url}>Github 바로가기</LinkButton>
        <LogoImg src={`${import.meta.env.BASE_URL}images/velog.png`} />
        <LinkButton href={`https://velog.io/@${velogName}`}>
          Velog 바로가기
        </LinkButton>
      </LinkContainer>
    </Wrapper>
  );
}

export default Profile;
