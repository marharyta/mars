import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthProvider";

interface User {
  user_id: string;
  name: string;
}

export const Dashboard = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [token]);

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {user.name} ({user.user_id})
          </li>
        ))}
      </ul>
    </div>
  );
};
