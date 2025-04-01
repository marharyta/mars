import { List, ListRowRenderer, AutoSizer } from "react-virtualized";
import dayjs from "dayjs";
import type { Ore } from "../types";

export const VirtualizedOresList: React.FC = ({ data }: { data?: Ore[] }) => {
  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    const { ore_sites, timestamp } = data[index];
    const formattedTime = dayjs
      .unix(parseInt(timestamp))
      .format("YYYY-MM-DD HH:mm:ss");

    return (
      <div
        key={key}
        style={style}
        className="px-4 py-2 border-b border-gray-200"
      >
        <div>
          <strong>Ores:</strong> {ore_sites}
        </div>
        <div>
          <strong>Time:</strong> {formattedTime}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: 400 }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={data?.length}
            rowHeight={60}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export const DataList = ({ data }) => {
  {
    /*
    TODO: 
        1. Sort by latest ascending
        2. add react-virtualized later - done
        3. Add UI
    */
  }
  return <VirtualizedOresList data={data} />;
};
