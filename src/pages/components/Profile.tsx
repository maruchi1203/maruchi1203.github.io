import theme from "@styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Userdata {
  login: string;
  name: string;
  bio: string;
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

function Profile(props: ProfileProps) {
  const { username } = props;

  const [userdata, setUserData] = useState<Userdata>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setUserData(data);
        console.log("Profile.tsx::=> ", data);
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
    return <Wrapper>💁‍♂️로딩 중......</Wrapper>;
  }
  if (error) {
    return <Wrapper>❓죄송합니다. 데이터에 오류가 있습니다.</Wrapper>;
  }

  return (
    <Wrapper>
      <BasicInfoContainer>
        <Avatar src={userdata?.avatar_url} />
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
    </Wrapper>
  );
}

export default Profile;
