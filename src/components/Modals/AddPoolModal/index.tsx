import React from 'react';
import { useModalsStore, TokenType, useStore } from 'store';
import { ReactComponent as BackArrow } from 'assets/images-app/icon-back.svg';

import { ButtonPrimary } from 'components/Button';
import {
  Layout, ModalBlock, ModalIcon,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalTitle,
  ModalBody,
  AddIconContainer,
} from './styles';
import TokenBlock from './TokenBlock';
import AddPoolSettings from './AddPoolSetting';

export default function AddPoolModal() {
  const { inputToken, outputToken } = useStore();
  const { isAddPollModalOpen, setAddPoolModalOpen } = useModalsStore();

  return (
    <>
      {isAddPollModalOpen && (
      <Layout onClick={() => setAddPoolModalOpen(false)}>
        <LiquidityModalContainer onClick={(e:any) => e.stopPropagation()}>
          <ModalBlock>
            <ModalIcon onClick={() => setAddPoolModalOpen(false)}>
              <BackArrow />
            </ModalIcon>
            <ModalTitle>
              Add Liquidity
            </ModalTitle>
          </ModalBlock>
          <ModalBody>
            <TokenBlock
              token={inputToken}
              tokenType={TokenType.Input}
            />
            <TokenBlock
              token={outputToken}
              tokenType={TokenType.Output}
            />
            <AddPoolSettings />
            <ButtonPrimary
              onClick={() => console.log('Create Pool')}
            >
              <AddIconContainer />
              Create Pool
            </ButtonPrimary>
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
