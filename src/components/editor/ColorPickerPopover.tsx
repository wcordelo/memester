import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useClickAway } from "react-use";
import styled from "styled-components";

export interface PopoverPickerProps {
  color: string;
  onChange: (val: string) => void;
  disabled: boolean;
}

const Picker = styled.div`
  position: relative;
`;

const Swatch = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid ${(props) => props.theme.buttonColor};
  border-radius: 6px;
  cursor: pointer;
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: -88px;
  border-radius: 9px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  z-index: 500;
`;

function ColorPickerPopover({ color, onChange, disabled }: PopoverPickerProps): JSX.Element {
  const popover = useRef(null);
  const picker = useRef(null);

  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickAway(picker, close);

  return (
    <Picker ref={picker}>
      <Swatch className="swatch" style={{ backgroundColor: color }} onClick={(e) => !disabled && toggle(!isOpen)} />

      {isOpen && (
        <Popover ref={popover}>
          <HexColorPicker color={color} onChange={onChange} />
        </Popover>
      )}
    </Picker>
  );
}

export default ColorPickerPopover;
