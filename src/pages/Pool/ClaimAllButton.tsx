import React, { useCallback, useMemo } from 'react';
import Big from 'big.js';
import FarmContract from 'services/FarmContract';
import styled from 'styled-components';
import { useStore } from 'store';
import { formatBalance, formatTokenAmount, removeTrailingZeros } from 'utils/calculations';
import { ReactComponent as IconArrowDown } from 'assets/images-app/icon-arrow-down.svg';

const ButtonAndClaimList = styled.div`
  position: relative;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 0;
    display: flex;
    position: relative;
    width: 100%;
    & > button {
      width: 100%;
    }
  `}
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
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 50px;
  `}
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

const ButtonClaim = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.063rem;
  color: ${({ theme }) => theme.pink};
  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.pinkHover};
  }
  :active {
    color: ${({ theme }) => theme.pinkActive};
  }
`;

const ArrowDown = styled(IconArrowDown)`
  vertical-align: middle;
  margin-left: .25rem;
  width: .396rem;
  height: .229rem;
`;

export const getCanClaimAll = (rewardList: [string, string][]) => (rewardList.length > 0
  && rewardList.filter(([, value]) => Big(value).gt(0)).length > 0);

const displayUSD = (value: string) => {
  const apyBig = new Big(value);
  if (apyBig.eq('0')) return '-';
  if (apyBig.lte('0.01')) return '> $0.01';
  return `$${removeTrailingZeros(apyBig.toFixed(2))}`;
};

export default function ClaimAllButton({ rewardList }: {rewardList: [string, string][]}) {
  const { prices, tokens } = useStore();
  const farmContract = useMemo(() => new FarmContract(), []);

  const canClaimAll = useMemo(() => getCanClaimAll(rewardList), [rewardList]);

  const rewardPrice = useMemo(() => (rewardList.reduce((sum, [tokenId, value]) => {
    const token = tokens[tokenId] || null;
    if (!token) return sum;
    const priceToken = prices[tokenId] || '0';
    const formatAmount = formatTokenAmount(value, token.metadata.decimals);
    const amountInUSD = Big(formatAmount).mul(priceToken?.price ?? '0');
    return sum.plus(amountInUSD);
  }, new Big(0))),
  [prices, tokens, rewardList]);

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
  return (
    <ButtonAndClaimList>
      <WrapperButtonClaim>
        <span>
          {displayUSD(rewardPrice.toFixed())}
          <ArrowDown />
        </span>
        <ButtonClaim
          onClick={onClaimReward}
        >Claim All
        </ButtonClaim>
      </WrapperButtonClaim>
      <RewardList>
        {rewardListArray}
      </RewardList>
    </ButtonAndClaimList>
  );
}
