import React from 'react';
import ReactDOM from 'react-dom';
import { theme } from '../src/theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Flex } from '@rebass/grid/emotion';
import { DateExample } from './selection/datePickers/dateSelector/dateSelector.example';
import { DateRangeExample } from './selection/datePickers/dateRange/dateRange.example';
///
const App: React.FC = () => (
  <MuiThemeProvider theme={theme}>
    <Flex
      justifyContent='center'
      alignItems='stretch'
      flex='1 1 0%'
      paddingY='8px'
    >
      <DateRangeExample />
    </Flex>
    <Flex
      justifyContent='center'
      alignItems='stretch'
      flex='1 1 0%'
      paddingY='500px'
    >
      <DateExample />
    </Flex>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

module.hot.accept();
