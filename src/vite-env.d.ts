/* eslint-disable */
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_KEY: string;
  readonly VITE_LENS_API: string;
  readonly VITE_REFRESH_TOKEN_IN_MINS: number;
  readonly VITE_LENS_APP_ID: string;
  readonly VITE_LENS_HUB_ADDRESS: string;
  readonly VITE_PUBLIC_URL: string;
  readonly VITE_IPFS_GATEWAY_URL: string;
  readonly VITE_INFURA_IPFS_AUTH: string;
  readonly VITE_DANKEST_POSTS_USERNAME: string;
  readonly VITE_DANKEST_POSTS_USERID: string;
  readonly VITE_LENS_COMPETITION_APP_ID: string;
  readonly VITE_LENS_COMPETITION_HUB_ADDRESS: string;
  readonly VITE_JUDGE_COMPETITION_ADDRESS: string;
  readonly VITE_JUDGE_COMPETITION_MULTIPLE_WINNERS_ADDRESS: string;
  readonly VITE_LENS_COMPETITION_HUB_DEPLOYED_BLOCK: string;
  readonly VITE_PROVIDER_MODE: "local" | "testnet" | "mainnet";
  readonly VITE_MEMESTER_COLLECT_FEE_SPLIT_ADDRESS: string;
  readonly VITE_MEMESTER_COLLECT_FEE_SPLIT: string;
  readonly VITE_COLLECT_FEE_CURRENCY: `0x${string}`;
  readonly VITE_MEMESTER_PINNED_COMPETITIONS: string;
  readonly VITE_MEMESTER_HIDDEN_COMPETITIONS: string;
  readonly VITE_MEMESTER_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
