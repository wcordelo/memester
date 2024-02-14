import styled from "styled-components";

import Modal, { ModalProps } from "./Modal";

const VideoWrapper = styled.video`
  width: 80%;
  max-height: 80%;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

interface VideoModalProps extends ModalProps {
  src: string;
  poster: string;
}

function VideoModal({ isOpen, onClose, src, poster }: VideoModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <VideoWrapper autoPlay={true} controls={true} poster={poster}>
        <source src={src} />
        Your browser does not support the<code>video</code>element.
      </VideoWrapper>
    </Modal>
  );
}

export default VideoModal;
