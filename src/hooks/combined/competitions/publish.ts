import axios from "axios";
import { BigNumber, Signature } from "ethers";
import { splitSignature } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { LENS_COMPETITION_HUB_CONTRACT } from "../../../constants";
import { useStoreJSON, useStoreMeme } from "../../../context/InfuraIPFSContext";
import { parseIPFSURL } from "../../../utils";
import { omitDeep } from "../../../utils/omit-deep";
import { publicationIdFromReceipt } from "../../../utils/tx";
import { useCreateCommentTypedData } from "../../api/comment";
import { useCompetitionCreation } from "../../contract/competitions/competition";
import { useMemeCompetitionContent } from "../../utils/content";
import { useSignTypedData } from "../../utils/sign";
import { Template } from "../../utils/template";

export const useEnterCompetition = (
  address: string | undefined,
  profileId: string | undefined,
  title: string | undefined,
  caption: string | undefined,
  memeText: string | undefined,
  tags: string[],
  template: Template | undefined,
  competitionId: string | undefined,
): {
  publish: (blob: Blob | null) => void;
  loading: boolean;
  error: Error | null;
  publicationId: string | undefined;
  status: string | undefined;
} => {
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<string | undefined>();

  const [publicationId, setPublicationId] = useState<string | undefined>(undefined);
  const [newPublicationId, setNewPublicationId] = useState<string | undefined>(undefined);

  const [imageBlob, setImageBlob] = useState<Blob | null | undefined>(undefined);

  const { data: publicationIds } = useCompetitionCreation(competitionId);

  useEffect(() => {
    if (publicationIds !== undefined && publicationIds.length === 2) {
      setPublicationId(`${publicationIds[0].toHexString()}-${publicationIds[1].toHexString()}`);
    }
  }, [publicationIds]);

  const { pin: pinImage, ipfsHash: imageIPFSHash } = useStoreMeme(imageBlob, template);

  const content = useMemeCompetitionContent(tags, address, title, caption, memeText, imageIPFSHash, competitionId);
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

  const {
    data: signedData,
    signTypedData,
    error: signError,
    status: signStatus,
  } = useSignTypedData(commentTypedData?.createCommentTypedData?.typedData);

  const ethersSig: Signature | undefined = signedData ? splitSignature(signedData) : undefined;
  const apiTypedData = { ...omitDeep(commentTypedData?.createCommentTypedData?.typedData?.value, "__typename") };

  const commentWithSigData = {
    sig: { v: ethersSig?.v, r: ethersSig?.r, s: ethersSig?.s, deadline: apiTypedData.deadline },
    profileId: apiTypedData.profileId,
    contentURI: apiTypedData.contentURI,
    profileIdPointed: apiTypedData.profileIdPointed,
    pubIdPointed: apiTypedData.pubIdPointed,
    referenceModuleData: apiTypedData.referenceModuleData,
    collectModule: apiTypedData.collectModule,
    collectModuleInitData: apiTypedData.collectModuleInitData,
    referenceModule: apiTypedData.referenceModule,
    referenceModuleInitData: apiTypedData.referenceModuleInitData,
  };
  const competitionIdNumber = BigNumber.from(competitionId ?? "0");

  const enabled =
    address !== undefined &&
    profileId !== undefined &&
    title !== undefined &&
    signedData !== undefined &&
    competitionIdNumber.gt("0");
  const {
    config,
    error: prepareError,
    status: prepareStatus,
  } = usePrepareContractWrite({
    ...LENS_COMPETITION_HUB_CONTRACT,
    functionName: "enterCompetition",
    args: [competitionIdNumber, commentWithSigData, "0x"],
    enabled,
  });

  const { write, data, status: writeStatus, error: writeError } = useContractWrite(config);

  const start = (): void => {
    setLoading(true);
  };

  useEffect(() => {
    resetIPFSHash();
    resetTypedData();
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

      createCommentTypedData().catch(console.error);
    }
  }, [jsonIPFSHash, loading]);

  useEffect(() => {
    if (commentTypedData && loading && !signing) {
      setSigning(true);
      signTypedData();
    }
  }, [commentTypedData, signTypedData, loading, signing]);

  useEffect(() => {
    if (loading && !writing && write) {
      setWriting(true);
      write();
    }
  }, [signedData, write, loading]);

  useEffect(() => {
    if (signStatus === "error") {
      setError(signError);
    }
  }, [signError]);

  useEffect(() => {
    if (signStatus === "error") {
      setLoading(false);
      setSigning(false);
      setWriting(false);
    }
  }, [signStatus]);

  useEffect(() => {
    if (prepareStatus === "error") {
      setError(prepareError);
    }
  }, [prepareError]);

  useEffect(() => {
    if (writeStatus === "error") {
      setError(writeError);
    }
  }, [writeError]);

  useEffect(() => {
    if (writeStatus === "error") {
      setLoading(false);
      setSigning(false);
      setWriting(false);
    }
  }, [writeStatus]);

  useEffect(() => {
    data
      ?.wait(1)
      .then((receipt) => {
        setNewPublicationId(publicationIdFromReceipt(receipt));
        setLoading(false);
        setSigning(false);
        setWriting(false);
      })
      .catch((error) => {
        setLoading(false);
        setSigning(false);
        setWriting(false);
        setError(error);
      });
  }, [data]);

  useEffect(() => {
    if (!loading) {
      setStatus(undefined);
    }
  }, [loading]);

  const publish = (blob: Blob | null): void => {
    setImageBlob(blob);
    start();
  };

  return { publish, loading, error, publicationId: newPublicationId, status };
};
