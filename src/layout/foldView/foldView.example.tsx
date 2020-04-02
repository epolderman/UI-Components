import React, { useState } from "react";
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
          leftFrontContent={<Content color="blue" contentString="Left Front" />}
          leftBackContent={<Content color="teal" contentString="Left Back" />}
          middleContent={<Content color="yellow" contentString="Middle" />}
          rightFrontContent={<Content color="green" contentString="Right Front" />}
          rightBackContent={<Content color="orange" contentString="Right Back" />}
        />
      </Flex>
    </Flex>
  );
};

interface ContentProps {
  color?: string;
  contentString?: string;
}

const Content: React.FC<ContentProps> = ({ color, contentString }) => {
  return (
    <Flex
      flex="1 1 0%"
      bg={color}
      style={{ height: "200px" }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography>{contentString}</Typography>
    </Flex>
  );
};
