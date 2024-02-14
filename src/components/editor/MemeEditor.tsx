import { useEffect, useRef, useState } from "react";
import Moveable, { BoundType, OnResize } from "react-moveable";
import Selecto from "react-selecto";
import { useClickAway, useDebounce, useMeasure, useWindowSize } from "react-use";
import styled from "styled-components";

import madeOn from "../../assets/made_on.png";
import { TemplateImage, TemplateText, TemplateTextParams } from "../../hooks/utils/template";
import { device } from "../../utils/breakpoints";
import { MAX_MEME_WIDTH, Scale } from "../../utils/resize";

export interface MemeEditorProps {
  children?: React.ReactNode;
  textLines: TemplateText[];
  images: TemplateImage[];
  source: Blob | string;
  loading: boolean;
  setTextParams: React.Dispatch<React.SetStateAction<TemplateTextParams[]>>;
  setScale: React.Dispatch<React.SetStateAction<Scale | undefined>>;
}

interface FrameMapValue {
  translate: number[];
}

const Wrapper = styled.div`
  display: block;
  flex-direction: row;

  width: 600px;
  max-width: 600px;
  margin: 0 auto;

  @media ${device.tabletM} {
    width: 100%;
  }
`;

const MemeCanvas = styled.div`
  width: 600px;
  max-width: 600px;
  img#memeBackground {
    width: 600px;
    display: block;
  }

  @media ${device.tabletM} {
    img#memeBackground {
      display: block;
      width: 100%;
      max-width: 600px;
      flex-grow: 2;
    }
    width: 100%;
    height: unset;
  }

  position: relative;
  overflow: hidden;

  *:not(#memeBackground) {
    position: absolute;
  }
`;

