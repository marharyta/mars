import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { setUserAtom } from "./atoms/user";
import { useSetAtom } from "jotai";
import type { LoginProps } from "./types";

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [user_id, setUserId] = useState("alice");
  const [password, setPassword] = useState("1234");
  const { login } = useAuth();

  const setUser = useSetAtom(setUserAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUser({ user_id: user_id, name: "", password: "" });
      await login(user_id, password);
      onLoginSuccess();
    } catch (error) {
      console.error("Login failed!", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold underline">Login</h1>
      <input
        value={user_id}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};
