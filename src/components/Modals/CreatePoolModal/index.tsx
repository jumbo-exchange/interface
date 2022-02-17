import React, { useState } from 'react';
import Big from 'big.js';
import PoolContract from 'services/PoolContract';
import { useModalsStore, TokenType, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import {
  MIN_FEE_CREATE_POOL,
  MAX_FEE_CREATE_POOL,
  TOTAL_FEE_DEFAULT,
} from 'utils/constants';
import { ButtonPrimary } from 'components/Button';
import { wallet } from 'services/near';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalBody,
  CreateIconContainer,
} from './styles';
import TokenBlock from './TokenBlock';
import CreatePoolSettings from './CreatePoolSetting';

export default function CreatePoolModal() {
  const isConnected = wallet.isSignedIn();
  const { inputToken, outputToken } = useStore();
  const { isCreatePoolModalOpen, setCreatePoolModalOpen } = useModalsStore();
  const [fee, setFee] = useState(TOTAL_FEE_DEFAULT);

  const canCreatePool = isConnected
  && !!fee
  && new Big(fee).gt(MIN_FEE_CREATE_POOL)
  && new Big(fee).lt(MAX_FEE_CREATE_POOL)
  && !!inputToken
  && !!outputToken;

  const createPool = async () => {
    if (!inputToken || !outputToken) return;
    const poolContract = new PoolContract();
    await poolContract.createPool(
      { tokens: [inputToken, outputToken], fee },
    );
  };

  return (
    <>
      {isCreatePoolModalOpen && (
      <Layout onClick={() => setCreatePoolModalOpen(false)}>
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Create Pool
            </ModalTitle>
            <ModalIcon onClick={() => setCreatePoolModalOpen(false)}>
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
