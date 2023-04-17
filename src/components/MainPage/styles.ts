import styled from 'styled-components';
import {Typography} from 'antd';

const {Title} = Typography;

export const MainPageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #809f39;
  height: calc(100vh - 175px);
`;

export const StyledTitle = styled(Title)`
  cursor: pointer;
  code {
    background-color: #dadada;
  }
`;
