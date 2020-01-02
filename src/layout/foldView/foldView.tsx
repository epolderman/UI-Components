import React, { useState, useRef, useCallback, useMemo } from "react";
import { Flex } from "@rebass/grid/emotion";
import { Typography, Button } from "@material-ui/core";
import {
  useSpring,
  interpolate,
  animated,
  config,
  useChain,
  useTransition,
  useTrail,
} from "react-spring";
import styled from "@emotion/styled";

export interface FoldViewProps {
  leftContent: React.ReactNode;
  middleContent: React.ReactNode;
  rightContent: React.ReactNode;
}

type DataNode = React.ReactNode[];

export const FoldView: React.FC<FoldViewProps> = ({
  leftContent,
  middleContent,
  rightContent,
}) => {
  // spring animation
  const [isOpen, setOpen] = useState<Boolean>(false);
  const [data, setData] = useState<DataNode>([leftContent, rightContent]);
  const trail = useTrail(data.length, {
    y: isOpen ? 180 : 0,
    config: config.molasses,
  });
  const viewStyles = useCallback(
    (index: number) => ({
      left: index === 0 ? 0 : null,
      right: index === 1 ? 0 : null,
      zIndex: index === 0 ? 1 : 0,
      transformOrigin: index === 0 ? "center left" : "center right",
    }),
    []
  );

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flex="1 1 0%"
    >
      <Button onClick={() => setOpen(isOpen => !isOpen)}>Toggle Foldview</Button>
      <Flex
        flex="1 1 0%"
        flexDirection="row"
        justifyContent="center"
        style={{ position: "relative", width: "500px" }}
      >
        {middleContent}
        {trail.map(({ y }, index) => (
          <AnimatedFlex
            key={index}
            style={{
              ...viewStyles(index),
              transform: y.interpolate(
                y => `perspective(1000px) rotateY(${index === 0 ? -y : y}deg)`
              ),
            }}
          >
            {data[index]}
          </AnimatedFlex>
        ))}
      </Flex>
    </Flex>
  );
};

const AnimatedFlex = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  position: absolute;
  top: 0;
  width: 300px;
  bottom: 0;
  /* box-shadow: 5px 10px 8px #888888; */
  backface-visibility: visible;
`;
