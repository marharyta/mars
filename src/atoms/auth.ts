import { atom } from "jotai";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies";

const COOKIE_NAME = "access_token";

// Base atom for the token, synced with cookie
export const tokenAtom = atom<string | null>(() => {
  return getCookie(COOKIE_NAME);
});

export const setTokenAtom = atom(null, (_get, set, newToken: string | null) => {
  if (newToken) {
    setCookie(COOKIE_NAME, newToken, 1);
  } else {
    deleteCookie(COOKIE_NAME);
  }
  set(tokenAtom, newToken);
});
