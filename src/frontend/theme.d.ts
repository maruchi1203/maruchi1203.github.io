import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
      superlarge: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      laptop: string;
      desktop: string;
    };
    flex: {
      flexRow: string;
      flexCol: string;
    };
    gap: string;
  }
}
