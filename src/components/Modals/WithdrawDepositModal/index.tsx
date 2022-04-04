import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useModalsStore, useStore } from 'store';
import { ReactComponent as CloseIcon } from 'assets/images-app/close.svg';
import GifLoading from 'assets/gif/loading.gif';
import PoolContract from 'services/PoolContract';
import { formatBalance, formatTokenAmount, removeTrailingZeros } from 'utils/calculations';
import Big from 'big.js';
import { ButtonPrimary } from 'components/Button';
import { useTranslation } from 'react-i18next';
import { wallet } from 'services/near';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  LogoContainer,
  TokenDescriptionBlock,
  TokenRowContainer,
  TokenSubtitle,
  TokenTitle,
  ClaimModalBlock,
  ClaimModal,
  ModalFooter,
  IconClaim,
  Container,
  NoClaimBlock,
} from './styles';

export default function WithdrawDepositModal() {
  const isConnected = wallet.isSignedIn();

  const [tokensArray, setTokensArray] = useState<{[key:string]: string}>({});
  const poolContract = useMemo(() => new PoolContract(), []);
  const { isWithdrawDepositModalOpen, setWithdrawDepositModalOpen } = useModalsStore();
  const { tokens, loading } = useStore();
  const { t } = useTranslation();

  const getDeposits = useCallback(async () => {
    if (!isConnected) return;
    const useDeposits = await poolContract.getDeposits();
    setTokensArray(useDeposits);
  }, [setTokensArray, poolContract, isConnected]);

  useEffect(() => {
    getDeposits();
  }, [getDeposits]);

  const claimList = Object.entries(tokensArray).filter(([, value]) => Big(value).gt(0));

  const canClaim = claimList.length !== 0;
  const titleButton = canClaim ? t('action.claimAll') : t('action.ok');

  const claimListArray = useMemo(() => claimList.map(([tokenId, value]) => {
    const isShowing = Big(value).lte(0);
    const token = tokens[tokenId] || null;
    if (isShowing || !token) return null;
    const {
      symbol, decimals, icon, name,
    } = token.metadata;
    const formatValue = removeTrailingZeros(
      formatBalance(formatTokenAmount(value, decimals)),
    );
    return (
      <TokenRowContainer key={symbol}>
        <LogoContainer>
          <img src={icon} alt={symbol} />
        </LogoContainer>
        <TokenDescriptionBlock>
          <TokenTitle>
            <div>{symbol}</div>
            <div>{formatValue}</div>
          </TokenTitle>
          <TokenSubtitle>
            <div>{name}</div>
          </TokenSubtitle>
        </TokenDescriptionBlock>
      </TokenRowContainer>
    );
  }), [claimList, tokens]);

  const onClaim = useCallback(() => {
    if (!canClaim) {
      setWithdrawDepositModalOpen(false);
      return;
    }
    poolContract.withdraw({ claimList });
  }, [canClaim, poolContract, claimList, setWithdrawDepositModalOpen]);

  if (loading) return null;
  return (
    <>
      {isWithdrawDepositModalOpen && (
      <Layout onClick={() => setWithdrawDepositModalOpen(false)}>
        <Container>
          <ClaimModal onClick={(e) => e.stopPropagation()}>
            <ModalBlock>
              <ModalTitle>
                Claim
              </ModalTitle>
              <ModalIcon onClick={() => setWithdrawDepositModalOpen(false)}>
                <CloseIcon />
              </ModalIcon>
            </ModalBlock>
            <ClaimModalBlock canClaim={canClaim}>
              {tokensArray && canClaim
                ? claimListArray
                : (
                  <NoClaimBlock>
                    <img src={GifLoading} alt="loading" />
                    <p>{t('noResult.nothingToClaim')}</p>
                  </NoClaimBlock>
                )}
            </ClaimModalBlock>
            <ModalFooter>
              <ButtonPrimary
                onClick={onClaim}
              >
                {canClaim ? <IconClaim /> : null}
                {titleButton}
              </ButtonPrimary>
            </ModalFooter>
          </ClaimModal>
        </Container>
      </Layout>
      )}
    </>
  );
}
