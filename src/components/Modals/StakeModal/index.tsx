import React, { useState } from 'react';
import { useModalsStore, useStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import RenderButton from 'components/Button/RenderButton';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { POOL, toAddLiquidityPage } from 'utils/routes';
import { formatTokenAmount } from 'utils/calculations';
import { POOL_SHARES_DECIMALS } from 'utils/constants';
import FarmContract from 'services/FarmContract';
import Big from 'big.js';

import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import Input from './Input';
import { StakeModalContainer, ModalBody, GetShareBtn } from './styles';

const INITIAL_INPUT_PLACEHOLDER = '';

export default function StakeModal() {
  const {
    tokens,
  } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    stakeModalOpenState,
    setStakeModalOpenState,
    setAddLiquidityModalOpenState,
  } = useModalsStore();
  const { pool } = stakeModalOpenState;
  const [stakeValue, setStakeValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);

  if (!pool) return null;
  const [tokenInputName, tokenOutputName] = pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const formattedPoolShares = formatTokenAmount(pool?.shares ?? '0', POOL_SHARES_DECIMALS);

  const buttonDisabled = stakeValue
    ? (new Big(stakeValue).lte(0)
  || new Big(stakeValue).gt(formattedPoolShares))
    : true;

  const onSubmit = () => {
    const withdrawValueBN = new Big(stakeValue);
    const shareBN = new Big(formatTokenAmount(pool?.shares ?? '', POOL_SHARES_DECIMALS));
    if (Number(stakeValue) === 0) return;
    if (withdrawValueBN.gt(shareBN)) return;

    console.log('STAKE');
    const contract = new FarmContract();
    // if (!tokenInput || !tokenOutput
    //   || !stakeModalOpenState.pool) return;
    // contract.stake({});
  };

  return (
    <>
      {stakeModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate(POOL);
        setStakeModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <StakeModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              {t('stakeModal.stake')}
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate(POOL);
              setStakeModalOpenState({ isOpen: false, pool: null });
            }}
            >
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <Input
              shares={formattedPoolShares}
              stakeValue={stakeValue}
              setStakeValue={setStakeValue}
            />
            <GetShareBtn
              onClick={() => {
                navigate(toAddLiquidityPage(pool.id));
                setStakeModalOpenState({ isOpen: false, pool: null });
                setAddLiquidityModalOpenState({ isOpen: true, pool });
              }}
            >
              Get share
            </GetShareBtn>
            <RenderButton
              typeButton={CurrentButton.Stake}
              onSubmit={onSubmit}
              disabled={buttonDisabled}
            />
          </ModalBody>
        </StakeModalContainer>
      </Layout>
      )}
    </>
  );
}
