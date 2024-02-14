import { Link } from "react-router-dom";
import styled, { DefaultTheme } from "styled-components";

import { device } from "../../utils/breakpoints";

export interface GenericWrapperProps {
  transparent?: boolean;
}

const LightTheme: DefaultTheme = {
  background: `#fff`,
  backgroundPage: `radial-gradient(
    100% 93.08% at 0% 0%,
    rgba(224, 32, 32, 0.05) 0%,
    rgba(250, 100, 0, 0.05) 17.71%,
    rgba(250, 180, 0, 0.05) 34.37%,
    rgba(110, 210, 0, 0.05) 50.52%,
    rgba(0, 145, 255, 0.05) 66.67%,
    rgba(100, 55, 255, 0.05) 82.81%,
    rgba(180, 35, 225, 0.05) 100%
  )
  #ffffff`,
  backgroundFeed: `rgba(255, 255, 255, 0.32)`,
  backgroundNav: `rgba(255, 255, 255, 0.75)`,
  backgroundWrapper: `rgba(255, 255, 255, 0.96)`,
  backgroundModal: `#fafafa`,
  backgroundButton: `#000`,
  backgroundButtonHover: `#2f2f2f`,
  backgroundButtonWhite: `#fff`,
  backgroundButtonWhiteHover: `#f5f5f5`,
  shadowColor: `#000`,
  borderColor: `#000`,
  buttonColor: `#fff`,
  lightBorderColor: `rgba(0, 0, 0, 0.12)`,
  textColor: `#000`,
  lightTextColor: `rgba(0, 0, 0, 0.48)`,
  svgPathFillColor: `#000`,
  svgPathInverseFillColor: `#fff`,
};

const DarkTheme: DefaultTheme = {
  background: `#000`,
  backgroundPage: `radial-gradient(
    100% 93.08% at 0% 0%,
    rgba(224, 32, 32, 0.05) 0%,
    rgba(250, 100, 0, 0.05) 17.71%,
    rgba(250, 180, 0, 0.05) 34.37%,
    rgba(110, 210, 0, 0.05) 50.52%,
    rgba(0, 145, 255, 0.05) 66.67%,
    rgba(100, 55, 255, 0.05) 82.81%,
    rgba(180, 35, 225, 0.05) 100%
  )
  #333333`,
  backgroundFeed: `rgba(25, 25, 25, 0.32)`,
  backgroundNav: `rgba(25, 25, 25, 0.75)`,
  backgroundWrapper: `rgba(25, 25, 25, 0.96)`,
  backgroundModal: `#050505`,
  backgroundButton: `#fff`,
  backgroundButtonHover: `#d0d0d0`,
  backgroundButtonWhite: `#000`,
  backgroundButtonWhiteHover: `#0b0b0b`,
  shadowColor: `#fff`,
  borderColor: `#fff`,
  buttonColor: `#000`,
  lightBorderColor: `rgba(255, 255, 255, 0.12)`,
  textColor: `#fff`,
  lightTextColor: `rgba(255, 255, 255, 0.48)`,
  svgPathFillColor: `#fff`,
  svgPathInverseFillColor: `#000`,
};

const PageWrapper = styled.div`
  padding-top: 80px;
  box-shadow: 0px -24px 32px -16px rgba(0, 0, 0, 0.04);
  background: ${(props) => props.theme.backgroundPage};
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  transition: all 0.5s linear;
`;

const TransparentWrapper = styled.div`
  margin: 30px 64px 30px 64px;
  display: flex;
  flex-direction: column;

  @media ${device.tabletM} {
    margin: 20px 40px 20px 40px;
  }

  @media ${device.tabletS} {
    margin: 10px 15px 10px 15px;
  }
`;

const GenericWrapper = styled.div<GenericWrapperProps>`
  background: ${(props) => (props.transparent ? "transparent" : props.theme.backgroundWrapper)};
  box-shadow: ${(props) => (props.transparent ? "none" : `0 2px 6px rgba(0, 0, 0, 0.35)`)};
  border-radius: 64px;
  margin: 30px 64px 30px 64px;
  display: flex;
  flex-direction: column;

  @media ${device.tabletM} {
    margin: 20px 40px 20px 40px;
  }

  @media ${device.tabletS} {
    margin: 10px 15px 10px 15px;
  }
`;

const PaddedWrapper = styled(GenericWrapper)`
  padding: 30px;
  justify-content: space-around;
  align-items: center;

  :last-of-type {
    margin-bottom: 100px;
  }
`;

const EditorWrapper = styled(GenericWrapper)`
  padding: 30px;
  justify-content: space-around;
  flex-direction: row;

  :last-of-type {
    margin-bottom: 100px;
  }

  @media ${device.desktopS} {
    flex-direction: column;
  }
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inherit;

  :visited {
    color: inherit;
  }
`;

const Title = styled.h2`
  font-weight: 900;
  font-size: 24px;
  margin: 10px 0px;
`;

const Subtitle = styled.h4`
  font-weight: 700;
  font-size: 12px;
  margin: 8px 0px;
`;

export {
  ButtonLink,
  DarkTheme,
  EditorWrapper,
  GenericWrapper,
  LightTheme,
  PaddedWrapper,
  PageWrapper,
  Subtitle,
  Title,
  TransparentWrapper,
};
