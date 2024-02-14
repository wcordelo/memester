import { InputHTMLAttributes } from "react";
import styled, { CSSProperties } from "styled-components";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  checked: boolean;
  onChange: () => void;
  style?: CSSProperties | undefined;
};

const CheckboxLabel = styled.label`
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`;

const CheckboxInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background-color: ${(props) => props.theme.background};
  margin: 0;

  font: inherit;
  color: ${(props) => props.theme.textColor};
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid ${(props) => props.theme.textColor};
  border-radius: 0.15em;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;

  ::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em ${(props) => props.theme.textColor};
    background-color: CanvasText;
  }

  :checked::before {
    transform: scale(1);
  }

  :focus {
    outline: max(2px, 0.15em) solid ${(props) => props.theme.textColor};
    outline-offset: max(2px, 0.15em);
  }
`;

const LabelContent = styled.span`
  margin-left: 5px;
`;

function Checkbox({ label, checked, style, onChange }: CheckboxProps): JSX.Element {
  return (
    <CheckboxLabel style={style}>
      <CheckboxInput type="checkbox" checked={checked} onChange={onChange} />
      <LabelContent>{label}</LabelContent>
    </CheckboxLabel>
  );
}

export default Checkbox;
