import React, { useCallback, useMemo } from 'react';
import Big from 'big.js';
import FarmContract from 'services/contracts/FarmContract';
import styled from 'styled-components';
import { useStore } from 'store';
import { ButtonClaim } from 'components/Button';
import { formatBalance, formatTokenAmount, removeTrailingZeros } from 'utils/calculations';
import { isMobile } from 'utils/userAgent';

const ButtonAndClaimList = styled.div`
  position: relative;
  margin-left: 1rem;
  :hover div {
    display: flex;
  }
`;

const RewardList = styled.div`
  z-index: 1;
  position: absolute;
  display: none;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background-color: ${({ theme }) => theme.claimListBg};
  padding: .75rem 1rem;
  border-radius: 12px;
  top: 45px;
  & > p {
    margin: 4px 0;
    font-weight: 300;
    font-size: .75rem;
    line-height: .875rem;
  }
`;

const MobileButtonAndClaimList = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  & > button {
    width: 100%;
  }
  :hover div {
    display: flex;
  }
`;

const WrapperButtonClaim = styled.div`
  min-width: 170px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${({ theme }) => theme.claimButton};
  color: ${({ theme }) => theme.globalWhite};
  border-radius: 12px;

  & > span {
    font-style: normal;
    font-weight: 300;
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.globalWhite};
  }
  :hover {
    cursor: pointer;
  }
`;

const MobileButtonClaim = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.063rem;
  color: ${({ theme }) => theme.pink};
`;

const MobileRewardList = styled(RewardList)`
  top: 50px;
`;

export const getCanClaimAll = (rewardList: [string, string][]) => (rewardList.length > 0
  && rewardList.filter(([, value]) => Big(value).gt(0)).length > 0);

export default function ClaimAllButton({ rewardList }: {rewardList: [string, string][]}) {
  const { prices, tokens } = useStore();
  const farmContract = useMemo(() => new FarmContract(), []);

  const canClaimAll = useMemo(() => getCanClaimAll(rewardList), [rewardList]);

  const rewardPrice = useMemo(() => (rewardList.reduce((sum, [tokenId, value]) => {
    const priceToken = prices[tokenId ?? ''] || '0';
    const amountInUSD = Big(value).mul(priceToken?.price ?? '0');
    return sum.plus(amountInUSD);
  }, new Big(0))),
  [prices, rewardList]);

  const rewardListArray = useMemo(() => (rewardList.map(([token, value]) => {
    const isShowing = Big(value).lte(0);
    const tokenContract = tokens[token];
    if (isShowing || !tokenContract) return null;
    const claimReward = formatTokenAmount(
      value, tokenContract.metadata.decimals,
    );
    const tokenSymbol = tokenContract.metadata.symbol;
    return (
      <p key={tokenSymbol}>
        {formatBalance(claimReward)} <span>{tokenSymbol}</span>
      </p>
    );
  })),
  [rewardList, tokens]);

  const onClaimReward = useCallback(() => {
    if (!canClaimAll) return;
    const rewards = rewardList.map(([tokenId, value]) => {
      const token = tokens[tokenId] || null;
      return {
        token, value,
      };
    });
    const filteredRewards = rewards.filter((el) => el.token !== null && Big(el.value).gt(0));
    if (!filteredRewards.length) return;
    farmContract.withdrawAllReward(filteredRewards);
  }, [farmContract, canClaimAll, tokens, rewardList]);

  if (!canClaimAll) return null;
  if (isMobile) {
    return (
      <MobileButtonAndClaimList>
        <WrapperButtonClaim>
          <span>${removeTrailingZeros(rewardPrice.toFixed(2))} </span>
          <MobileButtonClaim
            onClick={onClaimReward}
          >Claim All
          </MobileButtonClaim>
        </WrapperButtonClaim>
        <MobileRewardList>
          {rewardListArray}
        </MobileRewardList>
      </MobileButtonAndClaimList>
    );
  }
  return (
    <ButtonAndClaimList>
      <ButtonClaim
        onClick={onClaimReward}
      >
        <span>${removeTrailingZeros(rewardPrice.toFixed(2))} </span>
        <span>Claim All</span>
      </ButtonClaim>
      <RewardList>
        {rewardListArray}
      </RewardList>
    </ButtonAndClaimList>
  );
}
