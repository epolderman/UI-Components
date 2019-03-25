import React from 'react';
import ReactDOM from 'react-dom';
import { DateSelector } from './selection/dateSelector';
//TODO: Add global styles for the project
//TODO: setup favicon
//TODO: refactor to emotion vs styled components

const onChange = (incomingDate: Date) => console.log(incomingDate);

const App: React.FC = () => <DateSelector value={new Date()} onChange={onChange} />;

ReactDOM.render(<App />, document.getElementById('root'));

//@ts-ignore
module.hot.accept();
