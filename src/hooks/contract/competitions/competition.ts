import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite, useProvider } from "wagmi";

import BaseCompetitionAbi from "../../../assets/abi/BaseCompetitionV1.json";
import MockCompetitionAbi from "../../../assets/abi/MockCompetition.json";
import { LENS_COMPETITION_HUB_CONTRACT } from "../../../constants";
import { ContractReturn } from "..";

interface UseCompetitionReturn extends Omit<ReturnType<typeof useContractRead>, "data"> {
  data: string;
}

export const useCompetition = (competitionId?: string): UseCompetitionReturn => {
  const competitionIdNumber = BigNumber.from(competitionId ?? "0");

  return useContractRead({
    ...LENS_COMPETITION_HUB_CONTRACT,
    functionName: "competitions",
    args: [competitionIdNumber],
    enabled: competitionIdNumber.gt("0"),
  }) as UseCompetitionReturn;
};

export const useCompetitionImplementation = (competitionId?: string): string | undefined => {
  const { data: competitionAddress } = useCompetition(competitionId);
  const [implementation, setImplementation] = useState<string | undefined>(undefined);
  const provider = useProvider();

  useEffect(() => {
    if (competitionAddress && provider) {
      (async () => {
        const contractCode = await provider.getCode(competitionAddress);
        const implementationAddress = parse1167Bytecode(contractCode);
        setImplementation(implementationAddress);
      })().catch(console.error);
    }
  }, [competitionAddress]);

  return implementation;
};

const parse1167Bytecode = (bytecode: unknown): string => {
  const EIP_1167_BYTECODE_PREFIX = "0x363d3d373d3d3d363d";
  const EIP_1167_BYTECODE_SUFFIX = "57fd5bf3";
  if (
    typeof bytecode !== "string" ||
    !bytecode.startsWith(EIP_1167_BYTECODE_PREFIX) ||
    !bytecode.endsWith(EIP_1167_BYTECODE_SUFFIX)
  ) {
    throw new Error("Not an EIP-1167 bytecode");
  }

  // detect length of address (20 bytes non-optimized, 0 < N < 20 bytes for vanity addresses)
  const pushNHex = bytecode.substring(EIP_1167_BYTECODE_PREFIX.length, EIP_1167_BYTECODE_PREFIX.length + 2);
  // push1 ... push20 use opcodes 0x60 ... 0x73
  const addressLength = parseInt(pushNHex, 16) - 0x5f;

  if (addressLength < 1 || addressLength > 20) {
    throw new Error("Not an EIP-1167 bytecode");
  }

  const addressFromBytecode = bytecode.substring(
    EIP_1167_BYTECODE_PREFIX.length + 2,
    EIP_1167_BYTECODE_PREFIX.length + 2 + addressLength * 2, // address length is in bytes, 2 hex chars make up 1 byte
  );

  // padStart is needed for vanity addresses
  return `0x${addressFromBytecode.padStart(40, "0")}`;
};

interface UseCompetitionCreationReturn extends Omit<ReturnType<typeof useContractRead>, "data"> {
  data: BigNumber[];
}

export const useCompetitionCreation = (competitionId?: string): UseCompetitionCreationReturn => {
  const { data: competitionAddress } = useCompetition(competitionId);

  return useContractRead({
    abi: BaseCompetitionAbi,
    address: competitionAddress ?? "",
    functionName: "creation",
    args: [],
    enabled: competitionAddress !== undefined,
  }) as UseCompetitionCreationReturn;
};

export const useCompetitionPickWinner = (
  competitionId?: string,
  publicationIds?: string[],
  areWinners?: boolean,
): ContractReturn => {
  const competitionIdNumber = BigNumber.from(competitionId ?? "0");

  const enabled =
    competitionIdNumber.gt("0") && publicationIds !== undefined && publicationIds.length !== 0 && !areWinners;

  const objectIds = publicationIds?.map((i) => ({ profileId: i.split("-")[0], pubId: i.split("-")[1] }));

  const mockInterface = new ethers.utils.Interface(JSON.stringify(MockCompetitionAbi));
  const endData = "0x" + mockInterface.encodeFunctionData("end", [{ publicationIds: objectIds }]).substring(10);

  const { config, error: prepareError } = usePrepareContractWrite({
    ...LENS_COMPETITION_HUB_CONTRACT,
    functionName: "endCompetition",
    args: [competitionIdNumber, endData],
    enabled,
  });

  const { write, data, error: writeError, status, isLoading } = useContractWrite(config);

  return { write, data, prepareError, writeError, status, isLoading };
};

interface UseCompetitionEndTimestampReturn extends Omit<ReturnType<typeof useContractRead>, "data"> {
  data: BigNumber | undefined;
}

export const useCompetitionEndTimestamp = (competitionId?: string): UseCompetitionEndTimestampReturn => {
  const { data: competitionAddress } = useCompetition(competitionId);

  return useContractRead({
    abi: BaseCompetitionAbi,
    address: competitionAddress ?? "",
    functionName: "endTimestamp",
    args: [],
    enabled: competitionAddress !== undefined,
  }) as UseCompetitionEndTimestampReturn;
};

export interface PublicationId {
  pubId: BigNumber;
  profileId: BigNumber;
}

interface UseCompetitionWinnersReturn extends Omit<ReturnType<typeof useContractRead>, "data"> {
  data: PublicationId[];
}

export const useCompetitionWinners = (competitionId?: string): UseCompetitionWinnersReturn => {
  const { data: competitionAddress } = useCompetition(competitionId);

  return useContractRead({
    abi: BaseCompetitionAbi,
    address: competitionAddress ?? "",
    functionName: "winners",
    args: [],
    enabled: competitionAddress !== undefined,
  }) as UseCompetitionWinnersReturn;
};
