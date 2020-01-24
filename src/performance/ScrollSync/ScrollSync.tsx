import React, {
  useEffect,
  useRef,
  useCallback,
  Children,
  useState,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import ReactDOM from "react-dom";
import { Flex } from "@rebass/grid/emotion";
import { Typography, Button } from "@material-ui/core";

interface ChildrenProps {
  scrollTop?: number;
  height?: number;
}

interface ScrollSyncProps {
  children?: (props: ChildrenProps) => React.ReactNode;
}

export const ScrollSync: React.FC<ScrollSyncProps> = ({ children }) => {
  const [height, setHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => setScrollTop(la => parentRef.current.scrollTop), []);

  /* Against the react deps advice from Dan, but the only way we can track large measurments on divs */
  useEffect(() => setHeight(parentRef.current.getBoundingClientRect().height), [
    parentRef.current,
  ]);

  console.log("height is parent", height);

  return (
    <Flex
      ref={parentRef}
      alignItems="stretch"
      style={{
        overflowY: "scroll",
        padding: "32px",
        height: "100vh",
        width: "100%",
        background: "teal",
      }}
      onScroll={onScroll}
      flex="1 1 0%"
    >
      {children({
        scrollTop,
        height,
      })}
    </Flex>
  );
};
