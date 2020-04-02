import React, { useState, useMemo } from "react";
import { FoldView } from "./foldView";
import { Flex } from "@rebass/grid/emotion";
import { Typography, Button } from "@material-ui/core";

export const FoldViewExample: React.FC<{}> = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <Flex
      style={{
        margin: "24px 16px 24px 16px",
      }}
      justifyContent="center"
      alignItems="stretch"
      flex="1 1 0%"
    >
      <Flex flexDirection="column">
        <Button onClick={() => setOpen(isOpen => !isOpen)}>Toggle Foldview</Button>
        <FoldView
          isOpen={isOpen}
          leftFrontContent={<Content_Mimicer color="blue" contentString="Left Front" />}
          leftBackContent={<Content_Mimicer color="teal" contentString="Left Back" />}
          middleContent={<Content_Mimicer color="yellow" contentString="Middle" />}
          rightFrontContent={
            <Content_Mimicer color="green" contentString="Right Front" />
          }
          rightBackContent={<Content_Mimicer color="orange" contentString="Right Back" />}
        />
      </Flex>
    </Flex>
  );
};

interface ContentMimicerProps {
  color?: string;
  contentString?: string;
}

const DUMMY_DATA = new Array(500).fill(null);

const Content_Mimicer: React.FC<ContentMimicerProps> = ({ color, contentString }) => {
  const isInner = contentString === "Left Front" || contentString === "Right Front";
  const activeDOM = useMemo(() => {
    if (isInner) {
      return <Typography>{contentString}</Typography>;
    }
    return DUMMY_DATA.map(val => <Typography>{contentString}</Typography>);
  }, [contentString, isInner]);

  return (
    <Flex
      flex="1 1 0%"
      bg={color}
      style={{ height: "500px", overflow: "auto" }}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {activeDOM}
    </Flex>
  );
};
