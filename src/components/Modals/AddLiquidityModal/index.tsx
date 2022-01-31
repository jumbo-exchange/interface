import React, { useState } from 'react';
import { TokenType, useModalsStore, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { ButtonPrimary } from 'components/Button';
import PoolContract from 'services/PoolContract';
import { useNavigate } from 'react-router-dom';
import {
  Layout, ModalBlock, ModalIcon,
} from '../styles';
import Input from './Input';
import {
  LiquidityModalContainer,
  ModalTitle,
  ModalBody,
  LogoContainerAdd,
  RefreshBlock,
  PlaceHolderGif,
  AcceptBlock,
  LabelAccept,
  InputAccept,
  DescriptionAccept,
  LogoButton,
} from './styles';

export default function AddLiquidityModal() {
  const {
    tokens,
    balances,
  } = useStore();
  const navigate = useNavigate();
  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');

  const { addLiquidityModalOpenState, setAddLiquidityModalOpenState } = useModalsStore();
  if (!addLiquidityModalOpenState.pool) return null;
  const [tokenInputName, tokenOutputName] = addLiquidityModalOpenState.pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  return (
    <>
      {addLiquidityModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate('/app/pool');
        setAddLiquidityModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Add Liquidity
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate('/app/pool');
              setAddLiquidityModalOpenState({ isOpen: false, pool: null });
            }}
            >
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <Input
              token={tokenInput}
              tokenType={TokenType.Input}
              value={inputTokenValue}
              setValue={setInputTokenValue}
              balance={balances[tokenInput.contractId ?? '']}
            />
            <LogoContainerAdd />
            <Input
              token={tokenOutput}
              tokenType={TokenType.Output}
              value={outputTokenValue}
              setValue={setOutputTokenValue}
              balance={balances[tokenOutput.contractId ?? '']}
            />
            <RefreshBlock>
              <PlaceHolderGif />
              Refresh
            </RefreshBlock>
            <AcceptBlock>
              <LabelAccept htmlFor="accept">
                <InputAccept type="checkbox" id="accept" />
                <span>Checkbox text</span>
              </LabelAccept>
              <DescriptionAccept>
                Description text if needed
              </DescriptionAccept>
            </AcceptBlock>
            <ButtonPrimary
              onClick={() => {
                const contract = new PoolContract();
                if (!tokenInput || !tokenOutput || !addLiquidityModalOpenState.pool) return;
                contract.addLiquidity({
                  tokenAmounts: [
                    { token: tokenInput, amount: inputTokenValue },
                    { token: tokenOutput, amount: outputTokenValue },
                  ],
                  pool: addLiquidityModalOpenState.pool,
                });
              }}
            >
              <LogoButton />
              Add Liquidity
            </ButtonPrimary>
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
