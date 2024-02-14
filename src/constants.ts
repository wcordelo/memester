import LensCompetitionHubAbi from "./assets/abi/LensCompetitionHub.json";
import LensHubAbi from "./assets/abi/LensHub.json";

export const AUTH_STORAGE = "memester_auth_storage";
export const CURRENT_ACCESS_TOKEN = "memester_current_access_token";
export const SIGNING_REQUEST_IN_FLIGHT = "memester_signing_request_in_flight";
export const THEME_MODE = "memester_theme_mode";

export const FONT_SIZES = [2, 4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 50, 60, 70, 80];

export const TITLE = "memester - The NFT Meme Platform - 🌿";
export const SUBTITLE = "- memester - 🌿";
export const LENS_HUB_CONTRACT = {
  address: import.meta.env.VITE_LENS_HUB_ADDRESS,
  abi: LensHubAbi,
};
export const LENS_COMPETITION_HUB_CONTRACT = {
  address: import.meta.env.VITE_LENS_COMPETITION_HUB_ADDRESS,
  abi: LensCompetitionHubAbi,
};

export enum CompetitionType {
  JudgeCompeition = "JudgeCompeition",
  JudgeCompetionMultipleWinners = "JudgeCompetionMultipleWinners",
}

export const MEMESTER_COLLECT_FEE_SPLIT = parseInt(import.meta.env.VITE_MEMESTER_COLLECT_FEE_SPLIT);

export const COLLECT_FEE_CURRENCY = import.meta.env.VITE_COLLECT_FEE_CURRENCY;
export const COLLECT_FEE_SPLIT_ADDRESS = import.meta.env.VITE_MEMESTER_COLLECT_FEE_SPLIT_ADDRESS;

export const CompetitionMap: Record<string, CompetitionType> = {
  [import.meta.env.VITE_JUDGE_COMPETITION_ADDRESS.toLowerCase()]: CompetitionType.JudgeCompeition,
  [import.meta.env.VITE_JUDGE_COMPETITION_MULTIPLE_WINNERS_ADDRESS.toLowerCase()]:
    CompetitionType.JudgeCompetionMultipleWinners,
};

export const TOUR_COMPETITIONS_SEEN = "memester_competitions_tour_seen";
export const TOUR_COLLECT_SEEN = "memester_collect_tour_seen";

export const PINNED_COMPETITIONS: string[] = import.meta.env.VITE_MEMESTER_PINNED_COMPETITIONS.split(",");

export const HIDDEN_COMPETITIONS: string[] = import.meta.env.VITE_MEMESTER_HIDDEN_COMPETITIONS.split(",");

export const API_URL = import.meta.env.VITE_MEMESTER_API_URL;
