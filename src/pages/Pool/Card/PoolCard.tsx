import React from 'react';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { IPool, useStore } from 'store';
import { useNavigate } from 'react-router-dom';
import { toAddLiquidityPage, toRemoveLiquidityPage } from 'utils/routes';
import { useTranslation } from 'react-i18next';
import getConfig from 'services/config';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import { PoolOrFarmButtons } from 'components/Button/RenderButton';
import {
  Wrapper,
  UpperRow,
  LabelPool,
  JumboBlock,
  FarmBlock,
  LowerRow,
  BlockVolume,
  Column,
  TitleVolume,
  LabelVolume,
  BlockButton,
} from './styles';

const config = getConfig();

interface IVolume {
  title: string;
  label: string;
  color?: boolean;
  tooltip: string;
}

export default function PoolCard({ pool } : { pool: IPool }) {
  const { tokens } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [inputToken, outputToken] = pool.tokenAccountIds;
  const tokenInput = tokens[inputToken] ?? null;
  const tokenOutput = tokens[outputToken] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const jumboToken = tokens[config.jumboAddress] ?? null;
  const JumboTokenInPool = jumboToken === (tokenInput || tokenOutput);

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

  return (
    <Wrapper>
      <UpperRow>
        <TokenPairDisplay pool={pool} />
        <LabelPool>
          <>
            {JumboTokenInPool && <JumboBlock>Jumbo</JumboBlock>}
            {pool.farms && <FarmBlock>Farm</FarmBlock>}
          </>
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
          <PoolOrFarmButtons
            toPageAdd={toAddLiquidityPage(pool.id)}
            titleAdd={t('action.addLiquidity')}
            toPageRemove={toRemoveLiquidityPage(pool.id)}
            titleRemove={t('action.removeLiquidity')}
            showButton={canWithdraw}
            navigate={navigate}
          />
        </BlockButton>
      </LowerRow>
    </Wrapper>
  );
}
