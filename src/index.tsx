import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  DateSelector,
  FoldView,
  SelectComponent,
  optionsBusiness,
  optionsProperty,
  LongMenu
} from './selection';
import { theme } from '../src/theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';

const App: React.FC = () => {
  const [currentDate, setDate] = useState(new Date());
  const onChange = useCallback((incomingDate: Date) => setDate(incomingDate), [
    setDate
  ]);

  return (
    <MuiThemeProvider theme={theme}>
      <div
        style={{
          width: '500px',
          display: 'flex'
        }}
      >
        <DateSelector value={currentDate} onChange={onChange} />
      </div>
      {/* <div
        style={{
          display: 'flex'
        }}
      >
        <SelectComponent
          business={optionsBusiness}
          properties={optionsProperty}
        />
      </div> */}
      <div
        style={{
          display: 'flex'
        }}
      >
        <LongMenu />
      </div>
    </MuiThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// @ts-ignore
module.hot.accept();
