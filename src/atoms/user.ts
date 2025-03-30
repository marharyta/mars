import type { User } from "../types";
import { atom } from "jotai";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies";

const COOKIE_NAME = "user";

const getInitialUser = (): User | null => {
  const cookie = getCookie(COOKIE_NAME);
  try {
    return cookie ? (JSON.parse(cookie) as User) : null;
  } catch {
    return null;
  }
};

export const userAtom = atom<User | null>(getInitialUser());

export const setUserAtom = atom(null, (_get, set, newUser: User | null) => {
  set(userAtom, newUser);
  if (newUser) {
    const user = JSON.stringify(newUser);
    setCookie(COOKIE_NAME, user, 1);
  } else {
    deleteCookie(COOKIE_NAME);
  }
});
