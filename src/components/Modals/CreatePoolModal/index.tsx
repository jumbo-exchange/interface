import React, { useState } from 'react';
import Big from 'big.js';
import { useModalsStore, TokenType, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { TOTAL_FEE_DEFAULT } from 'utils/constants';
import { ButtonPrimary } from 'components/Button';
import PoolContract from 'services/PoolContract';
import { Layout, ModalBlock, ModalIcon } from '../styles';
import {
  LiquidityModalContainer,
  ModalTitle,
  ModalBody,
  CreateIconContainer,
} from './styles';
import TokenBlock from './TokenBlock';
import CreatePoolSettings from './CreatePoolSetting';

export default function CreatePoolModal() {
  const { inputToken, outputToken } = useStore();
  const { isCreatePollModalOpen, setCreatePollModalOpen } = useModalsStore();
  const [fee, setFee] = useState(TOTAL_FEE_DEFAULT);

  const canCreatePool = !!fee
  && new Big(fee).gt('0.01')
  && new Big(fee).lt('20')
  && !!inputToken
  && !!outputToken;

  const createPool = async () => {
    if (!inputToken || !outputToken) return;
    const poolContract = new PoolContract();
    await poolContract.createPool(
      { tokens: [inputToken.contractId, outputToken.contractId], fee },
    );
  };

  return (
    <>
      {isCreatePollModalOpen && (
      <Layout onClick={() => setCreatePollModalOpen(false)}>
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Create Pool
            </ModalTitle>
            <ModalIcon onClick={() => setCreatePollModalOpen(false)}>
              <Close />
            </ModalIcon>
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
            <CreatePoolSettings
              fee={fee}
              setFee={setFee}
            />
            <ButtonPrimary
              onClick={() => {
                if (canCreatePool) createPool();
              }}
            >
              <CreateIconContainer />
              Create Pool
            </ButtonPrimary>
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
