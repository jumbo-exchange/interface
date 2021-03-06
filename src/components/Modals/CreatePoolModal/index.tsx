import React, { useEffect, useState, useMemo } from 'react';
import Big from 'big.js';
import PoolContract from 'services/contracts/PoolContract';
import RenderButton from 'components/Button/RenderButton';
import {
  useModalsStore, useStore, CurrentButton,
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
import FungibleTokenContract from 'services/contracts/FungibleToken';
import getConfig from 'services/config';
import { getToken } from 'store/helpers';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalBody,
} from './styles';
import TokenBlock from './TokenBlock';
import CreatePoolSettings from './CreatePoolSetting';

const config = getConfig();

export default function CreatePoolModal() {
  const isConnected = wallet.isSignedIn();
  const { tokens } = useStore();
  const { isCreatePoolModalOpen, setCreatePoolModalOpen } = useModalsStore();
  const { t } = useTranslation();

  const [fee, setFee] = useState(TOTAL_FEE_DEFAULT);

  const [inputToken, setInputToken] = useState<FungibleTokenContract | null>(null);
  const [outputToken, setOutputToken] = useState<FungibleTokenContract | null>(null);

  const near = useMemo(() => getToken(NEAR_TOKEN_ID, tokens), [tokens]);
  const jumbo = useMemo(() => getToken(config.jumboAddress, tokens), [tokens]);
  const wNear = useMemo(() => getToken(config.nearAddress, tokens), [tokens]);

  useEffect(() => {
    if (!jumbo || !wNear) return;
    setInputToken(jumbo);
    setOutputToken(wNear);
  }, [jumbo, wNear]);

  const canCreatePool = isConnected
  && !!fee
  && new Big(fee).gt(MIN_FEE_CREATE_POOL)
  && new Big(fee).lt(MAX_FEE_CREATE_POOL)
  && !!inputToken
  && !!outputToken
  && inputToken !== near
  && outputToken !== near
  && inputToken !== outputToken;

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
              setToken={setInputToken}
            />
            <TokenBlock
              token={outputToken}
              setToken={setOutputToken}
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
