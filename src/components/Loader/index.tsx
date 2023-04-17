import {Spin} from 'antd';
import React from 'react';
import {PageLoaderContainer} from './styles';

export const Loader = () => (
  <PageLoaderContainer>
    <Spin />
  </PageLoaderContainer>
);
