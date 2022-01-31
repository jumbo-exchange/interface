import React from 'react';
import styled from 'styled-components';
import { useModalsStore } from 'store';
import { ReactComponent as CloseIcon } from 'assets/images-app/close.svg';
import { Modal, Layout } from '../styles';

const NewModal = styled(Modal)`
  max-width: 328px;
  min-width: 300px;
  min-height: 50px;
  flex-direction: row;
  border-radius: 12px;
  :before {
    border-radius: 12px;
  }
`;

const TooltipBlock = styled.div`
  margin: .75rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  p {
    margin: .25rem .75rem 0 .25rem;
    font-style: normal;
    font-weight: 300;
    font-size: .75rem;
    line-height: 1rem;
  }
`;

const ModalIcon = styled.div`
  display: flex;
  align-self: flex-start;
  svg {
    width: 16px;
    height: 17px;
  }
`;

export default function TooltipModal() {
  const {
    isTooltipModalOpen,
    setTooltipModalOpen,
    titleTooltipModal,
  } = useModalsStore();

  return (
    <>
      {isTooltipModalOpen && (
      <Layout onClick={() => setTooltipModalOpen(false)}>
        <NewModal onClick={(e) => e.stopPropagation()}>
          <TooltipBlock>
            <p>{titleTooltipModal}</p>
            <ModalIcon onClick={() => setTooltipModalOpen(false)}>
              <CloseIcon />
            </ModalIcon>
          </TooltipBlock>
        </NewModal>
      </Layout>
      )}
    </>
  );
}
