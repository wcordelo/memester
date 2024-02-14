import { useContractWrite, usePrepareContractWrite } from "wagmi";

import FollowNFTAbi from "../../assets/abi/FollowNFT.json";
import { LENS_HUB_CONTRACT } from "../../constants";
import { ContractReturn } from ".";

export const useFollow = (profileIds?: string[], datas?: string[]): ContractReturn => {
  const { config, error: prepareError } = usePrepareContractWrite({
    ...LENS_HUB_CONTRACT,
    functionName: "follow",
    args: [profileIds, datas],
    enabled: profileIds !== undefined && profileIds.length > 0 && datas !== undefined && datas.length > 0,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};

export const useUnfollow = (followNFTAddress?: string, tokenId?: string): ContractReturn => {
  const { config, error: prepareError } = usePrepareContractWrite({
    abi: FollowNFTAbi,
    address: followNFTAddress ?? "",
    functionName: "burn",
    args: [tokenId],
    enabled: followNFTAddress !== undefined && tokenId !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
