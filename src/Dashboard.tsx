import { useAuth } from "./auth/AuthProvider";
import { useAtom } from "jotai";
import { tokenAtom } from "./atoms/auth";
import type { DashboardProps } from "./types";
import { Button, Typography, Layout, Card, Col, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import { OresHistogram } from "./dashboard/OreHistogram";
import { DataList } from "./dashboard/List";
import { User } from "./dashboard/User";

const { Title } = Typography;
const { Header, Content } = Layout;

const Scene = () => {
  return <div id="scene-container">Mars goes here</div>;
};

const Data = () => {
  const [token] = useAtom(tokenAtom);

  {
    /* I wish there was pagination */
  }

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
          <Col span={12}>
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
