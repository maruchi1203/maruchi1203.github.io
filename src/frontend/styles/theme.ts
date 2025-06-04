const darkThemeToggle = false;

const lightColors = {
  primary: "white",
  secondary: "#BBBBBB",
  background: "#F0F0F0",
  text: "#444444",
};

const darkColors = {
  primary: "#313437",
  secondary: "#6F7D7B",
  background: "#1D2C2C",
  text: "#9FA6A1",
};

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

const theme = {
  darkThemeToggle,
  lightColors,
  darkColors,
  fontSize,
  spacing,
  breakpoints,
  flex,
  gap,
};

export default theme;
