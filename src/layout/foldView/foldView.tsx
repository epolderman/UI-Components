import styled from "@emotion/styled";
import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { Paper, withStyles } from "@material-ui/core";
import { animated, SpringConfig, useSpring } from "react-spring";

export interface FoldViewProps {
  isOpen: boolean;
  leftFrontContent: React.ReactNode;
  leftBackContent: React.ReactNode;
  middleContent: React.ReactNode;
  rightBackContent: React.ReactNode;
  rightFrontContent: React.ReactNode;
}

const folderConfig: SpringConfig = { mass: 1, tension: 150, friction: 25 };

export const FoldView: React.FC<FoldViewProps> = ({
  leftFrontContent,
  leftBackContent,
  middleContent,
  rightFrontContent,
  rightBackContent,
  isOpen,
}) => {
  // @todo replace when useTrail can reverse indexes in trail array
  const left = useSpring({
    y: isOpen ? `rotateY(-180deg)` : `rotateY(0deg)`,
    config: folderConfig,
    delay: isOpen ? 0 : 500,
  });
  const right = useSpring({
    y: isOpen ? `rotateY(180deg)` : `rotateY(0deg)`,
    config: folderConfig,
    delay: isOpen ? 500 : 0,
  });

  return (
    <FolderPaper elevation={3}>
      {middleContent}
      <SleeveFlipper
        style={{
          right: 0,
          transformOrigin: "center right",
          transform: right.y,
        }}
      >
        <SleeveContainer>
          <FrontSleeve>{rightFrontContent}</FrontSleeve>
          <BackSleeve>{rightBackContent}</BackSleeve>
        </SleeveContainer>
      </SleeveFlipper>
      <SleeveFlipper
        style={{
          left: 0,
          transformOrigin: "center left",
          transform: left.y,
        }}
      >
        <SleeveContainer>
          <FrontSleeve>{leftFrontContent}</FrontSleeve>
          <BackSleeve>{leftBackContent}</BackSleeve>
        </SleeveContainer>
      </SleeveFlipper>
    </FolderPaper>
  );
};

const FolderPaper = withStyles({
  root: {
    display: "flex",
    width: "500px",
    perspective: "3500px",
    justifyContent: "center",
    flex: "1 1 0%",
  },
})(Paper);

const SleeveContainer = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SleeveFlipper = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  width: 100%;
  transform-style: preserve-3d;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Sleeve = styled(Flex)`
  position: absolute;
  top: 0;
  flex: 1 1 0%;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
`;

const FrontSleeve = styled(Sleeve)`
  z-index: 2;
`;

const BackSleeve = styled(Sleeve)`
  transform: rotateY(180deg);
`;
