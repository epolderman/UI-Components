import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { DateSelector, FoldView, SelectComponent } from './selection';
import { theme } from '../src/theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {} from './selection';

const App: React.FC = () => {
  const [currentDate, setDate] = useState(new Date());
  const [property, setProperty] = React.useState('Lotus');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProperty(event.target.value as string);
  };
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
      <div
        style={{
          display: 'flex'
        }}
      >
        <SelectComponent />
      </div>
    </MuiThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// @ts-ignore
module.hot.accept();
