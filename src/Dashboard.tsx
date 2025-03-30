import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { useAtom, useSetAtom } from "jotai";
import { tokenAtom } from "./atoms/auth";
import { setUserAtom, userAtom } from "./atoms/user";
import type { DashboardProps, Ore } from "./types";

const User = () => {
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const setUser = useSetAtom(setUserAtom);
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
        setUser(data);
      };
      fetchUsers();
    }
  }, [token, user, setUser]);

  return (
    <section>
      {user?.name}
      {user?.user_id}
    </section>
  );
};

const Data = () => {
  const [token] = useAtom(tokenAtom);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8080/acquisitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;

      const data = await res.json();
      setData(data);
      console.log("data", data);
    };
    fetchData();
  }, []);

  return (
    <section>
      {data.map((ore: Ore) => (
        <div key={ore?.timestamp}>
          {ore?.ore_sites}
          {ore?.timestamp}
        </div>
      ))}
    </section>
  );
};

export const Dashboard = ({ onLogoutSuccess }: DashboardProps) => {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <User />
      <Data />
      <button
        onClick={async () => {
          await logout();
          onLogoutSuccess();
        }}
      >
        Logout
      </button>
    </div>
  );
};
