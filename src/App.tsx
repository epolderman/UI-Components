import { css, Global } from "@emotion/core";
import { Button, Menu, MenuItem, Typography } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Apps, ExploreOff } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useLocation,
  browserHistory,
  withRouter,
} from "react-router-dom";
import { theme } from "../src/theme/theme";
import { FoldViewExample } from "./layout/foldView/foldView.example";
import { ScrollSyncExample } from "./performance/ScrollSync/scrollSync.example";
import { DateRangeExample } from "./selection/datePickers/dateRange/dateRange.example";
import { DateExample } from "./selection/datePickers/dateSelector/dateSelector.example";
import { usePopoverState } from "./utils/hooks";

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

enum COMPONENT_ROUTES {
  home = "/",
  dateSelector = "/dateSelector",
  rangeSelector = "/rangeSelector",
  folderView = "/folderView",
  scrollSync = "/scrollSync",
}

const COMPONENT_EXAMPLES = [
  { route: COMPONENT_ROUTES.dateSelector, text: "Date Selector" },
  { route: COMPONENT_ROUTES.rangeSelector, text: "Range Selector" },
  { route: COMPONENT_ROUTES.folderView, text: "Folder View" },
  { route: COMPONENT_ROUTES.scrollSync, text: "Scroll Sync" },
];

const NavBar: React.FC = () => {
  const { element, onOpen, onClose, isOpen } = usePopoverState();
  const [activeComponent, setActiveComponent] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location == null) {
      return;
    }
    const isDefault = location.pathname === "/";
    const component = COMPONENT_EXAMPLES.find((comp) => comp.route === location.pathname);
    setActiveComponent(
      isDefault ? "Date Selector" : component != null ? component.text : "Bad Route"
    );
  }, [location]);

  return (
    <Flex justifyContent="center" alignItems="center" mt="8px" mb="64px">
      <Flex style={{ paddingRight: "8px" }}>
        <Typography>{`Active Component: ${activeComponent}`}</Typography>
      </Flex>
      <Flex>
        <Button onClick={onOpen} variant="text" style={{ color: "#ff1a75" }}>
          <Apps />
        </Button>
        <Menu
          anchorEl={element}
          open={isOpen}
          getContentAnchorEl={null}
          onClose={onClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {COMPONENT_EXAMPLES.map(({ route, text }) => {
            return (
              <MenuItem key={route} onClick={onClose} component={Link} to={route}>
                {text}
              </MenuItem>
            );
          })}
        </Menu>
      </Flex>
    </Flex>
  );
};

const ComponentRouter: React.FC = () => (
  <Router history={browserHistory}>
    <NavBar />
    <Switch>
      <Route
        exact
        path={[COMPONENT_ROUTES.home, COMPONENT_ROUTES.dateSelector]}
        component={DateExample}
      />
      <Route exact path={COMPONENT_ROUTES.rangeSelector} component={DateRangeExample} />
      <Route
        exact
        path={COMPONENT_ROUTES.scrollSync}
        component={() => (
          <Flex style={{ height: "100%", width: "100%" }}>
            <ScrollSyncExample />
          </Flex>
        )}
      />
      <Route exact path={COMPONENT_ROUTES.folderView}>
        <FoldViewExample />
      </Route>
      <Route component={FourOhFour} />
    </Switch>
  </Router>
);

export const App: React.FC = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="stretch"
      justifyContent="stretch"
      flex="1 1 0%"
    >
      <Global styles={globalStyles} />
      <MuiThemeProvider theme={theme}>
        <ComponentRouter />
      </MuiThemeProvider>
    </Flex>
  );
};

const FourOhFour: React.FC = () => {
  return (
    <Flex
      flexDirection="column"
      flex="1 1 0%"
      justifyContent="center"
      alignItems="center"
    >
      <ExploreOff fontSize="large" />
      <Typography variant="h6" color="textPrimary">
        Sorry, select a correct component route
      </Typography>
    </Flex>
  );
};
