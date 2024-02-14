import { ethers } from "ethers";
import create from "zustand";

export type CompetitionEvent = Event & {
  args: {
    competitionId: ethers.BigNumber;
    profileId: ethers.BigNumber;
    pubId: ethers.BigNumber;
    endTimestamp: ethers.BigNumber;
  };
};

export interface CompetitionEventState {
  events: CompetitionEvent[] | undefined;
  setEvents: (events: any[]) => void;
}

const useCompetitionEventState = create<CompetitionEventState>((set) => ({
  events: undefined,
  setEvents: (events: CompetitionEvent[]) => set({ events }),
}));

export default useCompetitionEventState;
