import type { DashboardProps } from "./types";
import { Button, Typography, Layout, Card } from "antd";
import { User } from "./dashboard/User";
import { DashboardLayout, DashboardCell } from "./dashboard/Layout";
import { useAcquisitionsFetcher } from "./dashboard/Aquisitions";
import { OresHistogram } from "./dashboard/OreHistogram";
import { DataList } from "./dashboard/List";

const { Title } = Typography;
const { Header, Content } = Layout;

const Scene = () => {
  return <div id="scene-container">Mars goes here</div>;
};

const OreHistogramWrapper = () => {
  const { data, loading, error } = useAcquisitionsFetcher();
  if (error) return <p>error</p>;
  if (loading) return <p>loading ...</p>;
  return (
    <Card title="Acquisition Data">
      <OresHistogram data={data} loading={loading} error={error} />
    </Card>
  );
};

const DataListWrapper = () => {
  const { data, loading, error } = useAcquisitionsFetcher();

  if (error) return <p>error</p>;
  if (loading) return <p>loading ...</p>;

  return (
    <Card title="Acquisition Data List">
      <DataList data={data} loading={false} error={null} />
    </Card>
  );
};

export const Dashboard = ({ onLogoutSuccess }: DashboardProps) => {
  // TODO: there is probably a more elegant way to design fetcher for aquisitions with atoms, but for now
  // we use standard separation of concerns method to separate them
  // The Aquisitions part of the dashboard will be using error handling

  return (
    <Layout>
      <Header className="flex flex-row justify-baseline items-baseline">
        <Title level={2} className="text-xs">
          dashboard
        </Title>
      </Header>
      <Content className="p-8">
        <DashboardLayout>
          {({ api }) => (
            <>
              <DashboardCell>
                <OreHistogramWrapper />
              </DashboardCell>
              <DashboardCell>
                <DataListWrapper />
              </DashboardCell>
              <DashboardCell>
                <Scene />
              </DashboardCell>
              <DashboardCell>
                <User>
                  <Button
                    type="primary"
                    danger
                    onClick={async () => {
                      await api.logout();
                      onLogoutSuccess();
                    }}
                    style={{ marginTop: 20 }}
                  >
                    Logout
                  </Button>
                </User>
              </DashboardCell>
            </>
          )}
        </DashboardLayout>
      </Content>
    </Layout>
  );
};
