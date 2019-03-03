import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

/*
  Styled Components: 
  https://mxstbr.blog/2016/11/styled-components-magic-explained/
  https://medium.com/styled-components/how-styled-components-works-618a69970421
*/

// TEMP example

const MyButton = styled.button<{ isActive?: boolean }>`
  background-color: ${({ isActive }) => (isActive ? 'red' : 'blue')};
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
