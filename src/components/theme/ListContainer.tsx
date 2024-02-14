import { ReactNode } from "react";
import styled from "styled-components";

import ListItem, { ListItemProps } from "./ListItem";

export interface ListContainerProps {
  children?: ReactNode;
  title?: string;
  items?: ListItemProps[];
  capitalize?: boolean;
  className?: string;
}

const ListContainerTitle = styled.p`
  order: -1;
  font-weight: 900;
  font-size: 24px;
  margin: 10px 0px;
`;

const ListContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.backgroundWrapper};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 25px;
`;

const ListItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

function ListContainer({ children, title, items, capitalize, className }: ListContainerProps): JSX.Element {
  return (
    <ListContainerWrapper className={className}>
      {title && <ListContainerTitle>{title}</ListContainerTitle>}
      {items != null && (
        <ListItemWrapper>
          {items.map((i) => (
            <ListItem {...i} key={i.title + (i.subtitle ?? "")} image={i.image} capitalize={capitalize} />
          ))}
        </ListItemWrapper>
      )}
      {children}
    </ListContainerWrapper>
  );
}

export default ListContainer;
