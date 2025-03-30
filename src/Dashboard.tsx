import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { useAtom, useSetAtom } from "jotai";
import { tokenAtom } from "./atoms/auth";
import { setUserAtom, userAtom } from "./atoms/user";
import type { DashboardProps, Ore } from "./types";
import { Button, Typography, Layout, Card, List } from "antd";

const { Title } = Typography;
const { Header, Content } = Layout;
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
    <Card title="User Info">
      <p>
        <strong>Name:</strong> {user?.name}
      </p>
      <p>
        <strong>User ID:</strong> {user?.user_id}
      </p>
    </Card>
  );
};

const Scene = () => {
  return <div id="scene-container">Mars goes here</div>;
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
    <Card title="Acquisition Data" style={{ marginTop: 20 }}>
      <List
        dataSource={data}
        renderItem={(ore: Ore) => (
          <List.Item>
            {ore?.ore_sites} - {ore?.timestamp}
          </List.Item>
        )}
      />
    </Card>
  );
};

export const Dashboard = ({ onLogoutSuccess }: DashboardProps) => {
  const { logout } = useAuth();

  return (
    <Layout style={{ padding: 24 }}>
      <Header>
        <Title style={{ color: "white" }} level={2}>
          Dashboard
        </Title>
      </Header>
      <Content style={{ padding: 24 }}>
        <User />
        <Data />
        <Scene />
        <Button
          type="primary"
          danger
          onClick={async () => {
            await logout();
            onLogoutSuccess();
          }}
          style={{ marginTop: 20 }}
        >
          Logout
        </Button>
      </Content>
    </Layout>
  );
};
