import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect, useRef, useReducer } from "react";

interface ChildrenProps {
  scrollTop?: number;
  height?: number;
}

interface ScrollSyncProps {
  children?: (props: ChildrenProps) => React.ReactNode;
  parentContainerStyle?: React.CSSProperties;
}

interface ScrollSyncState {
  scrollTop: number;
  height: number;
}

const initialState: ScrollSyncState = {
  scrollTop: 0,
  height: 0,
};

type ScrollSyncActions =
  | { type: "UPDATE_HEIGHT"; payload: number }
  | { type: "UPDATE_SCROLL_TOP"; payload: number };

function reducer(state: ScrollSyncState, action: ScrollSyncActions): ScrollSyncState {
  switch (action.type) {
    case "UPDATE_HEIGHT":
      return { ...state, height: action.payload };
    case "UPDATE_SCROLL_TOP":
      return { ...state, scrollTop: action.payload };
  }
}

export const ScrollSync: React.FC<ScrollSyncProps> = ({
  children,
  parentContainerStyle,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const parentRef = useRef<HTMLDivElement>(null);
  const { scrollTop, height } = state;

  const onScroll = useCallback(
    () => dispatch({ type: "UPDATE_SCROLL_TOP", payload: parentRef.current.scrollTop }),
    []
  );

  /* 
  
  Against the react deps advice from Dan, 
  but the only way we can track large measurments on large divs 
  
  */
  useEffect(
    () =>
      dispatch({
        type: "UPDATE_HEIGHT",
        payload: parentRef.current.getBoundingClientRect().height,
      }),
    [parentRef.current]
  );

  return (
    <Flex
      ref={parentRef}
      alignItems="stretch"
      justifyContent="stretch"
      flexDirection="column"
      style={{
        ...parentContainerStyle,
        overflowY: "scroll",
        height: "100vh",
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
