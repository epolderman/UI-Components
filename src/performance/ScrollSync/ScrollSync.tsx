import React, {
  useEffect,
  useRef,
  useCallback,
  Children,
  useState,
  useImperativeHandle,
} from "react";
import ReactDOM from "react-dom";
import { Flex } from "@rebass/grid/emotion";
import { Typography } from "@material-ui/core";

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

  useEffect(() => setHeight(parentRef.current.clientHeight), []);

  const onScroll = useCallback(() => {
    setScrollTop(top => parentRef.current.scrollTop);
  }, []);

  return (
    <Flex
      ref={parentRef}
      justifyContent="stretch"
      alignItems="stretch"
      style={{ overflow: "auto", height: "100vh" }}
      onScroll={onScroll}
      bg="red"
      flex="1 1 0%"
    >
      {children({
        scrollTop,
        height,
      })}
    </Flex>
  );
};
