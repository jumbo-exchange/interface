import React, { useState } from 'react';
import Big from 'big.js';
import PoolContract from 'services/PoolContract';
import RenderButton from 'components/Button/RenderButton';
import {
  useModalsStore, TokenType, useStore, CurrentButton,
} from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { useTranslation } from 'react-i18next';
import {
  MIN_FEE_CREATE_POOL,
  MAX_FEE_CREATE_POOL,
  TOTAL_FEE_DEFAULT,
  NEAR_TOKEN_ID,
} from 'utils/constants';
import { wallet } from 'services/near';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalBody,
} from './styles';
import TokenBlock from './TokenBlock';
import CreatePoolSettings from './CreatePoolSetting';

export default function CreatePoolModal() {
  const isConnected = wallet.isSignedIn();
  const { inputToken, outputToken, getToken } = useStore();
  const { isCreatePoolModalOpen, setCreatePoolModalOpen } = useModalsStore();
  const { t } = useTranslation();

  const [fee, setFee] = useState(TOTAL_FEE_DEFAULT);

  const near = getToken(NEAR_TOKEN_ID);

  const canCreatePool = isConnected
  && !!fee
  && new Big(fee).gt(MIN_FEE_CREATE_POOL)
  && new Big(fee).lt(MAX_FEE_CREATE_POOL)
  && !!inputToken
  && !!outputToken
  && inputToken !== near
  && outputToken !== near;

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
              {t('createPoolModal.createPool')}
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
            <RenderButton
              typeButton={CurrentButton.CreatePool}
              onSubmit={createPool}
              disabled={!canCreatePool}
            />
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
