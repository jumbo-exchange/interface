import React from 'react';
import SpecialContainer from 'components/SpecialContainer';
import { FilterButton } from 'components/Button';
import {
  Container,
  FilterBlock,
  InformationBlock,
  InfoBLock,
  TitleInfo,
  LabelInfo,
  ResultBlock,
} from './styles';
import Settings from './Settings';

const filters = [
  {
    title: 'All Pools',
    isActive: true,
  },
  {
    title: 'Your Liquidity',
    isActive: false,
  },
  {
    title: 'LP Farming',
    isActive: false,
  },
  {
    title: 'Deprecated',
    isActive: false,
  },
];

const mainInfo = [
  {
    title: 'Total Value Locked',
    label: '$935,059,293',
  },
  {
    title: 'Total 24h Volume',
    label: '$88,890,241',
  },
  {
    title: 'ORCA Price',
    label: '$9.26',
  },
  {
    title: 'Weekly Emissions',
    label: '300k NEAR',
  },
];

export default function Pool() {
  return (
    <Container>
      <FilterBlock>
        {filters.map((el) => (
          <FilterButton
            key={el.title}
            isActive={el.isActive}
          >
            {el.title}
          </FilterButton>
        ))}
      </FilterBlock>
      <InformationBlock>
        <SpecialContainer>
          {mainInfo.map((el) => (
            <InfoBLock
              key={el.title}
            >
              <TitleInfo>
                {el.title}
              </TitleInfo>
              <LabelInfo>
                {el.label}
              </LabelInfo>
            </InfoBLock>
          ))}
        </SpecialContainer>
      </InformationBlock>
      <Settings />
      <ResultBlock />
    </Container>
  );
}
