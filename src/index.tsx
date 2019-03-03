import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

/*
  Magic Behind Styled Components: https://mxstbr.blog/2016/11/styled-components-magic-explained/
*/

// TEMP example

const MyButton = styled.button<{ isActive?: boolean }>`
  background-color: ${props => (props.isActive ? 'red' : 'blue')};
  width: 100px;
  height: 100px;
`;

interface TextProps {
  name: string;
}

const Text: React.FC<TextProps> = ({ name }) => {
  return <h1>{`hello ${name}`}</h1>;
};

const App: React.FC = () => (
  <div>
    <Text name={'erik'} />
    <MyButton isActive>Button Text</MyButton>
    <MyButton>Second Text</MyButton>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));

//@ts-ignore
module.hot.accept();
