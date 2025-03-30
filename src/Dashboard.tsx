import { useEffect } from "react";
import { useAuth } from "./auth/AuthProvider";
import { useAtom } from "jotai";
import { tokenAtom } from "./atoms/auth";
import { userAtom } from "./atoms/user";
import type { DashboardProps } from "./types";

export const Dashboard = ({ onLogoutSuccess }: DashboardProps) => {
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const { logout } = useAuth();

  useEffect(() => {
    if (user?.user_id) {
      const fetchUsers = async () => {
        const res = await fetch(`http://localhost:8080/users/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;

        const data = await res.json();
        console.log("user", data, user);
      };
      fetchUsers();
    }
  }, [token, user]);

  return (
    <div>
      <h2>Dashboard</h2>
      <button
        onClick={async () => {
          await logout();
          onLogoutSuccess();
        }}
      >
        Logout
      </button>
      <ul>
        {/* <li key={user.user_id}>
          {user.name} ({user.user_id}) ({user.password})
        </li> */}
      </ul>
    </div>
  );
};
