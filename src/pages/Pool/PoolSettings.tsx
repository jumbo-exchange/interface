import React, { useState } from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import Refresh from 'components/Refresh';
import { ButtonSecondary, FilterButton } from 'components/Button';
import { ReactComponent as SearchIcon } from 'assets/images-app/search-icon.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as Plus } from 'assets/images-app/plus.svg';
import { isMobile } from 'utils/userAgent';
import { IPool, useModalsStore, useStore } from 'store';
import { tooltipTitle } from 'utils/constants';
import { toArray } from 'utils';
import { FilterPoolsEnum } from '.';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1.5rem 0;
`;

const SearchInputBlock = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 9px 9px;
  max-width: 180px;
  & > svg {
    margin-right: .75rem;
    align-self: center;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 220px;
  `}
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalWhite};
  transition: all 1s ease;
  ::placeholder {
    color: ${({ theme }) => theme.globalGreyOp04};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  & > div:last-child {
    margin: .25rem 0 .25rem;
  }
`;

const APRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  & > div:last-child {
    margin: .5rem 0 .25rem;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 100%;
    & > div {
      justify-content: flex-end;
    }
  `}
`;

const Title = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 500;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
`;

const FilterBlock = styled.div`
  display: flex;
  & > button:nth-child(2) {
    margin: 0 1rem;
  }
`;

const SortBlock = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGreyOp02};
  user-select: none;
  & > svg {
    path { 
      fill: ${({ theme }) => theme.globalGreyOp02};
    }
  }
`;

const ArrowDown = styled(ArrowDownIcon)`
  width: 9.5px;
  height: 5.5px;
  margin-left: .453rem;
`;

const LogoPlus = styled(Plus)`
  margin-right: .625rem;
  width: 12px;
  height: 12px;
  path {
    fill: ${({ theme }) => theme.globalWhite};;
  }
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 1rem 0;
  padding: 0 .5rem;
`;

const MobileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

const RefreshBlock = styled.div`
  margin-left: 1.5rem;
`;

enum APRFiletEnum {
  '24H',
  '7D',
  '30D',
}

interface IAPRFilters {
  title: string
  isActive: APRFiletEnum,
  disabled?: boolean,
}

const aprFilters: IAPRFilters[] = [
  {
    title: '24H',
    isActive: APRFiletEnum['24H'],
  },
  {
    title: '7D',
    isActive: APRFiletEnum['7D'],
    disabled: true,
  },
  {
    title: '30D',
    isActive: APRFiletEnum['30D'],
    disabled: true,
  },
];

export default function PoolSettings({
  setPoolsArray,
  currentFilterPools,
}:{
  setPoolsArray: any,
  currentFilterPools: FilterPoolsEnum
}) {
  const { setCreatePoolModalOpen } = useModalsStore();
  const { pools, getToken } = useStore();
  const [currentAPRFilter, setCurrentAPRFilter] = useState(APRFiletEnum['24H']);
  const [searchValue, setSearchValue] = useState<string>('');

  const onChange = (value: string) => {
    const newValue = value.trim().toUpperCase();
    setSearchValue(newValue);
    const newPools = newValue !== ''
      ? Object.values(pools)
        .filter((el) => el.tokenAccountIds
          .filter((item) => getToken(item)?.metadata.symbol.includes(newValue)).length > 0)
      : toArray(pools);
    setPoolsArray(newPools);
  };

  if (isMobile) {
    return (
      <MobileContainer>
        <MobileRow>
          <SearchInputBlock>
            <SearchIcon />
            <SearchInput
              value={searchValue}
              onChange={(value) => onChange(value.target.value)}
              placeholder="Search"
            />
          </SearchInputBlock>
          <RefreshBlock>
            <Refresh />
          </RefreshBlock>
        </MobileRow>
        <MobileRow>
          {currentFilterPools === FilterPoolsEnum['All Pools']
          && (
          <Wrapper>
            <Title>Sort by</Title>
            <SortBlock>
              Liquidity (dsc)
              <ArrowDown />
            </SortBlock>
          </Wrapper>
          )}
          <APRWrapper>
            <Title>APR Basis <Tooltip title={tooltipTitle.APRBasis} /></Title>
            <FilterBlock>
              {aprFilters.map((el) => (
                <FilterButton
                  key={el.title}
                  isActive={currentAPRFilter === el.isActive}
                  onClick={() => setCurrentAPRFilter(el.isActive)}
                  disabled={el.disabled}
                >
                  {el.title}
                </FilterButton>
              ))}
            </FilterBlock>
          </APRWrapper>
        </MobileRow>
        <ButtonSecondary
          onClick={() => setCreatePoolModalOpen(true)}
        >
          <LogoPlus /> Create Pool
        </ButtonSecondary>
      </MobileContainer>
    );
  }

  return (
    <Container>
      <SearchInputBlock>
        <SearchIcon />
        <SearchInput
          value={searchValue}
          onChange={(value) => onChange(value.target.value)}
          placeholder="Search"
        />
      </SearchInputBlock>
      <Wrapper>
        <Title>Sort by</Title>
        <SortBlock>
          Liquidity (dsc)
          <ArrowDown />
        </SortBlock>
      </Wrapper>
      <APRWrapper>
        <Title>APR Basis <Tooltip title="APR Basis" /></Title>
        <FilterBlock>
          {aprFilters.map((el) => (
            <FilterButton
              key={el.title}
              isActive={currentAPRFilter === el.isActive}
              onClick={() => setCurrentAPRFilter(el.isActive)}
              disabled={el.disabled}
            >
              {el.title}
            </FilterButton>
          ))}
        </FilterBlock>
      </APRWrapper>
      <Title><Refresh /></Title>
      <ButtonSecondary
        onClick={() => setCreatePoolModalOpen(true)}
      >
        <LogoPlus /> Create Pool
      </ButtonSecondary>
    </Container>
  );
}
