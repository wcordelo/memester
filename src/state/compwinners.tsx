import create from "zustand";

export interface CompetitionWinnersState {
  competitionWinners: string[];
  setCompetitionWinners: (competitionWinners: string[]) => void;
}

const useCompetitionWinnersStore = create<CompetitionWinnersState>((set) => ({
  competitionWinners: [],
  setCompetitionWinners: (competitionWinners) => {
    set({
      competitionWinners,
    });
  },
}));

export default useCompetitionWinnersStore;
