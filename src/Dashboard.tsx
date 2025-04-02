import type { DashboardProps } from "./types";
import { Button, Typography, Layout, Card } from "antd";
import { User } from "./dashboard/User";
import { DashboardLayout, DashboardCell } from "./dashboard/Layout";
import { AcquisitionsFetcher } from "./dashboard/Aquisitions";
import { OresHistogram } from "./dashboard/OreHistogram";
import { DataList } from "./dashboard/List";

const { Title } = Typography;
const { Header, Content } = Layout;

const Scene = () => {
  return <div id="scene-container">Mars goes here</div>;
};

export const Dashboard = ({ onLogoutSuccess }: DashboardProps) => {
  // TODO: there is probably a more elegant way to design fetcher for aquisitions with atoms, but for now
  // we use standard separation of concerns method to separate them
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
              <AcquisitionsFetcher>
                {({ state }) => (
                  <>
                    <DashboardCell>
                      <Card title="Acquisition Data">
                        <OresHistogram data={state} />
                      </Card>
                    </DashboardCell>
                    <DashboardCell>
                      <Card title="Acquisition Data List">
                        <DataList data={state}></DataList>
                      </Card>
                    </DashboardCell>
                  </>
                )}
              </AcquisitionsFetcher>
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
