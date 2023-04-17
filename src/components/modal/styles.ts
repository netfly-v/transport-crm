import styled, {keyframes} from 'styled-components';

const appearAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInAnimation = keyframes`
  from {
    transform: translateY(-150px);
  }
  to {
    transform: translateY(0);
  }
`;

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation-name: ${appearAnimation};
  animation-duration: 300ms;
  background-color: rgba(255, 255, 255, 0.95);
`;

export const ModalDialog = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  position: relative;
  margin: 0 20px;
  max-height: calc(100vh - 20px);
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  animation-name: ${slideInAnimation};
  animation-duration: 0.5s;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dbdbdb;
  justify-content: space-between;
`;

export const ModalClose = styled.span`
  cursor: pointer;
  padding: 1rem;
  margin: -1rem -1rem -1rem auto;
`;

export const ModalBody = styled.div`
  overflow: auto;
`;

export const ModalContent = styled.div`
  width: 100%;
  height: 100%;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dbdbdb;
`;
