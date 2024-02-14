import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ParallaxProvider } from "react-scroll-parallax";

import { App } from "./App";
import { InfuraIPFSContextProvider } from "./context/InfuraIPFSContext";
import { ApolloAuthProvider } from "./providers/ApolloAuthProvider";
import { WagmiRainbowProvider } from "./providers/WagmiRainbowProvider";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster position="bottom-right" />
    <HelmetProvider>
      <ParallaxProvider>
        <WagmiRainbowProvider>
          <InfuraIPFSContextProvider>
            <ApolloAuthProvider>
              <App />
            </ApolloAuthProvider>
          </InfuraIPFSContextProvider>
        </WagmiRainbowProvider>
      </ParallaxProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
