import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import styled from "styled-components";

import { ReactComponent as Cog } from "../../assets/cog.svg";
import { FONT_SIZES } from "../../constants";
import { TemplateText } from "../../hooks/utils/template";

export interface ConfigPopoverProps {
  onSizeChange: (val: number) => void;
  onFontChange: (val: string) => void;
  item: TemplateText;
  disabled: boolean;
}

const ConfigWrapper = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: -88px;
  border-radius: 9px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  z-index: 500;
  background: white;
  width: 200px;
  padding: 10px;
`;

function ConfigPopover({ onSizeChange, onFontChange, item, disabled }: ConfigPopoverProps): JSX.Element {
  const popover = useRef(null);
  const picker = useRef(null);

  const [isOpen, setOpen] = useState(false);

  useClickAway(picker, (e) => {
    if (
      (e?.target as HTMLElement)?.classList.contains("MuiBackdrop-root") ||
      (e?.target as HTMLElement)?.parentElement?.classList.contains("MuiList-root")
    ) {
      return;
    }
    setOpen(false);
  });

  return (
    <ConfigWrapper ref={picker}>
      <Cog onClick={(e) => !disabled && setOpen(!isOpen)} />

      {isOpen && (
        <Popover ref={popover}>
          {/* TODO: replace these with our own styled comboboxes/selectors */}
          <FormControl fullWidth>
            <InputLabel id="font-select-label">Font</InputLabel>
            <Select
              style={{ marginBottom: "15px", fontFamily: item.fontFamily }}
              labelId="font-select-label"
              id="font-select"
              value={item.fontFamily}
              label="Font"
              onChange={(e) => {
                onFontChange(e.target.value);
              }}>
              {["Impact", "Arial", "Comic Sans"].map((f) => (
                <MenuItem key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="font-size-select-label">Font Size</InputLabel>
            <Select
              labelId="font-size-select-label"
              id="font-size-select"
              value={item.fontSize}
              label="Font Size"
              onChange={(e) => {
                onSizeChange(parseInt(e.target.value.toString()));
              }}>
              {FONT_SIZES.map((i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Popover>
      )}
    </ConfigWrapper>
  );
}

export default ConfigPopover;
