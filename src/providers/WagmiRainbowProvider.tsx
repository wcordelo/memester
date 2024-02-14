import { connectorsForWallets, darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import * as React from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import useThemeModeStore from "../state/theme";

const supportedChains = import.meta.env.PROD ? [chain.polygon] : [chain.polygonMumbai, chain.localhost];
console.log(import.meta.env.VITE_PROVIDER_MODE);
const supportedProviders = [
  jsonRpcProvider({
    rpc: () => {
      if (import.meta.env.VITE_PROVIDER_MODE === "local") {
        return { http: "http://localhost:8545" };
      } else if (import.meta.env.VITE_PROVIDER_MODE === "testnet") {
        return { http: `https://matic-mumbai.chainstacklabs.com` };
      } else if (import.meta.env.VITE_PROVIDER_MODE === "mainnet") {
        return { http: `https://matic-mainnet.chainstacklabs.com` };
      }
      return null;
    },
  }),
  publicProvider(),
];

const { chains, provider } = configureChains(supportedChains, supportedProviders);

const connectors = connectorsForWallets([
  {
    groupName: "Suggested",
    wallets: [
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      rainbowWallet({ chains }),
      coinbaseWallet({ appName: "memester", chains }),
      argentWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export function WagmiRainbowProvider({ children }: { children?: React.ReactNode }): JSX.Element {
  const { mode } = useThemeModeStore();

  const theme = mode === "light" ? lightTheme() : darkTheme();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={theme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
