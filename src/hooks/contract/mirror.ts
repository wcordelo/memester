import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { LENS_HUB_CONTRACT } from "../../constants";
import { ContractReturn } from ".";

export const useMirror = (
  profileId?: string,
  profileIdPointed?: string,
  pubIdPointed?: string,
  referenceModuleData?: string,
  referenceModule?: string,
  referenceModuleInitData?: string,
): ContractReturn => {
  const { config, error: prepareError } = usePrepareContractWrite({
    ...LENS_HUB_CONTRACT,
    functionName: "mirror",
    args: [
      {
        profileId,
        profileIdPointed,
        pubIdPointed,
        referenceModuleData,
        referenceModule,
        referenceModuleInitData,
      },
    ],
    enabled:
      profileId !== undefined &&
      profileIdPointed !== undefined &&
      pubIdPointed !== undefined &&
      referenceModuleData !== undefined &&
      referenceModule !== undefined &&
      referenceModuleInitData !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
