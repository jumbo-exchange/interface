import React from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { IPool, useStore } from 'store';
import { SpecialContainer } from 'components/SpecialContainer';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';
import {
  toAddLiquidityPage, toRemoveLiquidityPage, toStakePage, toUnStakeAndClaimPage,
} from 'utils/routes';
import { useTranslation } from 'react-i18next';
import getConfig from 'services/config';
import TokenPairDisplay from 'components/TokenPairDisplay';

const config = getConfig();

const Wrapper = styled(SpecialContainer)<{isFarming: boolean}>`
  background-color: ${({ theme, isFarming }) => (isFarming ? theme.farmingBg : theme.backgroundCard)};

  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0 0 1rem 0;
  & > div:first-child {
    margin-bottom: 1.5rem;
  }
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
  p {
    font-weight: 500;
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.globalWhite};
    margin: 0 1rem 0 0;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    justify-content: flex-end;
    p {
      flex: 1;
      text-align: left;
    }
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
interface IVolume {
  title: string;
  label: string;
  color?: boolean;
  tooltip: string;
}

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
  } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [inputToken, outputToken] = pool.tokenAccountIds;
  const tokenInput = tokens[inputToken] ?? null;
  const tokenOutput = tokens[outputToken] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const jumboToken = tokens[config.jumboAddress] ?? null;
  const JumboTokenInPool = jumboToken === (tokenInput || tokenOutput);

  const farmId = pool.farm ? pool.farm[0] : ''; // todo: fix it
  const farm = farms[farmId] ?? null; // todo: fix it

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
  const canUnStake = Big(farm?.userStaked || '0').gt('0');

  return (
    <Wrapper isFarming={isFarming}>
      <UpperRow>
        <TokenPairDisplay pool={pool} />
        <LabelPool>
          {JumboTokenInPool && <JumboBlock>Jumbo</JumboBlock>}
          {pool.farm && <FarmBlock>Farm</FarmBlock>}
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
                {canUnStake && (
                <BtnSecondary
                  onClick={() => {
                    navigate(toUnStakeAndClaimPage(pool.id));
                  }}
                >
                  {t('action.unStakeAndClaim')}
                </BtnSecondary>
                )}

                <BtnPrimary
                  onClick={() => {
                    navigate(toStakePage(pool.id));
                  }}
                >
                  <LogoButton /> {t('action.stake')}
                </BtnPrimary>
              </>
            )
            : (
              <>
                {canWithdraw && (
                <BtnSecondary
                  onClick={() => {
                    navigate(toRemoveLiquidityPage(pool.id));
                  }}
                >
                  {t('action.removeLiquidity')}
                </BtnSecondary>
                )}
                <BtnPrimary
                  onClick={() => {
                    navigate(toAddLiquidityPage(pool.id));
                  }}
                >
                  <LogoButton /> {t('action.addLiquidity')}
                </BtnPrimary>
              </>
            )}
        </BlockButton>
      </LowerRow>
    </Wrapper>
  );
}
