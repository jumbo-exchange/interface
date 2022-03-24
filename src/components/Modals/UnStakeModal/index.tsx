import React, { useEffect, useState } from 'react';
import { useModalsStore, useStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import PoolContract from 'services/PoolContract';
import RenderButton from 'components/Button/RenderButton';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { POOL } from 'utils/routes';
import Refresh from 'components/Refresh';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import Input from './Input';
import {
  UnStakeModalContainer,
  ModalBody,
  LogoContainerAdd,
  RefreshBlock,
} from './styles';

const INITIAL_INPUT_PLACEHOLDER = '';

export default function UnStakeModal() {
  const {
    tokens,
    balances,
  } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [inputTokenValue, setInputTokenValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);
  const [outputTokenValue, setOutputTokenValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);

  const { unStakeModalOpenState, setUnStakeModalOpenState } = useModalsStore();
  const { pool } = unStakeModalOpenState;

  useEffect(() => {
    if (inputTokenValue !== INITIAL_INPUT_PLACEHOLDER
      || outputTokenValue !== INITIAL_INPUT_PLACEHOLDER) {
      setInputTokenValue(INITIAL_INPUT_PLACEHOLDER);
      setOutputTokenValue(INITIAL_INPUT_PLACEHOLDER);
    }
  }, [pool?.id]);

  if (!pool) return null;
  const [tokenInputName, tokenOutputName] = pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;

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
            <Input
              token={tokenInput}
              value={inputTokenValue}
              setValue={setInputTokenValue}
              balance={balances[tokenInput.contractId ?? '']}
            />
            <LogoContainerAdd />
            <Input
              token={tokenOutput}
              value={outputTokenValue}
              setValue={setOutputTokenValue}
              balance={balances[tokenOutput.contractId ?? '']}
            />
            <RefreshBlock>
              <Refresh />
            </RefreshBlock>
            <RenderButton
              typeButton={CurrentButton.UnStake}
              onSubmit={() => {
                const contract = new PoolContract();
                // if (!tokenInput || !tokenOutput || !pool) return;
                // contract.stakeToken
              }}
              disabled={false}
            />
          </ModalBody>
        </UnStakeModalContainer>
      </Layout>
      )}
    </>
  );
}
