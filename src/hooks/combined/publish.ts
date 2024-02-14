import axios from "axios";
import { useEffect, useState } from "react";

import { COLLECT_FEE_CURRENCY, COLLECT_FEE_SPLIT_ADDRESS, MEMESTER_COLLECT_FEE_SPLIT } from "../../constants";
import { useStoreJSON, useStoreMeme } from "../../context/InfuraIPFSContext";
import { parseIPFSURL } from "../../utils";
import { publicationIdFromReceipt } from "../../utils/tx";
import { useCreatePostTypedData, useCreatePostViaDispatcher } from "../api/post";
import { useProfileHasDispatcher } from "../api/profile";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useMemeContent } from "../utils/content";
import { useSignTypedData } from "../utils/sign";
import { Template } from "../utils/template";

export const usePublishMeme = (
  address: string | undefined,
  profileId: string | undefined,
  title: string | undefined,
  caption: string | undefined,
  share: boolean,
  memeText: string | undefined,
  tags: string[],
  template: Template | undefined,
  collectPrice: number | undefined,
): {
  publish: (blob: Blob | null) => void;
  loading: boolean;
  error: Error | null;
  publicationId: string | undefined;
  status: string | undefined;
} => {
  const dispatch = useProfileHasDispatcher(profileId);

  const [publicationId, setPublicationId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>();

  const [imageBlob, setImageBlob] = useState<Blob | null | undefined>(undefined);

  const { pin: pinImage, ipfsHash: imageIPFSHash } = useStoreMeme(imageBlob, template);

  const content = useMemeContent(tags, profileId, address, title, caption, share, memeText, imageIPFSHash);
  const { pin: pinJSON, ipfsHash: jsonIPFSHash, reset: resetIPFSHash } = useStoreJSON(content);

  const [collectModule, setCollectModule] = useState<object>({
    freeCollectModule: {
      followerOnly: false,
    },
  });

  const [createPostTypedData, { data: postTypedData, reset: resetTypedData }] = useCreatePostTypedData(
    profileId,
    jsonIPFSHash,
    collectModule,
  );

  const [createPostViaDispatcher, { data: postViaDispatcher, reset: resetViaDispatcher }] = useCreatePostViaDispatcher(
    profileId,
    jsonIPFSHash,
    collectModule,
  );

  const signReturn = useSignTypedData(postTypedData?.createPostTypedData?.typedData);

  const { start, loading, error } = useBroadcastAPIHook(
    postTypedData?.createPostTypedData?.id,
    postViaDispatcher?.createPostViaDispatcher,
    signReturn,
    (receipt) => {
      const parsedPublicationId = publicationIdFromReceipt(receipt);
      setPublicationId(parsedPublicationId);
    },
  );

  useEffect(() => {
    resetIPFSHash();
    resetTypedData();
    resetViaDispatcher();
  }, [content]);

  useEffect(() => {
    if (loading && pinImage) {
      setStatus("Uploading your meme's image to IPFS...");
      pinImage();
    }
  }, [pinImage, loading]);

  useEffect(() => {
    if (loading && pinJSON) {
      setStatus("Uploading your meme's content to IPFS...");
      pinJSON();
    }
  }, [pinJSON, loading]);

  useEffect(() => {
    if (loading && jsonIPFSHash && imageIPFSHash) {
      // Preload the cache
      axios.get(parseIPFSURL(`ipfs://${imageIPFSHash}/image.jpg`)).catch(console.error);
      axios.get(parseIPFSURL(`ipfs://${jsonIPFSHash}`)).catch(console.error);

      setStatus("Sending transaction to blockchain...");

      if (dispatch) {
        console.log("dispatching...");
        createPostViaDispatcher().catch(console.error);
      } else {
        createPostTypedData().catch(console.error);
      }
    }
  }, [jsonIPFSHash, loading]);

  useEffect(() => {
    if (!loading) {
      setStatus(undefined);
    }
  }, [loading]);

  useEffect(() => {
    if (address && collectPrice && collectPrice > 0) {
      setCollectModule({
        multirecipientFeeCollectModule: {
          followerOnly: false,
          amount: {
            currency: COLLECT_FEE_CURRENCY,
            value: collectPrice.toString(),
          },
          recipients: [
            {
              recipient: address,
              split: 100 - MEMESTER_COLLECT_FEE_SPLIT,
            },
            {
              recipient: COLLECT_FEE_SPLIT_ADDRESS,
              split: MEMESTER_COLLECT_FEE_SPLIT,
            },
          ],
        },
      });
    } else if (address && collectPrice && collectPrice === 0) {
      setCollectModule({
        freeCollectModule: {
          followerOnly: false,
        },
      });
    }
  }, [collectPrice, address]);

  const publish = (blob: Blob | null): void => {
    setImageBlob(blob);
    start();
  };

  return { publish, loading, error, publicationId, status };
};
