import React, { useState } from 'react';
import Big from 'big.js';
import PoolContract from 'services/PoolContract';
import getConfig from 'services/config';
import { useModalsStore, TokenType, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { JUMBO_TOKEN_ID, TOTAL_FEE_DEFAULT } from 'utils/constants';
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

const config = getConfig();

export default function CreatePoolModal() {
  const isConnected = wallet.isSignedIn();
  const { getToken } = useStore();
  const { isCreatePoolModalOpen, setCreatePoolModalOpen } = useModalsStore();
  const [fee, setFee] = useState(TOTAL_FEE_DEFAULT);

  const jumbo = getToken(JUMBO_TOKEN_ID);
  const wNear = getToken(config.nearAddress);

  const canCreatePool = isConnected
  && !!fee
  && new Big(fee).gt('0.01')
  && new Big(fee).lt('20')
  && !!jumbo
  && !!wNear;

  const createPool = async () => {
    if (!jumbo || !wNear) return;
    const poolContract = new PoolContract();
    await poolContract.createPool(
      { tokens: [jumbo, wNear], fee },
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
              token={jumbo}
              tokenType={TokenType.Input}
            />
            <TokenBlock
              token={wNear}
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
