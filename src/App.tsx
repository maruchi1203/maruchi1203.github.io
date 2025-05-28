import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { styled, createGlobalStyle } from "styled-components";
import { Blog, Portfolio } from "./pages";

const Wrapper = styled.div`
  height: auto;
  display: flex;
  background-color: black;
  justify-content: center;
`;

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Moneygraphy-Rounded';
    src: url('./fonts/Moneygraphy-Rounded.eot');
    src: url('./fonts/Moneygraphy-Rounded.eot?#iefix') format('embedded-opentype'),
         url('./fonts/Moneygraphy-Rounded.woff2') format('woff2'),
         url('./fonts/Moneygraphy-Rounded.woff') format('woff'),
         url('./fonts/Moneygraphy-Rounded.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  body {
    font-family: 'Moneygraphy-Rounded', system-ui, -apple-system, BlinkMacSystemFont,
                 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
                 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  .selectable {
    -webkit-user-select:text;
    -moz-user-select:text;
    -ms-user-select:text;
    user-select:text;
  }
`;

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Blog />,
    },
    {
      path: "/portfolio",
      element: <Portfolio />,
    },
  ]);

  return (
    <Wrapper>
      <GlobalStyles />
      <RouterProvider router={router} />
    </Wrapper>
  );
}

export default App;
