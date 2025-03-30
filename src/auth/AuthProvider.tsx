import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { setCookie, getCookie, deleteCookie } from "../utils/cookies";
interface AuthContextType {
  token: string | null;
  login: (user_id: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookieToken = getCookie("access_token");
    if (cookieToken) {
      setToken(cookieToken);
    }
  }, []);

  const login = async (user_id: string, password: string) => {
    const response = await fetch("http://localhost:8080/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();
    setCookie("access_token", data.access, 1); // 1-day expiration
    setToken(data.access);
  };

  const logout = () => {
    deleteCookie("access_token");
    setToken(null);
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
