import React from 'react';
import ReactDOM from 'react-dom';
import { theme } from '../src/theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Flex, Box } from '@rebass/grid/emotion';
import { DateExample } from './selection/dateSelector/dateSelector.example';
import { FoldViewExample } from './layout/foldView/foldView.example';

const App: React.FC = () => (
  <MuiThemeProvider theme={theme}>
    <Flex
      flexDirection='column'
      justifyContent='stretch'
      alignItems='stretch'
      flex='1 1 0%'
      bg='grey'
    >
      <DateExample />
      <Flex flex='1 1 0%' justifyContent='center' alignItems='center'>
        <FoldViewExample />
      </Flex>
    </Flex>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// @ts-ignore
module.hot.accept();
