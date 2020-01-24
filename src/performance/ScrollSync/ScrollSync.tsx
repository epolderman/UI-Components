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

/* Can we get away just holding this in state? */
export const ScrollSync: React.FC<ScrollSyncProps> = ({ children }) => {
  const [height, setHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => setScrollTop(la => parentRef.current.scrollTop), []);
  useEffect(() => setHeight(parentRef.current.getBoundingClientRect().height), [
    parentRef.current,
  ]);

  return (
    <Flex
      ref={parentRef}
      bg="teal"
      style={{ overflowY: "scroll", padding: "32px", height: "900px" }}
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
