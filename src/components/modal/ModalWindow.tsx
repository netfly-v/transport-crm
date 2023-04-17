import React from 'react';
import {useEffect} from 'react';
import {ModalWrapper, ModalDialog, ModalHeader, ModalClose, ModalBody, ModalContent, ModalFooter} from './styles';

type ModalProps = {
  visible: boolean;
  footer?: React.ReactNode;
  content: any;
  onClose: () => void;
};

export const ModalWindow: React.FC<ModalProps> = ({visible, footer, content, onClose}) => {
  const onKeydown = ({key}: KeyboardEvent) => {
    if (key === 'Escape') {
      return onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  if (!visible) return null;

  return (
    <ModalWrapper onClick={onClose}>
      <ModalDialog onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalClose onClick={onClose}>&times;</ModalClose>
        </ModalHeader>
        <ModalBody>
          <ModalContent>{content}</ModalContent>
        </ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalDialog>
    </ModalWrapper>
  );
};
