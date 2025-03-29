import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";

interface Props {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: Props) => {
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(user_id, password);
      onLoginSuccess();
    } catch {
      alert("Login failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
