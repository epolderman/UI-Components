import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect, useRef, useReducer } from "react";

interface ChildrenProps {
  scrollTop?: number;
  height?: number;
}

interface ScrollSyncProps {
  children?: (props: ChildrenProps) => React.ReactNode;
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

export const ScrollSync: React.FC<ScrollSyncProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const parentRef = useRef<HTMLDivElement>(null);
  const { scrollTop, height } = state;

  const onScroll = useCallback(
    () => dispatch({ type: "UPDATE_SCROLL_TOP", payload: parentRef.current.scrollTop }),
    []
  );

  /* Against the react deps advice from Dan, but the only way we can track large measurments on divs */
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
      style={{
        overflowY: "scroll",
        padding: "32px",
        height: "100vh",
        background: "#f7f7f7",
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
