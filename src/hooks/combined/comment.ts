import axios from "axios";
import { useEffect, useState } from "react";

import { useStoreJSON } from "../../context/InfuraIPFSContext";
import { parseIPFSURL } from "../../utils";
import { useCreateCommentTypedData, useCreateCommentViaDispatcher } from "../api/comment";
import { useProfileHasDispatcher } from "../api/profile";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useCommentContent } from "../utils/content";
import { useSignTypedData } from "../utils/sign";

export const usePublishComment = (
  address: string | undefined,
  publicationId: string | undefined,
  profileId: string | undefined,
  comment: string | undefined,
): { publish: () => void; loading: boolean; error: Error | null; hash: string | undefined } => {
  const dispatch = useProfileHasDispatcher(profileId);
  const [hash, setHash] = useState<string | undefined>(undefined);

  const content = useCommentContent(address, comment, publicationId);
  const { pin: pinJSON, ipfsHash: jsonIPFSHash, reset: resetIPFSHash } = useStoreJSON(content);

  const [createCommentTypedData, { data: commentTypedData, reset: resetTypedData }] = useCreateCommentTypedData(
    profileId,
    publicationId,
    jsonIPFSHash,
    {
      freeCollectModule: {
        followerOnly: false,
      },
    },
  );

  const [createCommentViaDispatcher, { data: commentViaDispatcher, reset: resetViaDispatcher }] =
    useCreateCommentViaDispatcher(profileId, publicationId, jsonIPFSHash, {
      freeCollectModule: {
        followerOnly: false,
      },
    });

  const signReturn = useSignTypedData(commentTypedData?.createCommentTypedData?.typedData);

  const {
    start: publish,
    loading,
    error,
  } = useBroadcastAPIHook(
    commentTypedData?.createCommentTypedData?.id,
    commentViaDispatcher?.createCommentViaDispatcher,
    signReturn,
    (receipt) => {
      setHash(receipt?.transactionHash);
    },
  );

  useEffect(() => {
    resetIPFSHash();
    resetTypedData();
    resetViaDispatcher();
  }, [content]);

  useEffect(() => {
    loading && pinJSON?.();
  }, [pinJSON, loading]);

  useEffect(() => {
    if (loading && jsonIPFSHash) {
      // Preload the cache
      axios.get(parseIPFSURL(`ipfs://${jsonIPFSHash}`)).catch(console.error);

      if (dispatch) {
        console.log("dispatching...");
        createCommentViaDispatcher().catch(console.error);
      } else {
        createCommentTypedData().catch(console.error);
      }
    }
  }, [jsonIPFSHash, loading]);

  return { publish, loading, error, hash };
};
