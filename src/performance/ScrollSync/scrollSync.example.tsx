import React, { useCallback, useMemo } from "react";
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
import { TableCell, withStyles, TableRow, Typography, Paper } from "@material-ui/core";
import styled from "@emotion/styled";
import { makeShadow, ELEVATIONS } from "../../common/elevation";

const dummy_data = new Array(1001).fill({
  Name: "Death Stranding",
  PropertyWithText: "A very good game!",
  Type: "Role Playing Game",
  Score: "5.5",
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
      case "Type":
        return (
          <BodyCell variant="body" component="div">
            {props.rowData.Type}
          </BodyCell>
        );
      case "Score":
        return (
          <BodyCell variant="body" component="div">
            {props.rowData.Score}
          </BodyCell>
        );
    }
  }, []);

  const parentStyles = useMemo(() => ({ background: "white" }), []);

  const getData = useCallback(({ index }) => dummy_data[index], []);

  const columnHeaderRenderer = useCallback(
    (props: TableHeaderProps) => <HeaderCell>{props.label}</HeaderCell>,
    []
  );

  return (
    <ScrollSync parentContainerStyle={parentStyles}>
      {({ scrollTop, height }) => {
        return (
          <>
            <ScrollBlocker />
            <Header />
            <PaperWrapper elevation={2}>
              <AutoSizer disableHeight>
                {({ width }) => {
                  return (
                    <Table
                      autoHeight
                      width={width}
                      height={height}
                      headerHeight={35}
                      rowRenderer={tableRowRenderer}
                      headerRowRenderer={tableHeaderRowRenderer}
                      rowCount={dummy_data.length}
                      rowHeight={60}
                      rowGetter={getData}
                      scrollTop={scrollTop}
                      overscanRowCount={10}
                      gridStyle={{ outline: "none" }}
                    >
                      <Column
                        dataKey="Name"
                        label="Name"
                        headerRenderer={columnHeaderRenderer}
                        cellRenderer={columnCellRenderer}
                        width={90}
                        flexGrow={1}
                        flexShrink={1}
                      />
                      <Column
                        dataKey="PropertyWithText"
                        label="Property"
                        headerRenderer={columnHeaderRenderer}
                        cellRenderer={columnCellRenderer}
                        width={90}
                        flexGrow={1}
                        flexShrink={1}
                      />
                      <Column
                        dataKey="Type"
                        label="Type"
                        headerRenderer={columnHeaderRenderer}
                        cellRenderer={columnCellRenderer}
                        width={90}
                        flexGrow={1}
                        flexShrink={1}
                      />
                      <Column
                        dataKey="Score"
                        label="Score"
                        headerRenderer={columnHeaderRenderer}
                        cellRenderer={columnCellRenderer}
                        width={90}
                        flexGrow={1}
                        flexShrink={1}
                      />
                    </Table>
                  );
                }}
              </AutoSizer>
            </PaperWrapper>
          </>
        );
      }}
    </ScrollSync>
  );
};

const ScrollBlocker = styled(Flex)`
  height: 32px;
  min-height: 32px;
  z-index: 99;
  position: sticky;
  top: 0;
  background: white;
`;

const PaperWrapper = withStyles({
  root: {
    display: "flex",
    flex: "1 1 auto",
    margin: "0px 32px 32px 32px",
  },
})(Paper);

const HeaderWrapper = styled(Flex)`
  color: white;
  height: 44px;
  position: sticky;
  top: 32px;
  z-index: 99;
`;

const HEADER_NAV_COLOR = `rgb(47,64,80)`;

export const Header: React.FC = () => {
  return (
    <HeaderWrapper
      py="8px"
      px="16px"
      bg={HEADER_NAV_COLOR}
      margin="0px 32px"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Typography variant="subtitle1">Table Scroll Example</Typography>
    </HeaderWrapper>
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

const TABLE_HEADER_COLOR = "#f7f7f7";

const HeaderCell = withStyles({
  root: {
    display: "flex",
    flex: "1 1 0%",
    boxSizing: "border-box",
    padding: "8px 16px !important",
    height: "35px",
  },
})(TableCell);

const VirtualTableRow = withStyles({
  root: {
    display: "flex",
    background: TABLE_HEADER_COLOR,
    paddingRight: "0px !important",
    position: "sticky",
    top: "76px",
    zIndex: 99,
  },
})(TableRow);

const HoverRow = styled(TableRow)`
  display: flex !important;
  background: white;
`;
