import { CSSProperties } from "react";
import { useAccount } from "wagmi";

import Button from "../components/theme/Button";
import { useAuth } from "../context/AuthContext";
import { useFollowProfile, useUnfollowProfile } from "../hooks/combined/follow";
import ErrorContainer from "./theme/ErrorContainer";

export interface FollowButtonProps {
  profileId: string;
  isFollowedByMe: boolean;
  onCompleted: () => void;
  className?: string;
  style?: CSSProperties | undefined;
}

function FollowButton({ profileId, isFollowedByMe, onCompleted, className, style }: FollowButtonProps): JSX.Element {
  const { address } = useAccount();
  const { isAuthenticated } = useAuth(address);

  const { follow, loading: followLoading, error: followError } = useFollowProfile(profileId, onCompleted);

  const { unfollow, loading: unfollowLoading, error: unfollowError } = useUnfollowProfile(profileId, onCompleted);

  return isAuthenticated ? (
    <Button
      className={className}
      style={style}
      onClick={() => {
        isFollowedByMe ? unfollow() : follow();
      }}
      loading={followLoading || unfollowLoading}
      disabled={followLoading || unfollowLoading}>
      {isFollowedByMe ? "Unfollow" : "Follow"}
    </Button>
  ) : !followLoading && !unfollowLoading && (followError !== undefined || unfollowError !== undefined) ? (
    <ErrorContainer error={followError ?? unfollowError} />
  ) : (
    <></>
  );
}

export default FollowButton;
