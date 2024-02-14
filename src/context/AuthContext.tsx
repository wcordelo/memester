import { useRefresh } from "@memester-xyz/lens-use";
import jwt_decode, { JwtPayload } from "jwt-decode";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { AUTH_STORAGE, CURRENT_ACCESS_TOKEN } from "../constants";
import { useLocalStorage } from "../store";
import { getAuthTokens, StoredAuthTokens } from "../store/auth";

type AuthenticationFunction = (accessToken: string, refreshToken: string) => void;

interface AuthStorage {
  tokens: StoredAuthTokens;
  authenticate: AuthenticationFunction;
}

const storedTokens = getAuthTokens();

const authenticate = (accessToken: string, refreshToken: string): void => {
  throw new Error("authenticate function never set!");
};

const AuthContext = createContext<AuthStorage>({
  tokens: storedTokens,
  authenticate,
});

function AuthContextProvider({ children }: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const { address } = useAccount();

  const [tokens, setTokens] = useLocalStorage<StoredAuthTokens>(AUTH_STORAGE, storedTokens);
  const [refresh, { data: refreshData }] = useRefresh(address ? tokens[address]?.refreshToken : undefined);

  const [, setCurrentAccessToken] = useLocalStorage<string | undefined>(
    CURRENT_ACCESS_TOKEN,
    address ? tokens[address]?.accessToken : undefined,
  );

  const authenticate = (accessToken: string, refreshToken: string): void => {
    const decoded = jwt_decode<JwtPayload>(accessToken);

    if (address) {
      tokens[address] = {
        accessToken,
        refreshToken,
        expires: decoded.exp,
      };

      setCurrentAccessToken(accessToken);
    } else {
      console.error("Tried to authenticate with no address!");
    }

    setTokens(tokens);
  };

  useEffect(() => {
    if (address) {
      if (tokens[address]) {
        setCurrentAccessToken(tokens[address]?.accessToken);
      }

      const interval = setInterval(() => {
        refresh().catch(console.error);
      }, import.meta.env.VITE_REFRESH_TOKEN_IN_MINS * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [address]);

  useEffect(() => {
    if (refreshData?.refresh) {
      authenticate(refreshData.refresh.accessToken, refreshData.refresh.refreshToken);
    }

    // TODO: Handle refresh error
  }, [refreshData]);

  const contextValue = useMemo(() => {
    return { tokens, authenticate };
  }, [tokens, authenticate]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

const useAuth = (address?: string): { isAuthenticated: boolean; setAuthTokens: AuthenticationFunction } => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth was used outside of its Provider");
  }

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (address && context.tokens[address]) {
      const accountAuth = context.tokens[address];

      return accountAuth?.expires ? accountAuth.expires > Math.round(Date.now() / 1000) : false;
    } else {
      return false;
    }
  });

  useEffect(() => {
    if (address && context.tokens[address]) {
      const accountAuth = context.tokens[address];

      const tokenValid = accountAuth?.expires ? accountAuth.expires > Math.round(Date.now() / 1000) : false;
      setIsAuthenticated(tokenValid);
    } else {
      setIsAuthenticated(false);
    }
  }, [address, context]);

  return {
    isAuthenticated,
    setAuthTokens: context.authenticate,
  };
};

export { AuthContext, AuthContextProvider, useAuth };
