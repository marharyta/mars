import { List, ListRowRenderer, AutoSizer } from "react-virtualized";
import { DateTime } from "luxon";
import type { Ore } from "../types";
import { zone } from "../atoms/zone";
import { useAtom } from "jotai";

export const VirtualizedOresList = ({ data }: { data: Ore[] }) => {
  const [timeZone] = useAtom(zone);
  // Sort by latest timestamp first
  const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
  console.log("sortedData?.length", sortedData?.length);
  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    const { ore_sites, timestamp } = sortedData[index];

    const formattedTime = DateTime.fromSeconds(Number(timestamp))
      .setZone(timeZone)
      .toFormat("MMM dd HH:mm:ss");

    //TODO: reafctor this
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
            rowCount={sortedData?.length}
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
        1. Sort by latest ascending - done
        2. add react-virtualized later - done
        3. Add UI
    */
  }
  return <VirtualizedOresList data={data} />;
};
