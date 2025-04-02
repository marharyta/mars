import { DateTime } from "luxon";
import type { Ore } from "../types";
import { Card, Typography, Skeleton } from "antd";
import { memo } from "react";
const { Text, Title } = Typography;

const OreSiteCard = memo(
  ({
    timestamp,
    ore_sites,
    index,
  }: {
    timestamp: number;
    ore_sites: number;
    index: number;
  }) => {
    console.log("OreSiteCard re-render", index);
    const formattedDate = DateTime.fromSeconds(timestamp).toLocaleString(
      DateTime.DATE_FULL
    );

    return (
      <Card
        className="radius-xl shadow"
        style={{
          marginBottom: 16,
        }}
      >
        <Title level={5} className="text-sm">
          Ore Site Update {index}
        </Title>
        <Text type="secondary">Report Date: {formattedDate}</Text>
        <div style={{ marginTop: 12 }}>
          <Text strong>Total Ore Sites: </Text>
          <Text>{ore_sites}</Text>
        </div>
      </Card>
    );
  }
);

export const DataList = ({
  data,
  loading,
  error,
}: {
  data: Ore[];
  loading: Boolean;
  error: any;
}) => {
  {
    /*
    TODO: 
        1. Sort by latest ascending - done
        2. add react-virtualized later - done
        3. Add UI
    */
  }

  if (error)
    return (
      <div role="alert">
        <p>Featching aquisitions data</p>
        <pre>{error.message}</pre>
      </div>
    );

  if (loading) return <Skeleton active paragraph={{ rows: 1 }} />;

  return (
    <ul className="h-[400px] overflow-y-auto">
      {data?.map((d, index) => (
        <li key={index}>
          <OreSiteCard
            key={index}
            timestamp={d.timestamp}
            ore_sites={d.ore_sites}
            index={index}
          />
        </li>
      ))}
    </ul>
  );
};
