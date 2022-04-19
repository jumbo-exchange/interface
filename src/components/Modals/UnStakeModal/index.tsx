import React, { useMemo, useState } from 'react';
import { useModalsStore, useStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import FarmContract from 'services/contracts/FarmContract';
import RenderButton from 'components/Button/RenderButton';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { POOL } from 'utils/routes';
import { formatTokenAmount } from 'utils/calculations';
import Big from 'big.js';
import { INITIAL_INPUT_PLACEHOLDER } from 'utils/constants';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import InputSharesContainer from 'components/CurrencyInputPanel/InputSharesContainer';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  UnStakeModalContainer,
  ModalBody,
  TokensBlock,
} from './styles';

export default function UnStakeModal() {
  const { farms } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const farmContract = useMemo(() => new FarmContract(), []);

  const {
    unStakeModalOpenState,
    setUnStakeModalOpenState,
  } = useModalsStore();
  const { pool, isOpen } = unStakeModalOpenState;
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
    if (
      Big(unStakeValue).eq(0)
      || Big(unStakeValue).gt(formattedFarmShares)
      || !pool
    ) return;

    if (!pool) return;
    farmContract.unstake(
      seedId,
      unStakeValue,
      pool,
    );
  };

  return (
    <>
      {isOpen && (
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
            <InputSharesContainer
              shares={formattedFarmShares}
              value={unStakeValue}
              setValue={setUnStakeValue}
              isShowingButtonHalf={false}
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
