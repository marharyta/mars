import { setUserAtom, userAtom } from "../atoms/user";
import { useAtom, useSetAtom } from "jotai";
import { tokenAtom } from "../atoms/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, Spin } from "antd";
import type { UserProps } from "../types";

const SERVER_URL =
  import.meta.env.NODE_ENV === "production"
    ? "https://server-ancient-butterfly-346.fly.dev/8080"
    : "http://localhost:8080";

export const User: React.FC<UserProps> = ({ children }) => {
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const setUser = useSetAtom(setUserAtom);

  const { isLoading: isLoadingUser, error: errorFetchingUser } = useQuery({
    queryKey: ["user", 1],
    queryFn: async () => {
      if (user?.user_id) {
        const res = fetch(`${SERVER_URL}/users/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());
        const data = await res;
        setUser(data);
        return data;
      }
    },
  });

  // TODO: create a UI component wrapper for the error and loading messages
  if (errorFetchingUser)
    return (
      <div className="relative h-full rounded border">
        <div className="w-full h-full flex flex-wrap justify-center items-center">
          <div role="alert">
            <p>Featching user data</p>
            <pre>{errorFetchingUser.message}</pre>
          </div>
        </div>
      </div>
    );

  if (isLoadingUser)
    return (
      <div className="relative h-full rounded border">
        <div className="w-full h-full flex flex-wrap justify-center items-center">
          <Spin />
        </div>
      </div>
    );

  return (
    <Card title="User Information">
      <p>
        <strong>Name:</strong> {user?.name}
      </p>
      <p>
        <strong>User ID:</strong> {user?.user_id}
      </p>
      {children}
    </Card>
  );
};
