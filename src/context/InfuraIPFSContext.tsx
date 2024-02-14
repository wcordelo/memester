import * as ipfsClient from "ipfs-http-client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import { Template } from "../hooks/utils/template";

interface IPFSStorage {
  client: ipfsClient.IPFSHTTPClient;
}

const auth = "Basic " + Buffer.from(import.meta.env.VITE_INFURA_IPFS_AUTH).toString("base64");

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const InfuraIPFSContext = createContext<IPFSStorage>({
  client,
});

function InfuraIPFSContextProvider({ children }: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const contextValue = useMemo(() => {
    return { client };
  }, []);

  return <InfuraIPFSContext.Provider value={contextValue}>{children}</InfuraIPFSContext.Provider>;
}

interface IPFSResponse {
  pin?: () => void;
  ipfsHash?: string;
  reset: () => void;
}

const useStoreBlob = (blob?: Blob | null): IPFSResponse => {
  const context = useContext(InfuraIPFSContext);

  if (context === undefined) {
    throw new Error("useStoreBlob was used outside of its Provider");
  }

  const client = context.client;

  const [ipfsHash, setIPFSHash] = useState<string | undefined>();

  const pin = useCallback(() => {
    if (blob) {
      console.log(`pinning blob... with size ${blob.size}`);

      client
        .add(
          {
            content: blob,
          },
          { pin: true, cidVersion: 1 },
        )
        .then((result) => {
          setIPFSHash(result.cid.toString());
        })
        .catch(console.error); // TODO: Pass error back to hook
    }
  }, [blob]);

  const reset = (): void => {
    setIPFSHash(undefined);
  };

  return {
    pin,
    ipfsHash,
    reset,
  };
};

const useStoreJSON = (json?: Object): IPFSResponse => {
  const context = useContext(InfuraIPFSContext);

  if (context === undefined) {
    throw new Error("useStoreJSON was used outside of its Provider");
  }

  const client = context.client;

  const [ipfsHash, setIPFSHash] = useState<string | undefined>();

  const pin = useCallback(() => {
    if (json) {
      console.log(`pinning json...`);

      const blob = new Blob([JSON.stringify(json)], { type: "application/json" });

      client
        .add(
          {
            content: blob,
          },
          { pin: true, cidVersion: 1 },
        )
        .then((result) => {
          setIPFSHash(result.cid.toString());
        })
        .catch(console.error); // TODO: Pass error back to hook
    }
  }, [json]);

  const reset = (): void => {
    setIPFSHash(undefined);
  };

  return {
    pin,
    ipfsHash,
    reset,
  };
};

const useStoreMeme = (imageBlob?: Blob | null, template?: Template): IPFSResponse => {
  const context = useContext(InfuraIPFSContext);

  if (context === undefined) {
    throw new Error("useStoreBlob was used outside of its Provider");
  }

  const client = context.client;

  const [ipfsHash, setIPFSHash] = useState<string | undefined>();

  const pin = useCallback(() => {
    (async () => {
      if (imageBlob && template) {
        console.log(`pinning image... with size ${imageBlob.size}`);
        console.log(`pinning template...`);

        const templateBlob = new Blob([JSON.stringify(template)], { type: "application/json" });

        const cids: ipfsClient.CID[] = [];

        for await (const result of client.addAll(
          [
            { path: "image.jpg", content: imageBlob },
            { path: "template.json", content: templateBlob },
          ],
          {
            pin: true,
            wrapWithDirectory: true,
            cidVersion: 1,
          },
        )) {
          cids.push(result.cid);
        }

        setIPFSHash(cids[2].toString());
      }
    })().catch(console.error);
  }, [imageBlob, template]);

  const reset = (): void => {
    setIPFSHash(undefined);
  };

  return {
    pin,
    ipfsHash,
    reset,
  };
};

export { InfuraIPFSContext, InfuraIPFSContextProvider, useStoreBlob, useStoreJSON, useStoreMeme };
