import { AUTH_STORAGE, CURRENT_ACCESS_TOKEN, THEME_MODE } from "../constants";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  expires?: number;
}

export interface StoredAuthTokens {
  [key: string]: AuthTokens | undefined;
}

export const getCurrentAccessToken = (): string | undefined => {
  const item = localStorage.getItem(CURRENT_ACCESS_TOKEN);
  return item !== null ? JSON.parse(item) : undefined;
};

export const getAuthTokens = (): StoredAuthTokens => {
  const item = localStorage.getItem(AUTH_STORAGE);
  const storedTokens: StoredAuthTokens = item !== null ? JSON.parse(item) : {};

  return storedTokens;
};

export const getCurrentThemeMode = (): string | undefined => {
  const item = localStorage.getItem(THEME_MODE);
  return item !== null ? item : undefined;
};
