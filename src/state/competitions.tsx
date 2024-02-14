import create from "zustand";

export interface CompetitionState {
  enteringCompetition: boolean;
  competitionPublicationId: string | undefined;
  competitionId: string | undefined;
  setEnteringCompetitionDetails: (
    enteringCompetition: boolean,
    competitionPublicationId: string | undefined,
    competitionId: string | undefined,
  ) => void;
}

const useCompetitionStore = create<CompetitionState>((set) => ({
  enteringCompetition: false,
  competitionPublicationId: undefined,
  competitionId: undefined,
  setEnteringCompetitionDetails(enteringCompetition, competitionPublicationId, competitionId) {
    set({
      enteringCompetition,
      competitionPublicationId,
      competitionId,
    });
  },
}));

export default useCompetitionStore;
