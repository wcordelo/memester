import styled from "styled-components";

import { device } from "../../utils/breakpoints";
import RightSidebar from "../home/RightSidebar";

export interface SlideoutSidebarWrapperProps {
  showSearchBar: boolean;
  showSidebar: boolean;
}

const SlideoutSidebarWrapper = styled.div<SlideoutSidebarWrapperProps>`
  display: none;
  width: 100vw;
  max-height: 0px;
  position: absolute;
  top: 80px;
  left: 100vw;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  background: ${(props) => props.theme.background};
  z-index: 1000;
  overflow: hidden;

  ${(props) => props.showSearchBar && "top: 146px;"}

  ${(props) =>
    props.showSidebar &&
    `
      left: 0;
      height: auto;
      min-height: 100vh;
      max-height: 1000vh;
  `} 

  @media ${device.tabletL} {
    display: block;
  }
`;

export type SlideoutSidebarProps = React.HTMLAttributes<HTMLDivElement> & SlideoutSidebarWrapperProps;

function SlideoutSidebar({ showSearchBar, showSidebar, ...props }: SlideoutSidebarProps): JSX.Element {
  return (
    <SlideoutSidebarWrapper showSearchBar={showSearchBar} showSidebar={showSidebar} {...props}>
      <RightSidebar />
    </SlideoutSidebarWrapper>
  );
}

export default SlideoutSidebar;
