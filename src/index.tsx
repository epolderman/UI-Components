import React from 'react';
import ReactDOM from 'react-dom';
import { DateSelector } from './selection/dateSelector';

/*
  Styled Components: 
  https://mxstbr.blog/2016/11/styled-components-magic-explained/
  https://medium.com/styled-components/how-styled-components-works-618a69970421


  /TODO: look into 2
  styled-components renders an element with 3 class names:
  1. this.props.className — optional passed by parent component.
  2. componentId — uniq identifier of a component but not component instance. This class has no any CSS 
     rules but it is used in nesting selectors when need to refer to other component.
  3. generatedClassName — uniq per every component instance which has actual CSS rules.
*/
const onChange = (incomingDate: Date) => console.log(incomingDate);

const App: React.FC = () => <DateSelector value={new Date()} onChange={onChange} />;

ReactDOM.render(<App />, document.getElementById('root'));

//@ts-ignore
module.hot.accept();
