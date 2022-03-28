import React from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { ButtonClaim, ButtonPrimary, ButtonSecondary } from 'components/Button';
import { IPool, useStore } from 'store';
import { SpecialContainer } from 'components/SpecialContainer';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';
import {
  toAddLiquidityPage, toRemoveLiquidityPage, toStakePage, toUnStakeAndClaimPage,
} from 'utils/routes';
import { useTranslation } from 'react-i18next';
import getConfig from 'services/config';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import RewardTokens from 'components/TokensDisplay/RewardTokens';
import FarmContract from 'services/FarmContract';
import { removeTrailingZeros } from 'utils/calculations';
import { isMobile } from 'utils/userAgent';

const config = getConfig();

const Wrapper = styled(SpecialContainer)<{isFarming: boolean}>`
  background-color: ${({ theme, isFarming }) => (isFarming ? theme.farmingBg : theme.backgroundCard)};

  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0 0 1rem 0;
  padding-top: 18px;
  min-height: 160px;
  & > div:first-child {
    min-height: 40px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      & > div:first-child {
      margin-bottom: 1.563rem;
    }
  `}
  ::before{
    border-radius: 24px;
  }
`;

const UpperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column-reverse;
    align-items: flex-start;
    
  `}
`;

const LowerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    align-items: flex-start;
  `}
`;

const LabelPool = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    justify-content: flex-end;
  `}
`;

const JumboBlock = styled.div`
  display: flex;
  margin-left: .5rem;
  padding: 4px;
  font-style: normal;
  font-weight: normal;
  font-size: .75rem;
  line-height: .875rem;
  background-color: ${({ theme }) => theme.jumboLabel};
  border-radius: 4px;
`;

const FarmBlock = styled(JumboBlock)`
  background-color: ${({ theme }) => theme.farmLabel};
`;

const BlockVolume = styled.div`
  display: flex;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2.125rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 0 1.125rem;
    flex-direction: row;
    justify-content: space-between;
  `}
`;

