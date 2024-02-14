import styled from "styled-components";

import { ButtonLink } from "./Theme";

export interface ListItemProps {
  title: string;
  subtitle?: string;
  href?: string;
  color?: string;
  image?: string;
  imageStretch?: boolean;
  capitalize?: boolean;
  pinned?: boolean;
}

export const ListItemWrapper = styled(ButtonLink)`
  display: flex;
  flex-direction: row;
  margin: 5px 0;
  position: relative;
  border-radius: 3px;
`;

export interface ItemProps {
  capitalize?: boolean;
}

export const ItemRight = styled.div<ItemProps>`
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  height: 48px;
  justify-content: center;

  p {
    margin: 0;
    ${(props) => props.capitalize && "text-transform: capitalize;"};
  }
`;

export const stringToColour = function (str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + ((value < 128 ? value + 128 : value) % 256).toString(16)).substring(2);
  }
  return colour;
};

export interface ListImageProps {
  text: string;
  color?: string;
  image?: string;
  stretch?: boolean;
}

export const ListImage = styled.img<ListImageProps>`
  height: ${(props) => (props.stretch ? "48px" : "24px")};
  width: ${(props) => (props.stretch ? "48px" : "24px")};
  padding: ${(props) => (props.stretch ? "0px" : "12px")};
  background: ${(props) => props.color ?? stringToColour(props.text)};
  border: 0px;
  border-radius: 16px;
  ${(props) => (props.image ?? props.color ? "" : "filter: saturate(0.7);")};
  ${(props) => props.stretch && "flex-shrink: 0;"};
`;

const DescriptionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  p {
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.lightTextColor};
  }
`;

const ItemDescription = styled.p`
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemTitle = styled.p`
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 900;
  font-size: 14px;
  line-height: 20px;
`;

const PinP = styled.p`
  color: transparent;
  text-shadow: 0 0 0 ${(props) => props.theme.textColor};
  font-size: 10px;
  margin-left: auto;
`;

function ListItem({
  title,
  subtitle,
  color,
  image,
  imageStretch,
  href,
  capitalize,
  pinned,
}: ListItemProps): JSX.Element {
  return (
    <ListItemWrapper to={href ?? ""}>
      <ListImage
        src={image ?? "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="}
        text={title}
        image={image}
        color={color}
        stretch={imageStretch}
      />
      <ItemRight capitalize={capitalize}>
        <ItemTitle>{title}</ItemTitle>
        <DescriptionRow>
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          <ItemDescription>{subtitle || "\u00A0"}</ItemDescription>
        </DescriptionRow>
      </ItemRight>
      {pinned && <PinP>📌</PinP>}
    </ListItemWrapper>
  );
}

export default ListItem;
