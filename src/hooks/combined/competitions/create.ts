import { ethers, Signature } from "ethers";
import { splitSignature } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { LENS_COMPETITION_HUB_CONTRACT } from "../../../constants";
import { useStoreBlob, useStoreJSON } from "../../../context/InfuraIPFSContext";
import { omitDeep } from "../../../utils/omit-deep";
import { competitionIdFromReceipt } from "../../../utils/tx";
import { useCreatePostTypedData } from "../../api/post";
import { useCompetitionContent } from "../../utils/content";
import { useSignTypedData } from "../../utils/sign";

export const useCreateCompetition = (
  judge?: string,
  endTimestamp?: number,
  name?: string,
  description?: string,
  profileId?: string,
  address?: string,
  icon?: File,
  competitionAddress?: string,
): {
  start: () => void;
  loading: boolean;
  error: Error | null;
  competitionId: number | undefined;
} => {
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [competitionId, setCompetitionId] = useState<number | undefined>(undefined);

  const { pin: pinIcon, ipfsHash: iconIPFSHash, reset: resetIconIPFSHash } = useStoreBlob(icon);

  const content = useCompetitionContent(address, name, description, iconIPFSHash, icon?.type);
  const { pin: pinJSON, ipfsHash: jsonIPFSHash, reset: resetIPFSHash } = useStoreJSON(content);

  const [createPostTypedData, { data: postTypedData, reset: resetTypedData }] = useCreatePostTypedData(
    profileId,
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
  } = useSignTypedData(postTypedData?.createPostTypedData?.typedData);

  const enabled = judge !== undefined && endTimestamp !== undefined && signedData !== undefined;

  const initData = enabled ? ethers.utils.defaultAbiCoder.encode(["tuple(address judge)"], [{ judge }]) : "0x";

  const ethersSig: Signature | undefined = signedData ? splitSignature(signedData) : undefined;
  const apiTypedData = { ...omitDeep(postTypedData?.createPostTypedData?.typedData?.value, "__typename") };

  const postWithSigData = {
    sig: { v: ethersSig?.v, r: ethersSig?.r, s: ethersSig?.s, deadline: apiTypedData.deadline },
    profileId: apiTypedData.profileId,
    contentURI: apiTypedData.contentURI,
    collectModule: apiTypedData.collectModule,
    collectModuleInitData: apiTypedData.collectModuleInitData,
    referenceModule: apiTypedData.referenceModule,
    referenceModuleInitData: apiTypedData.referenceModuleInitData,
  };

  const {
    config,
    error: prepareError,
    status: prepareStatus,
  } = usePrepareContractWrite({
    ...LENS_COMPETITION_HUB_CONTRACT,
    functionName: "createCompetition",
    args: [competitionAddress, endTimestamp, postWithSigData, initData],
    enabled,
  });

  const { write, data, status: writeStatus, error: writeError } = useContractWrite(config);

  const start = (): void => {
    setLoading(true);
    if (icon && pinIcon) {
      pinIcon();
    } else if (pinJSON) {
      pinJSON();
    }
  };

  useEffect(() => {
    resetIconIPFSHash();
  }, [icon]);

  useEffect(() => {
    resetIPFSHash();
    resetTypedData();
  }, [content]);

  useEffect(() => {
    if (iconIPFSHash && pinJSON) {
      pinJSON();
    }
  }, [iconIPFSHash, pinJSON]);

  useEffect(() => {
    if (jsonIPFSHash) {
      createPostTypedData().catch(console.error);
    }
  }, [jsonIPFSHash]);

  useEffect(() => {
    if (postTypedData && loading && !signing) {
      setSigning(true);
      signTypedData();
    }
  }, [signTypedData, postTypedData, loading, signing]);

  useEffect(() => {
    if (loading && !writing && write) {
      setWriting(true);
      write();
    }
  }, [write]);

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
        setCompetitionId(competitionIdFromReceipt(receipt));
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

  return { start, loading, error, competitionId };
};
