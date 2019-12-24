import React, { useState } from "react";
import { Flex } from "@rebass/grid/emotion";
import { Typography, Button } from "@material-ui/core";
import { useSpring, interpolate, animated, config } from "react-spring";
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
  // spring animation
  const [isOpen, setOpen] = useState<Boolean>(false);

  const animationLeft = useSpring({
    transform: isOpen ? `rotateY(180deg)` : `rotateY(0deg)`,
    config: config.molasses,
  });

  const animationRight = useSpring({
    transform: isOpen ? `rotateY(180deg)` : `rotateY(0deg)`,
    config: config.gentle,
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
        <AnimatedFlex>{rightContent}</AnimatedFlex>
        {middleContent}
        <AnimatedFlex
          style={{ transformOrigin: "center left", transform: animationLeft.transform }}
        >
          {leftContent}
        </AnimatedFlex>
        {/* <AnimatedFlex
          style={{ transformOrigin: "center right", transform: animationRight.transform }}
        >
          {rightContent}
        </AnimatedFlex> */}
      </Flex>
    </Flex>
  );
};

const AnimatedFlex = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  box-shadow: 5px 10px 8px #888888;
  backface-visibility: visible;
`;
