import React from 'react';
import ReactDOM from 'react-dom';

const app = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

ReactDOM.render(app(), document.getElementById('app'));

module.hot.accept();
