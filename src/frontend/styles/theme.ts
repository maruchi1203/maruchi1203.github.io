import type { DefaultTheme } from "styled-components/dist/types";

const fontSize = {
  small: "0.875rem",
  medium: "1rem",
  large: "1.25rem",
  superlarge: "1.75rem",
};

const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "32px",
};

const breakpoints = {
  mobile: "480px", // 폰 세로
  tablet: "768px", // 태블릿 가로, 폰 세로
  laptop: "1024px", // 태블릿 가로, 노트북
  desktop: "1280px", // 데스트탑
};

const flex = {
  flexRow: `
    display: flex;
    justify-content: center;
    border-radius: 5px;
  `,
  flexCol: `
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
  `,
};

const gap = "gap: 1rem;";

export const lightTheme: DefaultTheme = {
  primary: "white",
  secondary: "#BBBBBB",
  background: "#F0F0F0",
  text: "#444444",
  fontSize,
  spacing,
  breakpoints,
  flex,
  gap,
};

export const darkTheme: DefaultTheme = {
  primary: "#222222",
  secondary: "#AAAAAA",
  background: "#111111",
  text: "#EEEEEE",
  fontSize,
  spacing,
  breakpoints,
  flex,
  gap,
};
