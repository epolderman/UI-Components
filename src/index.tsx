import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { DateSelector } from './selection/dateSelector';
//TODO: Add global styles for the project
//TODO: setup favicon
//TODO: refactor to emotion over styled components

//TODO: temporary test file // refacotr

const App: React.FC = () => {
  const [currentDate, setDate] = useState(new Date());
  const onChange = useCallback((incomingDate: Date) => setDate(incomingDate), [setDate]);
  return <DateSelector value={currentDate} onChange={onChange} />;
};

ReactDOM.render(<App />, document.getElementById('root'));

//@ts-ignore
module.hot.accept();
