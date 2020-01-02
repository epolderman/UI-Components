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
    y: isOpen ? `rotateY(-180deg)` : `rotateY(0deg)`,
    config: config.molasses,
    delay: isOpen ? 0 : 300,
  });
  const right = useSpring({
    y: isOpen ? `rotateY(180deg)` : `rotateY(0deg)`,
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
      <Folder flex="1 1 0%" flexDirection="row" justifyContent="center">
        {middleContent}
        <FlipperContainer>
          <Flipper
            style={{
              left: 0,
              transformOrigin: "center left",
              transform: left.y,
            }}
          >
            <FrontCard>{leftContent}</FrontCard>
            <BackCard>
              <Typography>Back</Typography>
            </BackCard>
          </Flipper>
          <Flipper
            style={{
              right: 0,
              transformOrigin: "center right",
              transform: right.y,
            }}
          >
            <FrontCard>{rightContent}</FrontCard>
            <BackCard>
              <Typography>Back</Typography>
            </BackCard>
          </Flipper>
        </FlipperContainer>
      </Folder>
    </Flex>
  );
};

const Folder = styled(Flex)`
  position: relative;
  width: 500px;
`;

const Flipper = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  width: 250px;
  transform-style: preserve-3d;
  position: relative;
`;

const FlipperContainer = styled(Flex)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  perspective: 1000px;
`;

const Card = styled(Flex)`
  position: absolute;
  top: 0;
  flex: 1 1 0%;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
`;

const FrontCard = styled(Card)`
  z-index: 2;
`;

const BackCard = styled(Card)`
  transform: rotateY(180deg);
  background-color: teal;
`;
