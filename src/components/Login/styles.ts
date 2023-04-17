import styled from 'styled-components';

export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 175px);
  width: 100%;
`;

export const LoginButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 200px;
  min-height: 300px;
`;

export const ReCaptchaContainer = styled.div.attrs({id: 'recaptcha-container'})``;