const TitleVolume = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin-bottom: .75rem;
  & > span {
    white-space: nowrap;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0;
  `}
`;

const LabelVolume = styled.div<{isColor?: boolean}>`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme, isColor }) => (isColor ? theme.globalGreen : theme.globalWhite)};
`;

const BlockButton = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  & > button {
    padding: 9px 15px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column-reverse;
  `}
`;

const BtnPrimary = styled(ButtonPrimary)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: .75rem 0;
  `}
`;

const BtnSecondary = styled(ButtonSecondary)`
  margin-right: .75rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0;
  `}
`;

const LogoButton = styled(AddIcon)`
  width: 12px;
  height: 12px;
  margin-right: .625rem;
`;

const BtnClaim = styled(ButtonClaim)`
  min-width: 120px;
  margin-left: 1.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: center;
    margin: 0;
    & > span:last-child {
      margin-left: 1rem;
    }
  `}
`;

interface IVolume {
  title: string;
  label: string;
  color?: boolean;
  tooltip: string;
}

interface IButtons {
  toPageAdd: string,
  titleAdd: string,
  toPageRemove: string,
  titleRemove: string,
  showButton: boolean
  navigate: NavigateFunction;
}

const Buttons = ({
  toPageAdd, titleAdd, toPageRemove, titleRemove, showButton, navigate,
}: IButtons) => (
  <>
    {showButton && (
    <BtnSecondary onClick={() => navigate(toPageRemove)}>
      {titleRemove}
    </BtnSecondary>
    )}
    <BtnPrimary onClick={() => navigate(toPageAdd)}>
      <LogoButton /> {titleAdd}
    </BtnPrimary>
  </>
);

export default function PoolCard(
  {
    pool,
    isFarming,
  } : {
    pool: IPool,
    isFarming: boolean
  },
) {
  const {
    tokens,
    farms,
    prices,
  } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [inputToken, outputToken] = pool.tokenAccountIds;
  const tokenInput = tokens[inputToken] ?? null;
  const tokenOutput = tokens[outputToken] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const jumboToken = tokens[config.jumboAddress] ?? null;
  const JumboTokenInPool = jumboToken === (tokenInput || tokenOutput);

  const farm = !pool.farm ? [] : pool.farm?.map((el) => farms[el]);
  const rewardFarm = farm.filter((el) => Big(el.claimedReward ?? 0).gt(0));

  const rewardPrice = rewardFarm.reduce((sum, el) => {
    const priceToken = prices[el.rewardToken.contractId] ?? null;
    const tokenAmount = el.claimedReward;
    const amount = Big(tokenAmount).mul(priceToken?.price ?? '0');
    return Big(sum).plus(amount).toFixed(2);
  }, '0');

  const rewardList = farm.map((el) => ({
    token: el.rewardToken,
    seedId: el.seedId,
    userRewardAmount: el.userReward ?? '0',
  }));

  const volume: IVolume[] = [
    {
      title: t('pool.totalLiquidity'),
      label: pool.totalLiquidity && Big(pool.totalLiquidity).gt(0) ? `$${pool.totalLiquidity}` : '-',
      tooltip: t('tooltipTitle.totalLiquidity'),
    },
    {
      title: t('pool.dayVolume'),
      label: '-',
      tooltip: t('tooltipTitle.dayVolume'),
    },
    {
      title: t('pool.APY'),
      label: '-',
      color: true,
      tooltip: t('tooltipTitle.APY'),
    },
  ];
  const canWithdraw = Big(pool.shares || '0').gt('0');
  const canUnStake = farm.some((el) => Big(el.userStaked || '0').gt('0'));
  const canClaim = rewardFarm.some((el) => Big(el.userReward ?? '0').gt('0'));

  const onClaim = () => {
    if (!canClaim) return;
    const contract = new FarmContract();
    contract.withdrawAllReward(rewardList);
  };

  return (
    <Wrapper isFarming={isFarming}>
      <UpperRow>
        <TokenPairDisplay pool={pool} />
        <LabelPool>
          {isFarming
            ? (
              <>
                <RewardTokens rewardTokens={rewardList.map((el) => el.token)} />
                {!isMobile && canClaim && (
                <BtnClaim onClick={onClaim}>
                  <span>${removeTrailingZeros(rewardPrice)} </span>
                  <span>Claim</span>
                </BtnClaim>
                )}

              </>
            )
            : (
              <>
                {JumboTokenInPool && <JumboBlock>Jumbo</JumboBlock>}
                {pool.farm && <FarmBlock>Farm</FarmBlock>}
              </>
            )}
        </LabelPool>
      </UpperRow>
      <LowerRow>
        <BlockVolume>
          {volume.map((el) => (
            <Column key={el.title}>
              <TitleVolume>
                <span>{el.title}</span>
                <Tooltip title={el.tooltip} />
              </TitleVolume>
              <LabelVolume isColor={el.color}>{el.label}</LabelVolume>
            </Column>
          ))}
        </BlockVolume>
        <BlockButton>
          {isFarming
            ? (
              <>
                <Buttons
                  toPageAdd={toStakePage(pool.id)}
                  titleAdd={t('action.stake')}
                  toPageRemove={toUnStakeAndClaimPage(pool.id)}
                  titleRemove={t('action.unStakeAndClaim')}
                  showButton={canUnStake}
                  navigate={navigate}
                />
                {isMobile && (
                <BtnClaim
                  onClick={onClaim}
                >
                  <span>${removeTrailingZeros(rewardPrice)} </span>
                  <span>Claim</span>
                </BtnClaim>
                )}
              </>
            )
            : (
              <Buttons
                toPageAdd={toAddLiquidityPage(pool.id)}
                titleAdd={t('action.addLiquidity')}
                toPageRemove={toRemoveLiquidityPage(pool.id)}
                titleRemove={t('action.removeLiquidity')}
                showButton={canWithdraw}
                navigate={navigate}
              />
            )}
        </BlockButton>
      </LowerRow>
    </Wrapper>
  );
}
