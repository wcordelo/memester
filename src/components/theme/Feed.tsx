import { ReactNode } from "react";
import styled from "styled-components";

import { device } from "../../utils/breakpoints";
import LeftSidebar from "../home/LeftSidebar";
import RightSidebar from "../home/RightSidebar";

const FeedContentWrapper = styled.div`
  width: calc(100% - 100px);
  border-top-left-radius: 64px;
  border-top-right-radius: 64px;
  background: ${(props) => props.theme.backgroundFeed};
  box-shadow: 0px -24px 32px -16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 30px 50px 0px 50px;

  @media ${device.desktopS} {
    width: calc(100% - 20px);
    padding: 30px 10px 0px 10px;
  }
`;

const ContentWrapper = styled.div`
  width: 50%;
  min-width: 760px;
  max-width: 40%;
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;

  @media ${device.desktopS} {
    min-width: 0px;
    width: 100%;
    max-width: 100%;
  }
`;

const RightSidebarWrapper = styled(RightSidebar)`
  width: 286px;

  @media ${device.tabletL} {
    display: none;
  }
`;

export type FeedProps = React.HTMLAttributes<HTMLDivElement> & {
  tags?: string[];
  children?: ReactNode;
};

function Feed({ children }: FeedProps): JSX.Element {
  return (
    <FeedContentWrapper>
      <LeftSidebar />

      <ContentWrapper>{children}</ContentWrapper>

      <RightSidebarWrapper className="main-right-sidebar" />
    </FeedContentWrapper>
  );
}

export default Feed;
