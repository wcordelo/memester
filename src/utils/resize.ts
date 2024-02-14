import { Options } from "html2canvas";

import { closestFontSize } from ".";

export const MAX_MEME_WIDTH = 600;

export interface ScalingValues {
  top: number;
  left: number;
  width: number;
  height?: number;
  fontSize?: number;
}

export interface ScalingValuesFont {
  top: number;
  left: number;
  width: number;
  height?: number;
  fontSize: number;
}

export interface Scale {
  up: number;
  down: number;
}

export const html2CanvasOptions = (scale: number): Partial<Options> => {
  return {
    logging: false,
    windowWidth: 1000,
    windowHeight: 1000,
    onclone(_, element) {
      // Set height to integer floor in case it's a decimal
      // This was causing a white line at the bottom of some images
      element.style.height = `${Math.floor(element.getBoundingClientRect().height)}px`;
      for (const el of element.children) {
        const child = el as HTMLElement;
        const top = parseInt(child.style.top.slice(0, -2));
        const left = parseInt(child.style.left.slice(0, -2));
        const width = parseInt(child.style.width.slice(0, -2));
        const height = parseInt(child.style.height.slice(0, -2));
        let fontSize: number | undefined;
        if (child.tagName === "P") {
          fontSize = parseInt(child.style.fontSize.slice(0, -2));
        }

        const scaledValues = scaleValues(scale, top, left, width, height, fontSize);

        child.style.top = `${scaledValues.top}px`;
        child.style.left = `${scaledValues.left}px`;
        child.style.width = `${scaledValues.width}px`;
        if (scaledValues.height) {
          child.style.height = `${scaledValues.height}px`;
        }

        if (child.tagName === "P" && scaledValues.fontSize) {
          child.style.fontSize = `${scaledValues.fontSize}px`;
        }
      }
    },
  };
};

export const scaleForTemplate = (scale: number, style: CSSStyleDeclaration): ScalingValuesFont => {
  const top = parseInt(style.top.slice(0, -2));
  const left = parseInt(style.left.slice(0, -2));
  const width = parseInt(style.width.slice(0, -2));
  const height = parseInt(style.height.slice(0, -2)) || undefined;
  const fontSize = parseInt(style.fontSize.slice(0, -2));

  return scaleValues(scale, top, left, width, height, fontSize);
};

export function scaleValues(
  scale: number,
  top: number,
  left: number,
  width: number,
  height: number | undefined,
  fontSize: number,
): ScalingValuesFont;
export function scaleValues(
  scale: number,
  top: number,
  left: number,
  width: number,
  height: number | undefined,
  fontSize: number | undefined,
): ScalingValues | ScalingValuesFont;

export function scaleValues(
  scale: number,
  top: number,
  left: number,
  width: number,
  height: number | undefined,
  fontSize: number | undefined,
): ScalingValues | ScalingValuesFont {
  return {
    top: Math.floor(top * scale),
    left: Math.floor(left * scale),
    width: Math.floor(width * scale),
    height: height ? Math.floor(height * scale) : undefined,
    fontSize: fontSize ? closestFontSize(Math.floor(fontSize * scale)) : undefined,
  };
}
