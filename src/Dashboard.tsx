import type { DashboardProps } from "./types";
import { Button, Typography, Layout, Card } from "antd";
import { User } from "./dashboard/User";
import { DashboardLayout, DashboardCell } from "./dashboard/Layout";
import { useAcquisitionsFetcher } from "./dashboard/Aquisitions";
import { OresHistogram } from "./dashboard/OreHistogram";
import { DataList } from "./dashboard/List";
import { VideoStream } from "./dashboard/Video";

// TODO: refactor it into a theme variable on Ant Design Theme provider
const MIN_HEIGHT = "min-h-[360px]";

const { Title } = Typography;
const { Header, Content } = Layout;

const OreHistogramWrapper = () => {
  const { data, loading, error } = useAcquisitionsFetcher();
  if (error)
    return (
      <Card title="Acquisition Data Error" className={MIN_HEIGHT}>
        <DataList data={data} loading={true} error={error} />
      </Card>
    );
  if (loading)
    return (
      <Card title="Acquisition Data Loading" className={MIN_HEIGHT}>
        <DataList data={data} loading={loading} error={error} />
      </Card>
    );
  return (
    <Card title="Acquisition Data" className={MIN_HEIGHT}>
      <OresHistogram data={data} loading={loading} error={error} />
    </Card>
  );
};

const DataListWrapper = () => {
  const { data, loading, error } = useAcquisitionsFetcher();

  if (error)
    return (
      <Card title="Acquisition Data List Error" className={MIN_HEIGHT}>
        <DataList data={data} loading={loading} error={error} />
      </Card>
    );
  if (loading)
    return (
      <Card title="Loading Latest Acquisition Updates" className={MIN_HEIGHT}>
        <DataList data={data} loading={loading} error={error} />
      </Card>
    );

  return (
    <Card title="Latest Acquisition Updates" className={MIN_HEIGHT}>
      <DataList data={data} loading={loading} error={error} />
    </Card>
  );
};

export const Dashboard = ({ onLogoutSuccess }: DashboardProps) => {
  return (
    <Layout>
      <Header className="flex flex-row justify-baseline items-baseline">
        <Title level={2}>dashboard</Title>
      </Header>
      <Content className="p-8">
        <DashboardLayout>
          {({ api }) => (
            <>
              <DashboardCell xs={24} md={16} lg={18}>
                <OreHistogramWrapper />
              </DashboardCell>
              <DashboardCell xs={24} md={8} lg={6}>
                <DataListWrapper />
              </DashboardCell>
              <DashboardCell xs={24} md={8} lg={6}>
                <VideoStream />
              </DashboardCell>
              <DashboardCell
                xs={24}
                md={8}
                lg={6}
                className="order-first md:order-none"
              >
                <User>
                  <Button
                    type="primary"
                    danger
                    onClick={async () => {
                      await api.logout();
                      onLogoutSuccess();
                    }}
                    className="mt-3"
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
