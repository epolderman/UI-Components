import React from 'react';
import ReactDOM from 'react-dom';
import { theme } from '../src/theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Flex, Box } from '@rebass/grid/emotion';
import { DateExample } from './selection/dateSelector/dateSelector.example';

const App: React.FC = () => (
  <MuiThemeProvider theme={theme}>
    <Flex>
      <DateExample />
    </Flex>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// @ts-ignore
module.hot.accept();
