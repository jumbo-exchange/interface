import React, { useState } from 'react';
import { useModalsStore, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import { ButtonPrimary } from 'components/Button';
import { useNavigate } from 'react-router-dom';
import { getUpperCase } from 'utils';
import Input from './Input';
import {
  Layout, ModalBlock, ModalIcon,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalTitle,
  ModalBody,
  TitleAction,
  WithdrawTokenBlock,
  TokenLogo,
  TokenBlock,
  TokenValueBlock,
} from './styles';

export default function AddLiquidityModal() {
  const {
    tokens,
  } = useStore();

  const navigate = useNavigate();
  const { removeLiquidityModalOpenState, setRemoveLiquidityModalOpenState } = useModalsStore();
  const [withdrawValue, setWithdrawValue] = useState<string>('');

  if (!removeLiquidityModalOpenState.pool) return null;
  const [tokenInputName, tokenOutputName] = removeLiquidityModalOpenState.pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const tokensData = [
    {
      token: tokenInput,
      value: 0.3235,
    },
    {
      token: tokenOutput,
      value: 0.14351,
    },
  ];

  return (
    <>
      {removeLiquidityModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate('/app/pool');
        setRemoveLiquidityModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Withdraw
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate('/app/pool');
              setRemoveLiquidityModalOpenState({ isOpen: false, pool: null });
            }}
            >
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <Input
              withdrawValue={withdrawValue}
              setWithdrawValue={setWithdrawValue}
            />
            <TitleAction>
              Withdrawal Amount
            </TitleAction>
            <WithdrawTokenBlock>
              {tokensData.map(({ token, value }) => (
                <TokenBlock key={token.contractId}>
                  <TokenLogo>
                    <img
                      src={token?.metadata.icon ?? tokenLogo}
                      alt={token?.metadata.symbol}
                    />
                  </TokenLogo>
                  <TokenValueBlock>
                    <p>{value}</p>
                    &nbsp;
                    <p>{getUpperCase(token?.metadata.symbol ?? '')}</p>
                  </TokenValueBlock>
                </TokenBlock>
              ))}
            </WithdrawTokenBlock>
            <ButtonPrimary
              onClick={() => console.log('Withdraw')}
            >
              Withdraw
            </ButtonPrimary>
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
