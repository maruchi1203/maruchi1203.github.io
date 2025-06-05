import { styled, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@styles/theme.ts";
import { useEffect, useState } from "react";
import RepositoryContainer from "./components/RepositoryContainer.tsx";
import Profile from "./components/Profile.tsx";
import ArticleContainer from "./components/ArticleContainer.tsx";

// #region styled
const Wrapper = styled.div`
  ${(props) => props.theme.flex.flexCol}
  border-radius: 0px;

  width: 100%;
  min-height: 100vh;

  background-color: ${(props) => props.theme.background};

  a {
    text-decoration: none;
    color: ${(props) => props.theme.text};
  }
`;

const TotalContainer = styled.div`
  ${(props) => props.theme.flex.flexCol}
  ${(props) => props.theme.gap}
  margin-top: 20px;
  margin-bottom: 20px;

  width: ${(props) => props.theme.breakpoints.desktop};
  @media screen and (max-width: ${(props) => props.theme.breakpoints.desktop}) {
    width: ${(props) => props.theme.breakpoints.laptop};
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.laptop}) {
    width: ${(props) => props.theme.breakpoints.tablet};
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: ${(props) => props.theme.breakpoints.mobile};
  }

  color: ${(props) => props.theme.text};
`;

const HeaderContainer = styled.div`
  ${(props) => props.theme.flex.flexRow}
  padding-left: 20px;
  padding-right: 20px;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 75px;

  background-color: ${(props) => props.theme.primary};
`;

const HeaderThemeToggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
  }

  .slider::before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;

    left: 4px;
    bottom: 4px;

    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  /* 체크 상태일 때 배경색 변경 */
  input:checked + .slider {
    background-color: ${(props) => props.theme.text};
  }

  /* 체크 상태일 때 원 이동 */
  input:checked + .slider::before {
    transform: translateX(26px);
  }
`;

const BodyContainer = styled.div`
  ${(props) => props.theme.flex.flexRow}
  ${(props) => props.theme.gap}

  width: 100%;
`;

const NavContainer = styled.div`
  ${(props) => props.theme.flex.flexCol}
  flex-grow: 0;
`;

const NavMenu = styled.div`
  background-color: ${(props) => props.theme.primary};
`;

const NavMenuItem = styled.a``;

const SectionContainer = styled.div`
  ${(props) => props.theme.flex.flexCol}
  ${(props) => props.theme.gap}
  flex-grow: 1;
`;

const FooterContainer = styled.div`
  ${(props) => props.theme.flex.flexRow}
  padding: 20px;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 70px;

  border-radius: 5px;

  background-color: ${(props) => props.theme.primary};
`;

const FooterMenu = styled.div`
  height: 75px;
  margin: 0 20px 0 20px;
  gap: 20px;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const FooterImageItem = styled.img`
  width: auto;
  height: 30px;
`;
// #endregion styled

function Blog() {
  const githubName = "maruchi1203";
  const velogName = "_roadhobo";

  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setDarkTheme] = useState(false);

  // #region useEffect
  useEffect(() => {
    const localStorTheme = localStorage.getItem("theme");

    if (localStorTheme === "dark") {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }

    setLoading(false);
  }, []);
  // #endregion useEffect

  const changeTheme = () => {
    localStorage.setItem("theme", isDarkTheme ? "light" : "dark");
    setDarkTheme(!isDarkTheme);
  };

  if (loading) return <p>🚚 로딩 중......</p>;

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <Wrapper>
        <TotalContainer>
          <HeaderContainer>
            <div></div>
            <HeaderThemeToggle>
              <input
                role="switch"
                type="checkbox"
                onChange={changeTheme}
                checked={isDarkTheme}
              />
              <span className="slider"></span>
            </HeaderThemeToggle>
          </HeaderContainer>
          <BodyContainer>
            <NavContainer>
              <Profile githubName={githubName} velogName={velogName} />
              <NavMenu>
                <NavMenuItem></NavMenuItem>
              </NavMenu>
            </NavContainer>
            <SectionContainer>
              <RepositoryContainer githubName={githubName} />
              <ArticleContainer velogName={velogName} />
            </SectionContainer>
          </BodyContainer>
          <FooterContainer>
            <div>All rights reserved 2025 ⓒ maruchi1203. Powered by GitHub</div>
            <FooterMenu>
              <FooterImageItem
                src={`${import.meta.env.BASE_URL}images/typescript.png`}
                draggable="false"
              />
              <FooterImageItem
                src={`${import.meta.env.BASE_URL}images/react.png`}
                draggable="false"
              />
              <FooterImageItem
                src={`${import.meta.env.BASE_URL}images/vite.png`}
                draggable="false"
              />
              <FooterImageItem
                src={`${import.meta.env.BASE_URL}images/github.png`}
                draggable="false"
              />
              <FooterImageItem
                src={`${import.meta.env.BASE_URL}images/render.png`}
                draggable="false"
              />
            </FooterMenu>
          </FooterContainer>
        </TotalContainer>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Blog;
