import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { useStore } from 'store';
import Big from 'big.js';
import { formatTokenAmount, removeTrailingZeros } from 'utils/calculations';
import FarmContract from 'services/FarmContract';
import { IMainInfo } from '.';
import {
  InfoBLock, TitleInfo, LabelInfo, RewardList,
} from './styles';

const Container = styled(SpecialContainer)`
  border-radius: 24px;
  ::before {
    border-radius: 24px;
  }
`;

const Slides = styled.div`
  display: flex;
  overflow-x: scroll;
  position: relative;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  scroll-snap-align: center;
`;

const SliderNav = styled.div<{canClaimAll: boolean}>`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: ${({ canClaimAll }) => (canClaimAll ? '1rem' : '0')};
`;

const SliderLink = styled.div`
  display: inline-block;
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: white;
  margin: 0 .25rem 0;
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

const ButtonClaim = styled.button`
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

export default function Slider(
  {
    mainInfo,
    rewardList,
  }: {
    mainInfo: IMainInfo[],
    rewardList: [string, string][]
},
) {
  const newMainInfo = [
    {
      array: [mainInfo[0], mainInfo[2]],
    },
    {
      array: [mainInfo[1], mainInfo[3]],
    },
  ];

  const { prices, tokens } = useStore();
  const contract = useMemo(() => new FarmContract(), []);

  const canClaimAll = rewardList.length > 0
  && rewardList.filter(([, value]) => Big(value).gt(0)).length > 0;

  const rewardPrice = rewardList.reduce((sum, [tokenId, value]) => {
    const priceToken = prices[tokenId ?? ''] || '0';
    const amountInUSD = Big(value).mul(priceToken?.price ?? '0');
    return sum.plus(amountInUSD);
  }, new Big(0));

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
    contract.withdrawAllReward(filteredRewards);
  }, [contract, canClaimAll, tokens, rewardList]);

  const rewardListArray = useMemo(() => rewardList.map(([token, value]) => {
    const isShowing = Big(value).lte(0);
    const tokenContract = tokens[token];
    if (isShowing || !tokenContract) return null;
    const claimReward = formatTokenAmount(
      value, tokenContract.metadata.decimals, 6,
    );
    const tokenSymbol = tokenContract.metadata.symbol;
    return (
      <p key={tokenSymbol}>
        {claimReward} <span>{tokenSymbol}</span>
      </p>
    );
  }), [tokens, rewardList]);

  return (
    <Container>
      <Slides>
        {newMainInfo.map((el, index) => (
          <Slide key={`${index + 1}`}>
            {el.array.map((item) => (
              <InfoBLock key={item.title}>
                <TitleInfo>
                  {item.title}
                </TitleInfo>
                <LabelInfo>
                  {item.label}
                </LabelInfo>
              </InfoBLock>
            ))}
          </Slide>
        ))}
      </Slides>
      <SliderNav canClaimAll={canClaimAll}>
        <SliderLink />
        <SliderLink />
      </SliderNav>
      {canClaimAll && (
      <MobileButtonAndClaimList>
        <WrapperButtonClaim>
          <span>${removeTrailingZeros(rewardPrice.toFixed(2))} </span>
          <ButtonClaim
            onClick={onClaimReward}
          >Claim All
          </ButtonClaim>
        </WrapperButtonClaim>
        <MobileRewardList>
          {rewardListArray}
        </MobileRewardList>
      </MobileButtonAndClaimList>
      )}
    </Container>
  );
}
