import React, { useState } from 'react';
import { useModalsStore, useStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import FarmContract from 'services/FarmContract';
import RenderButton from 'components/Button/RenderButton';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { POOL } from 'utils/routes';
import { formatTokenAmount } from 'utils/calculations';
import Big from 'big.js';
import { POOL_SHARES_DECIMALS, LP_TOKEN_DECIMALS } from 'utils/constants';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import Input from './Input';
import {
  UnStakeModalContainer,
  ModalBody,
  TokensBlock,
} from './styles';

const INITIAL_INPUT_PLACEHOLDER = '';

export default function UnStakeModal() {
  const {
    farms,
  } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    unStakeModalOpenState,
    setUnStakeModalOpenState,
  } = useModalsStore();
  const { pool } = unStakeModalOpenState;
  const [unStakeValue, setUnStakeValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);

  if (!pool) return null;

  const farm = farms[pool.farms ? pool.farms[0] : '']; // todo: fix it

  const formattedFarmShares = formatTokenAmount(farm?.userStaked ?? '0', LP_TOKEN_DECIMALS);

  const buttonDisabled = unStakeValue
    ? (new Big(unStakeValue).lte(0)
  || new Big(unStakeValue).gt(formattedFarmShares))
    : true;

  const onSubmit = () => {
    const stakeValueBN = new Big(unStakeValue);
    if (Number(unStakeValue) === 0) return;
    if (stakeValueBN.gt(formattedFarmShares)) return;

    const contract = new FarmContract();
    if (!unStakeModalOpenState.pool) return;
    contract.unstake(
      farm.seedId,
      unStakeValue,
      pool.id,
    );
  };

  return (
    <>
      {unStakeModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate(POOL);
        setUnStakeModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <UnStakeModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              {t('unStakeModal.unStake')}
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate(POOL);
              setUnStakeModalOpenState({ isOpen: false, pool: null });
            }}
            >
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <TokensBlock>
              <TokenPairDisplay pool={pool} />
            </TokensBlock>
            <Input
              shares={formattedFarmShares}
              unStakeValue={unStakeValue}
              setUnStakeValue={setUnStakeValue}
            />
            <RenderButton
              typeButton={CurrentButton.UnStake}
              onSubmit={onSubmit}
              disabled={buttonDisabled}
            />
          </ModalBody>
        </UnStakeModalContainer>
      </Layout>
      )}
    </>
  );
}
