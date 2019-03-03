import React from 'react';
import ReactDOM from 'react-dom';

const App: React.FC = () => <div>Hello World!</div>;

ReactDOM.render(<App />, document.getElementById('app'));

//@ts-ignore
module.hot.accept();
