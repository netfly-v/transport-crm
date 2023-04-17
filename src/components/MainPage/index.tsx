import React from 'react';
import {useNavigate} from 'react-router-dom';
import {route} from '../../constants/route';
import {MainPageWrapper, StyledTitle} from './styles';

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <MainPageWrapper>
      <StyledTitle code onClick={() => navigate(route.user)}>
        Transport CRM
      </StyledTitle>
    </MainPageWrapper>
  );
};
