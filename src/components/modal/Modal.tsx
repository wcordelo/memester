import { cloneElement, JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1010;
`;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactElement<any, string | JSXElementConstructor<any>>;
}

function Modal({ isOpen, onClose, children }: ModalProps): JSX.Element {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
      document.body.style.top = `-${window.scrollY.toString()}px`;
      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
    } else if (!isOpen && hasBeenOpened) {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isOpen]);

  return isOpen && children ? (
    <ModalBackground
      onClick={() => {
        onClose();
      }}>
      {cloneElement(children, {
        onClick: (e: any) => e.stopPropagation(),
        style: {
          zIndex: 1011,
          position: "fixed",
          left: "50%",
          top: "25%",
          transform: "translate(-50%, 0)",
        },
      })}
    </ModalBackground>
  ) : (
    <></>
  );
}

export default Modal;
