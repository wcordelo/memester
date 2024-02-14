import { Link } from "react-router-dom";
import styled from "styled-components";

import { parseIPFSURL } from "../../utils";
import Button from "../theme/Button";

interface MemeListProps {
  children?: React.ReactNode;
  memes: MemeDetails[];
  selectMode: boolean;
  onSelected?: (meme: MemeDetails) => void;
}

export interface MemeDetails {
  id: string;
  url: string;
  href?: string;
}

const MemeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
  padding: 15px;
`;

const MemeImageWrapper = styled.div`
  width: calc(20% - 20px);
  min-width: 150px;
  max-width: calc(25% - 20px);
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  max-height: 300px;
  overflow: hidden;
  position: relative;

  &:hover {
    div {
      opacity: 1;
    }
  }
`;

const MemeImage = styled.img`
  align-self: center;
  width: 100%;
`;

const MemeOverlay = styled.div`
  z-index: 500;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  transition: 0.3s ease;
`;

const MemeLink = styled(Link)`
  display: flex;
`;

function MemeList({ children, memes, selectMode, onSelected }: MemeListProps): JSX.Element {
  return (
    <>
      <MemeWrapper>
        {memes.map((i) => {
          return selectMode && onSelected ? (
            <MemeImageWrapper key={i.id ?? i.url}>
              <MemeImage src={parseIPFSURL(i.url)} />
              <MemeOverlay>
                <Button onClick={() => onSelected(i)} variant="colored">
                  Use This Meme
                </Button>
              </MemeOverlay>
            </MemeImageWrapper>
          ) : (
            <MemeImageWrapper key={i.id ?? i.url}>
              <MemeLink to={i.href ?? ""}>
                <MemeImage src={parseIPFSURL(i.url)} />
              </MemeLink>
            </MemeImageWrapper>
          );
        })}
      </MemeWrapper>
      {children}
    </>
  );
}

export default MemeList;
