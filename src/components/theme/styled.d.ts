import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    backgroundPage: string;
    backgroundFeed: string;
    backgroundNav: string;
    backgroundWrapper: string;
    backgroundModal: string;
    backgroundButton: string;
    backgroundButtonHover: string;
    backgroundButtonWhite: string;
    backgroundButtonWhiteHover: string;
    shadowColor: string;
    borderColor: string;
    buttonColor: string;
    lightBorderColor: string;
    textColor: string;
    lightTextColor: string;
    svgPathFillColor: string;
    svgPathInverseFillColor: string;
  }
}