function MemeEditor({
  source,
  children,
  textLines,
  images,
  loading,
  setTextParams,
  setScale,
}: MemeEditorProps): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const moveableRef = useRef<Moveable | null>(null);
  const [targets, setTargets] = useState<Array<HTMLElement | SVGElement>>([]);
  const selectoRef = useRef<Selecto | null>(null);
  const [frameMap] = useState(() => new Map<HTMLElement | SVGElement, FrameMapValue>());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boundingRect, setBoundingRect] = useState<BoundType | undefined>(undefined);
  const [watermarkWidth, setWatermarkWidth] = useState(MAX_MEME_WIDTH);
  const [hasSelected, setHasSelected] = useState<boolean>(false);
  const textLinesRef = useRef<Array<HTMLParagraphElement | null>>([]);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const [imageSizeRef, { height: imageHeight, width: imageWidth }] = useMeasure<HTMLImageElement>();
  const { width } = useWindowSize();
  const [debouncedWidth, setDebouncedWidth] = useState(width);
  useDebounce(
    () => {
      setDebouncedWidth(width);
    },
    250,
    [width],
  );

  useClickAway(wrapperRef, () => {
    setTargets([]);
  });

  const rearrangeLines = (): void => {
    [...textLinesRef.current, ...imagesRef.current].forEach((el) => {
      if (el && containerRef.current) {
        if (containerRef.current.clientHeight === 0) {
          return;
        }
        if (el.offsetTop + el.clientHeight > containerRef.current.clientHeight) {
          el.style.top = `${containerRef.current.clientHeight - el.clientHeight - 20}px`;
          frameMap.set(el, {
            translate: [
              frameMap?.get(el)?.translate[0] ?? parseInt(el.style.left.replace("px", "")) ?? 0,
              containerRef.current.clientHeight - el.clientHeight - 20,
            ],
          });
        }
      }
    });
  };

  const updateTextParams = (): void => {
    setTextParams(
      textLinesRef.current
        .filter((textLine): textLine is HTMLParagraphElement => textLine !== null)
        .map((textLine) => {
          return {
            text: textLine.innerHTML,
            style: textLine.style,
          };
        }),
    );
  };

  useEffect(() => {
    setTargets([]);

    const clientRect = containerRef?.current?.getBoundingClientRect();

    if (clientRect) {
      setBoundingRect(clientRect);
    }

    rearrangeLines();
  }, [imageHeight, debouncedWidth]);

  useEffect(() => {
    const watermarkWidth = 200;
    if (imageWidth >= MAX_MEME_WIDTH) {
      setWatermarkWidth(watermarkWidth);
    } else {
      setWatermarkWidth((watermarkWidth / MAX_MEME_WIDTH) * imageWidth);
    }

    setScale({
      up: MAX_MEME_WIDTH / imageWidth,
      down: imageWidth / MAX_MEME_WIDTH,
    });

    updateTextParams();
  }, [imageWidth]);

  useDebounce(
    () => {
      textLinesRef.current = textLinesRef.current.slice(0, textLines.length);

      if (textLines.length > 0 && !hasSelected && textLinesRef.current[0]) {
        setTargets([textLinesRef.current[0]]);
        setHasSelected(true);
      }
    },
    250,
    [debouncedWidth, imageHeight, imageWidth, textLines],
  );

  useEffect(() => {
    rearrangeLines();
    updateTextParams();
  }, [textLines]);

  return (
    <Wrapper ref={wrapperRef}>
      <Moveable
        target={targets}
        origin={true}
        snappable={true}
        bounds={boundingRect}
        ref={moveableRef}
        edge={false}
        draggable={!loading}
        throttleDrag={0}
        resizable={!loading}
        scalable={!loading}
        rotatable={targets.length === 1 && !loading}
        onRenderEnd={(_) => {
          // Called at end of all events
          updateTextParams();
        }}
        onClickGroup={(e) => {
          selectoRef?.current?.clickTarget(e.inputEvent, e.inputTarget);
        }}
        onDragStart={(e) => {
          const target = e.target;

          if (!frameMap.has(target)) {
            frameMap.set(target, {
              translate: [
                parseInt(target?.style.left.replace("px", "")) || 0,
                parseInt(target?.style.top.replace("px", "")) || 0,
              ],
            });
          }
          const frame = frameMap.get(target);
          if (frame) {
            e.set(frame.translate);
          }
        }}
        onResize={(event: OnResize) => {
          const { target, width, height, delta, drag } = event;
          const { left, top } = drag;
          target.style.left = `${left}px`;
          target.style.top = `${top}px`;
          delta[0] && (target.style.width = `${width}px`);
          delta[1] && (target.style.height = `${height}px`);
        }}
        onDrag={(e) => {
          const target = e.target;
          const frame = frameMap.get(target);
          if (frame) {
            frame.translate = e.beforeTranslate;
            target.style.left = `${frame.translate[0]}px`;
            target.style.top = `${frame.translate[1]}px`;
          }
        }}
        onDragGroupStart={(e) => {
          e.events.forEach((ev) => {
            const target = ev.target;
            if (!frameMap.has(target)) {
              frameMap.set(target, {
                translate: [
                  parseInt(target?.style.left.replace("px", "")) || 0,
                  parseInt(target?.style.top.replace("px", "")) || 0,
                ],
              });
            }
            const frame = frameMap.get(target);
            if (frame) {
              ev.set(frame.translate);
            }
          });
        }}
        onDragGroup={(e) => {
          e.events.forEach((ev) => {
            const target = ev.target;
            const frame = frameMap.get(target);
            if (frame) {
              frame.translate = ev.beforeTranslate;
              target.style.left = `${frame.translate[0]}px`;
              target.style.top = `${frame.translate[1]}px`;
            }
          });
        }}
        onRotate={({ target, rotate, transform }) => {
          target.style.transform = `rotate(${Math.round(rotate / 5.625) / (1 / 5.625)}deg)`;
        }}
      />
      <Selecto
        ref={selectoRef}
        dragContainer={".elements"}
        selectableTargets={[".selecto-area .cube"]}
        hitRate={0}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={["shift"]}
        ratio={0}
        onDragStart={(e) => {
          const moveable = moveableRef.current;
          const target = e.inputEvent.target;
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          if (moveable?.isMoveableElement(target) || targets.some((t) => t === target || t?.contains(target))) {
            e.stop();
          }
        }}
        onSelectEnd={(e) => {
          const moveable = moveableRef.current;
          setTargets(e.selected);

          if (e.isDragStart) {
            e.inputEvent.preventDefault();

            setTimeout(() => {
              moveable?.dragStart(e.inputEvent);
            });
          }
        }}
      />
      <MemeCanvas className="elements selecto-area" id="memeCanvas" ref={containerRef}>
        <img
          key="image"
          src={source instanceof Blob ? URL.createObjectURL(source) : source}
          id="memeBackground"
          onDragStart={(e) => e.preventDefault()}
          ref={imageSizeRef}></img>
        <img
          src={madeOn}
          id="madeOnMemester"
          style={{ bottom: "0px", right: "0px" }}
          width={watermarkWidth}
          onDragStart={(e) => e.preventDefault()}
        />

        {textLines.map((i, idx) => {
          return (
            <p
              key={i.id}
              className="cube target"
              ref={(el) => {
                textLinesRef.current[idx] = el;
              }}
              style={{
                color: i.color,
                top: `${i.top}px`,
                left: `${i.left}px`,
                width: `${i.width}px`,
                height: i.height ? `${i.height}px` : "auto",
                textShadow: `${i.shadowColor} -1px 0px, ${i.shadowColor} 0px 1px, ${i.shadowColor} 1px 0px, ${i.shadowColor} 0px -1px`,
                fontSize: `${i.fontSize}px`,
                fontFamily: i.fontFamily,
                transform: i.transform,
                margin: 0,
                textAlign: "center",
                cursor: "move",
              }}>
              {i.text}
            </p>
          );
        })}

        {images.map((i, idx) => {
          return (
            <img
              src={i.content}
              key={`image${i.id}`}
              ref={(el) => {
                imagesRef.current[idx] = el;
              }}
              className="cube target"
              style={{
                top: `${i.top}px`,
                left: `${i.left}px`,
                width: `${i.width}px`,
                height: i.height ? `${i.height}px` : "auto",
                transform: i.transform,
                margin: 0,
                textAlign: "center",
                cursor: "move",
              }}
            />
          );
        })}
        {children}
      </MemeCanvas>
    </Wrapper>
  );
}

export default MemeEditor;
