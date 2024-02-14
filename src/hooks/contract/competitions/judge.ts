import { useContractRead } from "wagmi";

import JudgeCompetitionAbi from "../../../assets/abi/JudgeCompetition.json";
import { useCompetition } from "./competition";

interface UseCompetitionJudgeReturn extends Omit<ReturnType<typeof useContractRead>, "data"> {
  data: string;
}

export const useCompetitionJudge = (competitionId?: string): UseCompetitionJudgeReturn => {
  const { data: competitionAddress } = useCompetition(competitionId);

  return useContractRead({
    abi: JudgeCompetitionAbi,
    address: competitionAddress ?? "",
    functionName: "judge",
    args: [],
    enabled: competitionAddress !== undefined,
  }) as UseCompetitionJudgeReturn;
};
