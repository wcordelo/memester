import styled, { CSSProperties } from "styled-components";

import { device } from "../../utils/breakpoints";

interface HeaderWrapperProps {
  hasSupertitle?: boolean;
  hasSubtitle?: boolean;
}

const HeaderWrapper = styled.div<HeaderWrapperProps>`
  width: 100%;
  box-shadow: 0px -32px 48px -16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;

  min-height: ${(props) => 150 + (Number(props.hasSupertitle) + Number(props.hasSubtitle)) * 50}px;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 40px 40px 40px;
  min-width: 545px;
  z-index: 2;

  @media ${device.tabletS} {
    min-width: calc(100% - 20px);
    padding: 20px 10px 10px 10px;
  }
`;

const HeaderTitle = styled.h2`
  font-weight: 900;
  font-size: 64px;
  line-height: 72px;
  color: ${(props) => props.theme.textColor};
  margin: 10px 0 10px 0;
  text-transform: capitalize;

  @media ${device.mobileS} {
    font-size: 52px;
  }
`;

const HeaderSubtitle = styled.h4`
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 0;
`;

const HeaderSupertitle = styled.p`
  font-weight: 900;
  font-size: 32px;
  line-height: 48px;
  background: linear-gradient(90.07deg, #2fb8d4 0.07%, #294bff 77.14%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin: 0 0 10px 0;

  @media ${device.mobileS} {
    font-size: 28px;
  }
`;

export type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  supertitle?: string;
  subtitle?: string;
  className?: string;
  style?: CSSProperties | undefined;
};

function Header({ title, supertitle, subtitle, className, style, children }: HeaderProps): JSX.Element {
  return (
    <HeaderWrapper className={className} style={style} hasSupertitle={!!supertitle} hasSubtitle={!!subtitle}>
      <HeaderContent>
        {supertitle && <HeaderSupertitle>{supertitle}</HeaderSupertitle>}
        <HeaderTitle>{title}</HeaderTitle>
        {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
        {children}
      </HeaderContent>
    </HeaderWrapper>
  );
}

export default Header;
