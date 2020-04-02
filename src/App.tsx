import React, { useState, useMemo, useCallback } from "react";
import { theme } from "../src/theme/theme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
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

enum COMPONENTS {
  dateSelector = "date_selector",
  rangeSelector = "range_selector",
  folderView = "folder_view",
  scrollSync = "scroll_sync",
}

const COMPONENT_EXAMPLES = [
  "date_selector",
  "range_selector",
  "folder_view",
  "scroll_sync",
];

export const App: React.FC = () => {
  const [activeExample, setActiveExample] = useState(COMPONENT_EXAMPLES[0]);

  const onNextClick = useCallback(() => {
    let index = COMPONENT_EXAMPLES.findIndex(comp => comp === activeExample);
    if (index === COMPONENT_EXAMPLES.length - 1) {
      return setActiveExample(COMPONENT_EXAMPLES[0]);
    }
    setActiveExample(COMPONENT_EXAMPLES[index + 1]);
  }, [activeExample]);

  const onPrevClick = useCallback(() => {
    let index = COMPONENT_EXAMPLES.findIndex(comp => comp === activeExample);
    if (index - 1 < 0) {
      return setActiveExample(COMPONENT_EXAMPLES[COMPONENT_EXAMPLES.length - 1]);
    }
    setActiveExample(COMPONENT_EXAMPLES[index - 1]);
  }, [activeExample]);

  const activeJSX = useMemo(() => {
    switch (activeExample) {
      case COMPONENTS.dateSelector:
        return (
          <Flex
            justifyContent="center"
            alignItems="stretch"
            flex="1 1 0%"
            marginTop={"300px"}
          >
            <DateExample />
          </Flex>
        );
      case COMPONENTS.rangeSelector:
        return (
          <Flex justifyContent="center" alignItems="stretch" flex="1 1 0%" paddingY="8px">
            <DateRangeExample />
          </Flex>
        );
      case COMPONENTS.folderView:
        return (
          <Flex
            justifyContent="center"
            alignItems="stretch"
            flex="1 1 0%"
            marginTop="300px"
          >
            <FoldViewExample />
          </Flex>
        );
      case COMPONENTS.scrollSync:
        return (
          <Flex style={{ height: "100%", width: "100%" }}>
            <ScrollSyncExample />
          </Flex>
        );
      default:
        return (
          <Flex
            justifyContent="center"
            alignItems="stretch"
            flex="1 1 0%"
            marginTop={"300px"}
          >
            <DateExample />
          </Flex>
        );
    }
  }, [activeExample]);

  return (
    <Flex
      flexDirection="column"
      alignItems="stretch"
      justifyContent="stretch"
      flex="1 1 0%"
    >
      <MuiThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        <Flex flex="1 1 0%" justifyContent="space-between" alignItems="center">
          <Button onClick={onPrevClick}>Prev</Button>
          <Button onClick={onNextClick}>Next</Button>
        </Flex>
        {activeJSX}
      </MuiThemeProvider>
    </Flex>
  );
};
