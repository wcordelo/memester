import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import { device } from "../../utils/breakpoints";

export type InnerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  large?: boolean;
  loading?: boolean;
  variant?: "normal" | "outlined" | "colored" | "white";
  children: React.ReactNode;
};

const InnerButton = styled.button<InnerButtonProps>`
  background: ${(props) => props.theme.backgroundButton};
  box-shadow: 0px 4px 16px -4px rgba(34, 0, 51, 0.16);
  border-radius: 24px;
  transition: color 0.15s ease-in-out, fill 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: ${(props) => props.theme.buttonColor};
  padding: 13px 40px;
  font-weight: 800;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  &:active:not(:disabled) {
    box-shadow: 0px 4px 16px -4px rgba(34, 0, 51, 0.56);
    background: #000000;
  }

  &:hover {
    ${(props) => !props.disabled && `background: ${props.theme.backgroundButtonHover};`};
  }

  @media ${device.tabletM} {
    padding: 13px 26px;
  }

  @media ${device.mobileXS} {
    padding: 13px 18px;
    min-width: 56px;
  }

  ${(props) =>
    props.disabled &&
    `
        cursor: default;
        background: #666 !important;
        box-shadow: 0px 0px 0px 0px;
  `};

  ${(props) =>
    props.variant === "outlined" &&
    `
        color: ${props.theme.backgroundButton};
        background: ${props.theme.buttonColor};
        border: 2px solid ${props.theme.backgroundButton};
        padding: 11px 38px;
        fill: ${props.theme.backgroundButton};

        &:hover {
          color: ${props.theme.buttonColor} !important;

          svg {
            transition: inherit;
            fill: ${props.theme.buttonColor} !important;
            path {
              fill: ${props.theme.buttonColor} !important;
            }
          }
        }
  
        @media ${device.tabletM} {
          padding: 11px 24px;
        }

        @media ${device.mobileXS} {
          padding: 13px 16px;
        }
    `};

  ${(props) =>
    props.variant === "colored" &&
    `
      background: linear-gradient(98.35deg, #2fb8d4 -11.59%, #294bff 106.18%);
      box-shadow: 0px 4px 16px -4px rgba(146, 73, 192, 0.19);
      color: white;

      &:hover {
        background: linear-gradient(98.35deg, #5fb8d4 -11.59%, #294bff 106.18%);
      }
      `};

  ${(props) =>
    props.variant === "white" &&
    `
      background: ${props.theme.backgroundButtonWhite};
      color: #1C61EB;
      box-shadow: unset;

      &:hover {
        background: ${props.theme.backgroundButtonWhiteHover};
      }
      `};

  ${(props) => props.large && `height: 64px;`};
`;

function Button({ loading, ...props }: InnerButtonProps): JSX.Element {
  return (
    <InnerButton {...props}>{loading ? <FontAwesomeIcon icon={faSpinner} spinPulse /> : props.children}</InnerButton>
  );
}

export default Button;
