import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  RefObject,
  TextareaHTMLAttributes,
  useImperativeHandle,
  useRef,
} from "react";
import styled, { CSSProperties } from "styled-components";

export interface InnerTextboxProps {
  startAdornment?: boolean;
  endAdornment?: boolean;
}

export interface InnerTextboxButtonProps {
  position: "start" | "end";
}

const InnerTextbox = styled.input<InnerTextboxProps>`
  border: none;
  flex-grow: 1;
  &:focus {
    outline: none;
  }
  background: transparent;
  padding-left: ${(props) => (props.startAdornment ? "25px" : "5px")};
  padding-right: ${(props) => (props.endAdornment ? "25px" : "5px")};
  color: inherit;
  font-size: inherit;
`;

const InnerTextArea = styled.textarea<InnerTextboxProps>`
  border: none;
  flex-grow: 1;
  &:focus {
    outline: none;
  }
  resize: none;
  background: transparent;
  margin-left: ${(props) => (props.startAdornment ? "20px" : "5px")};
  margin-right: ${(props) => (props.endAdornment ? "20px" : "5px")};
  min-height: 44px;
  color: inherit;
  font-size: inherit;
`;

export const TextboxButton = styled.button<InnerTextboxButtonProps & ButtonHTMLAttributes<HTMLButtonElement>>`
  position: absolute;
  ${(props) => (props.position === "start" ? "left" : "right")}: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  :disabled {
    cursor: default;
  }

  &:hover:not(:disabled) {
    filter: drop-shadow(0px 0px 2px #000);
  }

  &:active:not(:disabled) {
    filter: drop-shadow(0 0 0 #000);
  }
`;

const TextboxWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.borderColor};
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  -moz-box-align: center;
  align-items: center;
  padding: 12px;
  margin: 5px;
  min-height: 44px;
`;

export type TextboxProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    endAdornment?: JSX.Element;
    startAdornment?: JSX.Element;
    className?: string;
    style?: CSSProperties | undefined;
    variant?: "textbox" | "textarea" | undefined;
  };

function Textbox(
  { startAdornment, endAdornment, className, style, variant, ...props }: TextboxProps,
  ref: ForwardedRef<any>,
): JSX.Element {
  const innerRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => innerRef.current);

  return (
    <TextboxWrapper
      onClick={() => {
        innerRef?.current?.focus();
      }}
      className={className}
      style={style}>
      {startAdornment}

      {variant === "textarea" ? (
        <InnerTextArea
          {...props}
          ref={innerRef as RefObject<HTMLTextAreaElement>}
          endAdornment={endAdornment !== undefined}
          startAdornment={startAdornment !== undefined}
        />
      ) : (
        <InnerTextbox
          {...props}
          ref={innerRef as RefObject<HTMLInputElement>}
          endAdornment={endAdornment !== undefined}
          startAdornment={startAdornment !== undefined}
        />
      )}
      {endAdornment}
    </TextboxWrapper>
  );
}

export default forwardRef(Textbox);
