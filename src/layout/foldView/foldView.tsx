import React, { useState, useRef, useCallback, useMemo } from "react";
import { Flex } from "@rebass/grid/emotion";
import { Typography, Button } from "@material-ui/core";
import { animated, config, useTrail, useSpring } from "react-spring";
import styled from "@emotion/styled";

export interface FoldViewProps {
  leftContent: React.ReactNode;
  middleContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const FoldView: React.FC<FoldViewProps> = ({
  leftContent,
  middleContent,
  rightContent,
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  // @todo replace when useTrail can reverse indexes in trail array
  const left = useSpring({
    y: isOpen
      ? `perspective(1000px) rotateY(-180deg)`
      : `perspective(1000px) rotateY(0deg)`,
    config: config.molasses,
    delay: isOpen ? 0 : 300,
  });
  const right = useSpring({
    y: isOpen
      ? `perspective(1000px) rotateY(180deg)`
      : `perspective(1000px) rotateY(0deg)`,
    config: config.molasses,
    delay: isOpen ? 300 : 0,
  });

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
        <AnimatedFlex
          style={{
            right: 0,
            transformOrigin: "center right",
            transform: right.y,
          }}
        >
          {rightContent}
        </AnimatedFlex>
        <AnimatedFlex
          style={{
            left: 0,
            transformOrigin: "center left",
            transform: left.y,
          }}
        >
          {leftContent}
        </AnimatedFlex>
      </Flex>
    </Flex>
  );
};

const AnimatedFlex = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  position: absolute;
  top: 0;
  width: 250px;
  bottom: 0;
`;
