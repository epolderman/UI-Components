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
          leftFrontContent={<Content color="blue" />}
          leftBackContent={<Content color="teal" />}
          middleContent={<Content color="yellow" />}
          rightFrontContent={<Content color="green" />}
          rightBackContent={<Content color="orange" />}
        />
      </Flex>
    </Flex>
  );
};

interface ContentProps {
  color?: string;
}

const Content: React.FC<ContentProps> = ({ color }) => {
  return (
    <Flex
      flex="1 1 0%"
      bg={color}
      style={{ height: "200px" }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography>Content</Typography>
    </Flex>
  );
};
