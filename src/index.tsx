import React from 'react';
import ReactDOM from 'react-dom';

interface TextProps {
  name: string;
}

const Text: React.FC<TextProps> = ({ name }) => {
  return <h1>{`hello ${name}`}</h1>;
};

const App: React.FC = () => (
  <div>
    <Text name={'erik'} />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));

//@ts-ignore
module.hot.accept();
