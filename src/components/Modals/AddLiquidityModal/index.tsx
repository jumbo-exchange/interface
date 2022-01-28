import React, { useState } from 'react';
import { TokenType, useModalsStore, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { ButtonPrimary } from 'components/Button';
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
    inputToken,
    outputToken,
    balances,
  } = useStore();

  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');

  const { isAddLiquidityModalOpen, setAddLiquidityModalOpen } = useModalsStore();

  return (
    <>
      {isAddLiquidityModalOpen && (
      <Layout onClick={() => setAddLiquidityModalOpen(false)}>
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Add Liquidity
            </ModalTitle>
            <ModalIcon onClick={() => setAddLiquidityModalOpen(false)}>
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
            <LogoContainerAdd />
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
              onClick={() => console.log('deposit')}
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
