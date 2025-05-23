import theme from "@styles/theme";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Userdata {
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
  username: string;
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
  width: auto;
  height: inherit;
`;

function Profile(props: ProfileProps) {
  const { username } = props;

  const [userdata, setUserData] = useState<Userdata>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const res = await axios(`https://api.github.com/users/${username}`, {
          headers: {
            Authorization: `token ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
        });

        setUserData(res.data);
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

    fetchUserData();
  }, [username]);

  if (loading) {
    return <Wrapper>🚚 로딩 중......</Wrapper>;
  }
  if (error) {
    return <Wrapper>❓데이터에 오류가 있습니다</Wrapper>;
  }

  return (
    <Wrapper>
      <BasicInfoContainer>
        <Avatar src={userdata?.avatar_url} draggable="false" />
        <ContextContainer>
          <span className="w-full text-3xl font-bold">{userdata?.name}</span>
          <span className="w-full font-semibold text-gray-500">
            {userdata?.login}
          </span>
          <span className="w-full text-center font-extrabold text-gray-500">
            {userdata?.bio}
          </span>
        </ContextContainer>
      </BasicInfoContainer>
      <LinkContainer>
        <LogoImg src="/src/images/gmail.png" />
        <span className="selectable">{userdata?.email}</span>
        <LogoImg src="/src/images/github.png" />
        <LinkButton href={userdata?.html_url}>Github 바로가기</LinkButton>
        <LogoImg src="/src/images/velog.png" />
        <LinkButton href="https://velog.io/@_roadhobo">
          Velog 바로가기
        </LinkButton>
      </LinkContainer>
    </Wrapper>
  );
}

export default Profile;
