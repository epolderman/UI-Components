import React, { useCallback } from "react";
import { ScrollSync } from "./ScrollSync";
import { Table, Column, AutoSizer } from "react-virtualized";
import { Flex } from "@rebass/grid/emotion";

const dummy_data = new Array(1000).fill({ name: "Erik", property: "Something" });

export const ScrollSyncExample: React.FC = () => {
  return (
    <ScrollSync>
      {({ scrollTop, height }) => {
        console.log("Render Child", scrollTop, height);
        return (
          <Flex flex="1 1 auto">
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  height={height}
                  width={width}
                  headerHeight={50}
                  rowCount={dummy_data.length}
                  rowHeight={90}
                  rowGetter={({ index }) => dummy_data[index]}
                  scrollTop={scrollTop}
                >
                  <Column
                    dataKey="name"
                    headerRenderer={({ dataKey }) => (
                      <div style={{ background: "yellow" }}>{dataKey}</div>
                    )}
                    width={210}
                    flexGrow={1}
                  />
                  <Column
                    width={210}
                    disableSort
                    dataKey="name"
                    cellRenderer={({ cellData }) => (
                      <div style={{ background: "blue" }}>{cellData.name}</div>
                    )}
                    flexGrow={1}
                  />
                </Table>
              )}
            </AutoSizer>
          </Flex>
        );
      }}
    </ScrollSync>
  );
};
