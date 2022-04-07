import React, { useMemo, useState } from 'react';
import { useModalsStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import RenderButton from 'components/Button/RenderButton';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { POOL, toAddLiquidityPage } from 'utils/routes';
import { formatTokenAmount } from 'utils/calculations';
import { INITIAL_INPUT_PLACEHOLDER, MIN_DEPOSIT_SHARES } from 'utils/constants';
import FarmContract from 'services/FarmContract';
import Big from 'big.js';

import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import InputSharesContainer from 'components/CurrencyInputPanel/InputSharesContainer';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  StakeModalContainer, ModalBody, GetShareBtn, TokensBlock, Warning,
} from './styles';

export default function StakeModal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const farmContract = useMemo(() => new FarmContract(), []);

  const {
    stakeModalOpenState,
    setStakeModalOpenState,
    setAddLiquidityModalOpenState,
  } = useModalsStore();
  const { pool, isOpen } = stakeModalOpenState;
  const [stakeValue, setStakeValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);
  const [warning, setWarning] = useState(false);

  if (!pool) return null;

  const formattedPoolShares = formatTokenAmount(pool.shares ?? '0', pool.lpTokenDecimals);
  const formattedMinDepositShares = formatTokenAmount(MIN_DEPOSIT_SHARES, pool.lpTokenDecimals);

  const buttonDisabled = stakeValue
    ? (
      new Big(stakeValue).lte(0)
      || new Big(stakeValue).gt(formattedPoolShares)
      || new Big(stakeValue).lte(formattedMinDepositShares)
    )
    : true;

  const onSubmit = () => {
    if (
      Big(stakeValue).eq(0)
      || Big(stakeValue).gt(formattedPoolShares)
      || !pool
    ) return;

    if (!pool) return;
    farmContract.stake(
      pool.lpTokenId,
      stakeValue,
      pool,
    );
  };

  const handleChange = (event: string) => {
    setStakeValue(event);
    if (!event) return;
    if (Big(event).lte(formattedMinDepositShares) && !Big(event).eq(0)) {
      setWarning(true);
      return;
    }
    setWarning(false);
  };

  return (
    <>
      {isOpen && (
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
            <TokensBlock>
              <TokenPairDisplay pool={pool} />
            </TokensBlock>
            <InputSharesContainer
              shares={formattedPoolShares}
              value={stakeValue}
              setValue={handleChange}
              isShowingButtonHalf={false}
            />
            {warning && (
            <Warning>
              {t('warningMessage.stakeMinDeposit')}
            </Warning>
            )}
            <RenderButton
              typeButton={CurrentButton.Stake}
              onSubmit={onSubmit}
              disabled={buttonDisabled}
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
          </ModalBody>
        </StakeModalContainer>
      </Layout>
      )}
    </>
  );
}
