import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { setCookie, getCookie, deleteCookie } from "../utils/cookies";
import { useSetAtom } from "jotai";
import { setUserAtom } from "../atoms/user";
import { setTokenAtom } from "../atoms/auth";
import type { AuthContextType } from "../types";

const SERVER_URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://server-ancient-butterfly-346.fly.dev/8080"
    : "http://localhost:8080";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const setUser = useSetAtom(setUserAtom);
  const setTokenAtomState = useSetAtom(setTokenAtom);

  useEffect(() => {
    const cookieToken = getCookie("access_token");
    if (cookieToken) {
      setToken(cookieToken);
    }
  }, []);

  const login = async (user_id: string, password: string) => {
    const response = await fetch(`${SERVER_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();
    setCookie("access_token", data.access, 1); // 1-day expiration
    setToken(data.access);
    setTokenAtomState(data.access);
  };

  const logout = () => {
    deleteCookie("access_token");
    setToken(null);
    setUser(null);
    setTokenAtomState(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
