import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { useAuth } from "../../context/AuthContext";
import { useDefaultProfile } from "../../hooks/api/profile";
import { usePublishComment } from "../../hooks/combined/comment";
import Textbox, { TextboxButton } from "../theme/Textbox";

interface CommentTextboxProps {
  publicationId: string;
  onComplete: () => void;
}

const StyledTextbox = styled(Textbox)`
  width: 100%;
  margin: 15px 0 !important;
`;

function CommentTextbox({ publicationId, onComplete }: CommentTextboxProps): JSX.Element {
  const { address } = useAccount();
  const defaultProfile = useDefaultProfile(address);
  const { isAuthenticated } = useAuth(address);
  const [comment, setComment] = useState<string>("");

  const { publish, loading, hash } = usePublishComment(
    address,
    publicationId,
    defaultProfile.defaultProfile?.id,
    comment,
  );

  useEffect(() => {
    if (hash) {
      toast.success(`Comment posted successfully!`);
      setComment("");
      onComplete();
    }
  }, [hash]);

  return (
    <StyledTextbox
      variant="textarea"
      endAdornment={
        <TextboxButton
          onClick={() => publish()}
          disabled={loading || !isAuthenticated || comment.length === 0}
          position="end">
          {loading ? <FontAwesomeIcon icon={faSpinner} style={{ height: "18px" }} spinPulse /> : "→️"}
        </TextboxButton>
      }
      disabled={loading}
      value={comment}
      placeholder="Post a comment"
      onKeyDown={(e) => {
        if (!loading && isAuthenticated && comment.length > 0 && e.key === "Enter" && !e.shiftKey) {
          publish();
        }

        if (e.target instanceof HTMLElement) {
          e.target.style.height = "auto";
          e.target.style.height = `${Math.min(e.target.scrollHeight - 4, 80)}px`;
        }
      }}
      onChange={(e) => {
        setComment(e.target.value);

        if (e.target.value === "") {
          e.target.style.height = "auto";
        }
      }}
    />
  );
}

export default CommentTextbox;
