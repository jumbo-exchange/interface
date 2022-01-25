import React, { useState } from 'react';
import { useModalsStore, TokenType, useStore } from 'store';
import { ReactComponent as BackArrow } from 'assets/images-app/icon-back.svg';

import { ButtonPrimary } from 'components/Button';
import Big from 'big.js';
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
  const [fee, setFee] = useState('0.30');

  const canAddPool = !!fee
  && new Big(fee).gt('0.01')
  && new Big(fee).lt('20')
  && !!inputToken
  && !!outputToken;

  return (
    <>
      {isAddPollModalOpen && (
      <Layout onClick={() => setAddPoolModalOpen(false)}>
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
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
            <AddPoolSettings
              fee={fee}
              setFee={setFee}
            />
            <ButtonPrimary
              onClick={() => {
                if (canAddPool) { console.log('add pool'); }
              }}
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
