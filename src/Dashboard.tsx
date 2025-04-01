import { useAuth } from "./auth/AuthProvider";
import { useAtom, useSetAtom } from "jotai";
import { tokenAtom } from "./atoms/auth";
import { setUserAtom, userAtom } from "./atoms/user";
import type { DashboardProps, Ore } from "./types";
import { Button, Typography, Layout, Card, List, Col, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import { OresHistogram } from "./OreHistogram";

const { Title } = Typography;
const { Header, Content } = Layout;

const User = ({ children }: React.ReactElement) => {
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

const Scene = () => {
  return <div id="scene-container">Mars goes here</div>;
};

const DataList = ({ data }) => {
  {
    /*TODO: 
        1. Sort by latest ascending
        2. add react-virtualized later
        3. Add UI
      */
  }
  return (
    <List
      dataSource={data}
      renderItem={(ore: Ore) => (
        <List.Item>
          {ore?.ore_sites} - {ore?.timestamp}
        </List.Item>
      )}
    />
  );
};

const Data = () => {
  const [token] = useAtom(tokenAtom);

  const {
    data: acquisitions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["acquisitions", 1],
    queryFn: () =>
      fetch(`http://localhost:8080/acquisitions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  if (error) <p>Error loading acquisitions</p>;
  if (isLoading) <p>Is loading aquisitions</p>;

  return (
    <>
      <Col span={12}>
        <Card title="Acquisition Data">
          <OresHistogram data={acquisitions} />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Acquisition Data List">
          <DataList data={acquisitions}></DataList>
        </Card>
      </Col>
    </>
  );
};

export const Dashboard = ({ onLogoutSuccess }: DashboardProps) => {
  const { logout } = useAuth();

  return (
    <Layout>
      <Header className="flex flex-row justify-baseline items-baseline">
        <Title level={2} className="text-xs">
          Dashboard
        </Title>
      </Header>
      <Content className="p-8">
        <Row gutter={[16, 16]}>
          <Data />
          <Col span={12}>
            <Scene />
          </Col>
          <Col span={6}>
            <User>
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
            </User>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
