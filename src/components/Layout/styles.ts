import styled from 'styled-components';

export const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Main = styled.main`
  flex-grow: 1;
  display: flex;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 20px 40px;
  background-color: #dadada;
`;

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 100px;
  background-color: #dadada;
`;

export const FooterText = styled.span`
  font-size: 20px;
`;

export const MenuWrapper = styled.div`
  width: 20%;
  background-color: #a9c3ba;
  min-height: calc(100vh - 175px);
`;
