import styled from "styled-components";

import { device } from "../../utils/breakpoints";
import PopularCategories from "../theme/sidebars/PopularCategories";

const LeftSidebarWrapper = styled.div`
  width: 286px;

  @media ${device.desktopS} {
    display: none;
  }
`;

function LeftSidebar(): JSX.Element {
  return (
    <LeftSidebarWrapper>
      <PopularCategories />
    </LeftSidebarWrapper>
  );
}

export default LeftSidebar;
