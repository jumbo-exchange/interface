import React, { useState } from 'react';
import { TokenType, useModalsStore, useStore } from 'store';
import { ReactComponent as BackArrow } from 'assets/images-app/icon-back.svg';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';
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
} from './styles';

export default function LiquidityModal() {
  const {
    inputToken,
    outputToken,
    balances,
  } = useStore();

  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');

  const { isLiquidityModalOpen, setLiquidityModalOpen } = useModalsStore();

  return (
    <>
      {isLiquidityModalOpen && (
      <Layout onClick={() => setLiquidityModalOpen(false)}>
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalIcon onClick={() => setLiquidityModalOpen(false)}>
              <BackArrow />
            </ModalIcon>
            <ModalTitle>
              Add Liquidity
            </ModalTitle>
            <ModalIcon>
              <AddIcon />
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
              onClick={() => console.log('deposit')}
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
