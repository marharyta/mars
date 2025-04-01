import { setUserAtom, userAtom } from "../atoms/user";
import { useAtom, useSetAtom } from "jotai";
import { tokenAtom } from "../atoms/auth";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";

export const User = ({ children }: React.ReactElement) => {
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const setUser = useSetAtom(setUserAtom);

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: errorFetchingUser,
  } = useQuery({
    queryKey: ["user", 1],
    queryFn: async () => {
      if (user?.user_id) {
        const res = fetch(`http://localhost:8080/users/${user.user_id}`, {
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

  console.log("user", userData, isLoadingUser, errorFetchingUser);

  // TODO: nice loading state + nice error state
  if (errorFetchingUser) return <p>Error loading user</p>;
  if (isLoadingUser) return <p>Is loading user</p>;

  return (
    <Card title="User Info">
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
