import React from "react";
import { FoldView } from "./foldView";
import { Flex } from "@rebass/grid/emotion";
import { Typography } from "@material-ui/core";

export const FoldViewExample: React.FC<{}> = () => {
  return (
    <Flex
      style={{
        marginTop: "24px",
      }}
      justifyContent="stretch"
      alignItems="stretch"
      flex="1 1 0%"
    >
      <FoldView
        leftFrontContent={<Content color="blue" />}
        leftBackContent={<Content color="teal" />}
        middleContent={<Content color="yellow" />}
        rightFrontContent={<Content color="green" />}
        rightBackContent={<Content color="orange" />}
      />
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
