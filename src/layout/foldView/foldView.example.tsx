import React from 'react';
import { FoldView } from './foldView';
import { Flex } from '@rebass/grid/emotion';

export const FoldViewExample: React.FC<{}> = () => {
  return (
    <Flex
      style={{ marginTop: '24px' }}
      justifyContent='stretch'
      alignItems='stretch'
      flex='1 1 0%'
      bg='blue'
    >
      <FoldView />
    </Flex>
  );
};
