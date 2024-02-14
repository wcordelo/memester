import styled, { CSSProperties } from "styled-components";

import { device } from "../../utils/breakpoints";
import Footer from "../theme/Footer";
import MemeCompetitionsList from "../theme/sidebars/MemeCompetitionsList";
import PopularCategories from "../theme/sidebars/PopularCategories";

const LeftSidebarContent = styled.div`
  display: none;

  @media ${device.desktopS} {
    display: block;
  }
`;

export type RightSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  style?: CSSProperties | undefined;
};

function RightSidebar({ style, className }: RightSidebarProps): JSX.Element {
  return (
    <div className={className} style={style}>
      <LeftSidebarContent>
        <PopularCategories />
      </LeftSidebarContent>
      <MemeCompetitionsList />
      <Footer />
    </div>
  );
}

export default RightSidebar;
