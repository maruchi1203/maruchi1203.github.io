import { styled, ThemeProvider } from "styled-components";
import theme from "@styles/theme";
import { useEffect, useState } from "react";
import RepositoryContainer from "./components/RepositoryContainer.tsx";
import Profile from "./components/Profile.tsx";
import ArticleContainer from "./components/ArticleContainer.tsx";

const getThemeColor = () => {
  if (theme.darkThemeToggle) {
    return theme.darkColors;
  } else {
    return theme.lightColors;
  }
};

const Wrapper = styled.div`
  ${theme.flex.flexCol}
  border-radius: 0px;

  width: 100%;
  height: auto;

  background-color: ${theme.lightColors.background};

  a {
    text-decoration: none;
    color: ${theme.lightColors.text};
  }
`;

const TotalContainer = styled.div`
  ${theme.flex.flexCol}
  ${theme.gap}
  margin-top: 20px;
  margin-bottom: 20px;

  width: ${theme.breakpoints.desktop};
  @media screen and (max-width: ${theme.breakpoints.desktop}) {
    width: ${theme.breakpoints.laptop};
  }
  @media screen and (max-width: ${theme.breakpoints.laptop}) {
    width: ${theme.breakpoints.tablet};
  }
  @media screen and (max-width: ${theme.breakpoints.tablet}) {
    width: ${theme.breakpoints.mobile};
  }

  color: ${getThemeColor().text};
`;

const HeaderContainer = styled.div`
  width: 100%;
  height: 75px;

  display: flex;
  flex-direction: row;

  background-color: ${getThemeColor().primary};

  border-radius: 5px;
  justify-content: right;
`;

const HeaderMenu = styled.div`
  height: 75px;
  margin: 0 20px 0 20px;
  gap: 20px;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderImageItem = styled.img`
  width: auto;
  height: 30px;
`;

const BodyContainer = styled.div`
  ${theme.flex.flexRow}
  ${theme.gap}

  width: 100%;
`;

const NavContainer = styled.div`
  ${theme.flex.flexCol}
  flex-grow: 0;
`;

const NavMenu = styled.div`
  background-color: ${getThemeColor().primary};
`;

const NavMenuItem = styled.a``;

const SectionContainer = styled.div`
  ${theme.flex.flexCol}
  ${theme.gap}
  flex-grow: 1;
`;

const FooterContainer = styled.div`
  width: 100%;
  padding: 20px;

  border-radius: 5px;

  background-color: ${getThemeColor().primary};
`;

function Blog() {
  const githubName = "maruchi1203";
  const velogName = "_roadhobo";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <TotalContainer>
          <HeaderContainer>
            <HeaderMenu>
              <HeaderImageItem
                src={`${import.meta.env.BASE_URL}images/typescript.png`}
                draggable="false"
              />
              <HeaderImageItem
                src={`${import.meta.env.BASE_URL}images/react.png`}
                draggable="false"
              />
              <HeaderImageItem
                src={`${import.meta.env.BASE_URL}images/vite.png`}
                draggable="false"
              />
              <HeaderImageItem
                src={`${import.meta.env.BASE_URL}images/github.png`}
                draggable="false"
              />
              <HeaderImageItem
                src={`${import.meta.env.BASE_URL}images/render.png`}
                draggable="false"
              />
            </HeaderMenu>
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
          </FooterContainer>
        </TotalContainer>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Blog;
