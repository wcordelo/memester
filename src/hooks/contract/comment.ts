import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { LENS_HUB_CONTRACT } from "../../constants";
import { ContractReturn } from ".";

export const useComment = (
  profileId?: string,
  contentURI?: string,
  profileIdPointed?: string,
  pubIdPointed?: string,
  collectModule?: string,
  collectModuleInitData?: string,
  referenceModule?: string,
  referenceModuleInitData?: string,
  referenceModuleData?: string,
): ContractReturn => {
  const { config, error: prepareError } = usePrepareContractWrite({
    ...LENS_HUB_CONTRACT,
    functionName: "comment",
    args: [
      {
        profileId: BigNumber.from(profileId),
        contentURI,
        profileIdPointed: BigNumber.from(profileIdPointed),
        pubIdPointed: BigNumber.from(pubIdPointed),
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
        referenceModuleData,
      },
    ],
    enabled:
      profileId !== undefined &&
      contentURI !== undefined &&
      profileIdPointed !== undefined &&
      pubIdPointed !== undefined &&
      collectModule !== undefined &&
      collectModuleInitData !== undefined &&
      referenceModule !== undefined &&
      referenceModuleInitData !== undefined &&
      referenceModuleData !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
