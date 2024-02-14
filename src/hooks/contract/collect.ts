import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { LENS_HUB_CONTRACT } from "../../constants";
import { ContractReturn } from ".";

export const useCollect = (profileId?: string, pubId?: string, dataBytes?: string): ContractReturn => {
  const { config, error: prepareError } = usePrepareContractWrite({
    ...LENS_HUB_CONTRACT,
    functionName: "collect",
    args: [profileId, pubId, dataBytes],
    enabled: profileId !== undefined && pubId !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
