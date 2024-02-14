import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { LENS_HUB_CONTRACT } from "../../constants";
import { ContractReturn } from ".";

export const usePost = (
  profileId?: string,
  contentURI?: string,
  collectModule?: string,
  collectModuleInitData?: string,
  referenceModule?: string,
  referenceModuleInitData?: string,
): ContractReturn => {
  const { config, error: prepareError } = usePrepareContractWrite({
    ...LENS_HUB_CONTRACT,
    functionName: "post",
    args: [
      {
        profileId: BigNumber.from(profileId),
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
      },
    ],
    enabled:
      profileId !== undefined &&
      contentURI !== undefined &&
      collectModule !== undefined &&
      collectModuleInitData !== undefined &&
      referenceModule !== undefined &&
      referenceModuleInitData !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
