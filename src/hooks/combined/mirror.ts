import { useEffect } from "react";

import { useCreateMirrorTypedData, useCreateMirrorViaDispatcher } from "../api/mirror";
import { useProfileHasDispatcher } from "../api/profile";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const useMirrorPublication = (
  profileId?: string,
  publicationId?: string,
  onCompleted?: () => void,
): { mirror: () => void; loading: boolean; error: Error | null } => {
  const dispatch = useProfileHasDispatcher(profileId);
  const [createMirrorTypedData, { data: mirrorTypedData }] = useCreateMirrorTypedData(profileId, publicationId);

  const [createMirrorViaDispatcher, { data: mirrorViaDispatcher }] = useCreateMirrorViaDispatcher(
    profileId,
    publicationId,
  );

  const signReturn = useSignTypedData(mirrorTypedData?.createMirrorTypedData?.typedData);

  const {
    start: mirror,
    loading,
    error,
  } = useBroadcastAPIHook(
    mirrorTypedData?.createMirrorTypedData?.id,
    mirrorViaDispatcher?.createMirrorViaDispatcher,
    signReturn,
    onCompleted,
  );

  useEffect(() => {
    if (loading) {
      if (dispatch) {
        console.log("dispatching...");
        createMirrorViaDispatcher().catch(console.error);
      } else {
        createMirrorTypedData().catch(console.error);
      }
    }
  }, [profileId, publicationId, loading]);

  return { mirror, loading, error };
};
