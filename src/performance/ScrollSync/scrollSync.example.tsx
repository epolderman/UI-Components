import React, { useCallback } from "react";
import { ScrollSync } from "./ScrollSync";
import {
  Table,
  Column,
  AutoSizer,
  TableHeaderRowProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
} from "react-virtualized";
import { Flex } from "@rebass/grid/emotion";
import { TableCell, withStyles, TableRow } from "@material-ui/core";
import styled from "@emotion/styled";

const dummy_data = new Array(1000).fill({
  Name: "Erik",
  PropertyWithText: "Something something something something",
});

export const ScrollSyncExample: React.FC = () => {
  const tableHeaderRowRenderer = useCallback((props: TableHeaderRowProps) => {
    return (
      <VirtualTableRow component="div" style={props.style}>
        {props.columns}
      </VirtualTableRow>
    );
  }, []);

  const tableRowRenderer = useCallback((props: TableRowProps) => {
    return (
      <HoverRow key={props.index} component="div" style={props.style}>
        {props.columns}
      </HoverRow>
    );
  }, []);

  const columnCellRenderer = useCallback((props: TableCellProps) => {
    switch (props.dataKey) {
      case "Name":
        return (
          <BodyCell variant="body" component="div">
            {`${props.rowIndex} ${props.rowData.Name}`}
          </BodyCell>
        );
      case "PropertyWithText":
        return (
          <BodyCell variant="body" component="div">
            {props.rowData.PropertyWithText}
          </BodyCell>
        );
    }
  }, []);

  const getData = useCallback(({ index }) => dummy_data[index], []);

  const columnHeaderRenderer = useCallback(
    (props: TableHeaderProps) => <HeaderCell>{props.label}</HeaderCell>,
    []
  );

  return (
    <ScrollSync>
      {({ scrollTop, height }) => {
        console.log("Render Child ScrollTop", scrollTop);
        console.log("Render Child Height", height);
        return (
          <AutoSizer disableHeight>
            {({ width }) => {
              return (
                <Table
                  autoHeight
                  width={width}
                  height={height}
                  headerHeight={90}
                  rowRenderer={tableRowRenderer}
                  headerRowRenderer={tableHeaderRowRenderer}
                  rowCount={dummy_data.length}
                  rowHeight={90}
                  rowGetter={getData}
                  scrollTop={scrollTop}
                >
                  <Column
                    dataKey="Name"
                    label="Name"
                    headerRenderer={columnHeaderRenderer}
                    cellRenderer={columnCellRenderer}
                    width={210}
                    flexGrow={1}
                  />
                  <Column
                    dataKey="PropertyWithText"
                    label="Property"
                    headerRenderer={columnHeaderRenderer}
                    cellRenderer={columnCellRenderer}
                    width={210}
                    flexGrow={1}
                  />
                </Table>
              );
            }}
          </AutoSizer>
        );
      }}
    </ScrollSync>
  );
};

const BodyCell = withStyles({
  root: {
    display: "flex",
    boxSizing: "border-box",
    padding: "8px 16px !important",
    height: "60px",
    alignItems: "center",
  },
})(TableCell);

const HEADER_COLOR = "#f7f7f7";

const HeaderCell = withStyles({
  root: {
    display: "flex",
    flex: "1 1 0%",
    boxSizing: "border-box",
    padding: "8px 16px !important",
    height: "35px",
    alignItems: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
})(TableCell);

const VirtualTableRow = withStyles({
  root: {
    display: "flex",
    background: HEADER_COLOR,
    paddingRight: "0px !important",
  },
})(TableRow);

const HoverRow = styled(TableRow)`
  display: flex !important;
  background: white;
`;
