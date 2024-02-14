import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";

import abi from "../../assets/abi/LensHub.json";

interface UseProfileReturn extends Omit<ReturnType<typeof useContractRead>, "data"> {
  data: { pubCount: BigNumber | undefined };
}

export const useProfile = (profileId?: string): UseProfileReturn => {
  return useContractRead({
    address: import.meta.env.VITE_LENS_HUB_ADDRESS,
    abi,
    functionName: "getProfile",
    args: [profileId],
    enabled: profileId !== undefined,
  }) as UseProfileReturn;
};
