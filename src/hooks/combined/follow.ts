import { useEffect } from "react";

import { useCreateFollowTypedData, useCreateUnfollowTypedData } from "../api/follow";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const useFollowProfile = (
  profileId: string,
  onCompleted: () => void,
): { follow: () => void; loading: boolean; error: Error | null } => {
  const [createFollowTypedData, { data: followTypedData }] = useCreateFollowTypedData(profileId);

  const signReturn = useSignTypedData(followTypedData?.createFollowTypedData?.typedData);

  const {
    start: follow,
    loading,
    error,
  } = useBroadcastAPIHook(followTypedData?.createFollowTypedData?.id, undefined, signReturn, onCompleted);

  useEffect(() => {
    loading && createFollowTypedData().catch(console.error);
  }, [profileId, loading]);

  return { follow, loading, error };
};

export const useUnfollowProfile = (
  profileId: string,
  onCompleted: () => void,
): { unfollow: () => void; loading: boolean; error: Error | null } => {
  const [createUnfollowTypedData, { data: unfollowTypedData }] = useCreateUnfollowTypedData(profileId);

  const signReturn = useSignTypedData(unfollowTypedData?.createUnfollowTypedData?.typedData);

  const {
    start: unfollow,
    loading,
    error,
  } = useBroadcastAPIHook(unfollowTypedData?.createUnfollowTypedData?.id, undefined, signReturn, onCompleted);

  useEffect(() => {
    loading && createUnfollowTypedData().catch(console.error);
  }, [profileId, loading]);

  return { unfollow, loading, error };
};
