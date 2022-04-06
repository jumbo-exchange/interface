import React, { useMemo, useState } from 'react';
import { useModalsStore, useStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import FarmContract from 'services/FarmContract';
import RenderButton from 'components/Button/RenderButton';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { POOL } from 'utils/routes';
import { formatTokenAmount } from 'utils/calculations';
import Big from 'big.js';
import { INITIAL_INPUT_PLACEHOLDER } from 'utils/constants';
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

export default function UnStakeModal() {
  const { farms } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const contract = useMemo(() => new FarmContract(), []);

  const {
    unStakeModalOpenState,
    setUnStakeModalOpenState,
  } = useModalsStore();
  const { pool } = unStakeModalOpenState;
  const [unStakeValue, setUnStakeValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);

  if (!pool || !pool.farms?.length) return null;
  const [farmsInPool] = pool.farms.map((el) => farms[el]);
  if (!farmsInPool) return null;

  const { userStaked, seedId } = farmsInPool;
  const formattedFarmShares = formatTokenAmount(userStaked ?? '0', pool.lpTokenDecimals);

  const buttonDisabled = unStakeValue
    ? (new Big(unStakeValue).lte(0)
  || new Big(unStakeValue).gt(formattedFarmShares))
    : true;

  const onSubmit = () => {
    const unstakeValueBN = new Big(unStakeValue);
    if (Big(unStakeValue).eq(0)) return;
    if (unstakeValueBN.gt(formattedFarmShares)) return;

    if (!unStakeModalOpenState.pool) return;
    contract.unstake(
      seedId,
      unStakeValue,
      pool,
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
