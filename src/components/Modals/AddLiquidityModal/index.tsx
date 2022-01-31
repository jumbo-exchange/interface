import React, { useState } from 'react';
import { TokenType, useModalsStore, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';
import { ButtonPrimary } from 'components/Button';
import PoolContract from 'services/PoolContract';
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
} from './styles';

export default function AddLiquidityModal() {
  const {
    inputToken,
    outputToken,
    balances,
  } = useStore();

  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');

  const { addLiquidityModalOpenState, setAddLiquidityModalOpenState } = useModalsStore();

  return (
    <>
      {addLiquidityModalOpenState.isOpen && (
      <Layout onClick={() => setAddLiquidityModalOpenState({ isOpen: false, pool: null })}>
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Add Liquidity
            </ModalTitle>
            <ModalIcon onClick={() => setAddLiquidityModalOpenState({ isOpen: false, pool: null })}>
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <Input
              token={inputToken}
              tokenType={TokenType.Input}
              value={inputTokenValue}
              setValue={setInputTokenValue}
              balance={balances[inputToken?.contractId ?? '']}
            />
            <LogoContainerAdd>
              <AddIcon />
            </LogoContainerAdd>
            <Input
              token={outputToken}
              tokenType={TokenType.Output}
              value={outputTokenValue}
              setValue={setOutputTokenValue}
              balance={balances[outputToken?.contractId ?? '']}
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
                if (!inputToken || !outputToken || !addLiquidityModalOpenState.pool) return;
                contract.addLiquidity({
                  tokenAmounts: [
                    { token: inputToken, amount: inputTokenValue },
                    { token: outputToken, amount: outputTokenValue },
                  ],
                  pool: addLiquidityModalOpenState.pool,
                });
              }}
            >
              Add Liquidity
            </ButtonPrimary>
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
