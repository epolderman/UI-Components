import React from "react";
import { theme } from "../src/theme/theme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Flex } from "@rebass/grid/emotion";
import { DateExample } from "./selection/datePickers/dateSelector/dateSelector.example";
import { DateRangeExample } from "./selection/datePickers/dateRange/dateRange.example";
import { FoldViewExample } from "./layout/foldView/foldView.example";
import { ScrollSyncExample } from "./performance/ScrollSync/scrollSync.example";
import { css, Global } from "@emotion/core";

const globalStyles = css`
  html {
    box-sizing: border-box;
  }

  body,
  html {
    margin: 0;
    padding: 0;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
`;

export const App: React.FC = () => (
  <Flex>
    <Global styles={globalStyles} />
    <MuiThemeProvider theme={theme}>
      <Flex
        flexDirection="column"
        alignItems="center"
        flex="1 1 0%"
        style={{ margin: "200px 0 200px 0", overflow: "auto" }}
      >
        <Flex justifyContent="center" alignItems="stretch" flex="1 1 0%" paddingY="8px">
          <DateRangeExample />
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="stretch"
          flex="1 1 0%"
          marginTop={"300px"}
        >
          <DateExample />
        </Flex>
        <Flex
          justifyContent="center"
          alignItems="stretch"
          flex="1 1 0%"
          marginTop="300px"
        >
          <FoldViewExample />
        </Flex>
      </Flex>
      {/* <ScrollSyncExample /> */}
    </MuiThemeProvider>
  </Flex>
);
