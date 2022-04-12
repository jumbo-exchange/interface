import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import Refresh from 'components/Refresh';
import { ButtonSecondary, FilterButton } from 'components/Button';
import { ReactComponent as SearchIcon } from 'assets/images-app/search-icon.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as Plus } from 'assets/images-app/plus.svg';
import { isMobile } from 'utils/userAgent';
import { IPool, useModalsStore, useStore } from 'store';
import { toArray } from 'utils';
import { useTranslation } from 'react-i18next';
import { getToken } from 'store/helpers';
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

const APYWrapper = styled.div`
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
  white-space: nowrap;
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
  searchValue,
  setSearchValue,
}:{
  setPoolsArray: Dispatch<SetStateAction<IPool[]>>,
  currentFilterPools: FilterPoolsEnum,
  searchValue: string,
  setSearchValue: Dispatch<SetStateAction<string>>,
}) {
  const { setCreatePoolModalOpen } = useModalsStore();
  const { pools, tokens } = useStore();
  const { t } = useTranslation();

  const [currentAPRFilter, setCurrentAPRFilter] = useState(APRFiletEnum['24H']);

  const onChange = (value: string) => {
    const newValue = value.trim().toUpperCase();
    setSearchValue(newValue);
    const newPools = newValue !== ''
      ? Object.values(pools)
        .filter((el) => el.tokenAccountIds
          .some((item) => {
            const formattedValue = newValue.toLowerCase();
            const token = getToken(item, tokens);
            if (!token || !token.metadata) return false;

            return token.metadata.symbol.toLowerCase().includes(formattedValue)
            || token.metadata.name.toLowerCase().includes(formattedValue)
            || item.includes(formattedValue);
          }))
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
              placeholder={t('pool.search')}
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
            <Title>{t('pool.sortBy')}</Title>
            <SortBlock>
              Liquidity (dsc)
              <ArrowDown />
            </SortBlock>
          </Wrapper>
          )}
          <APYWrapper>
            <Title>{t('pool.APYBasis')} <Tooltip title={t('tooltipTitle.APYBasis')} /></Title>
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
          </APYWrapper>
        </MobileRow>
        <ButtonSecondary
          onClick={() => setCreatePoolModalOpen(true)}
        >
          <LogoPlus /> {t('action.createPool')}
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
          placeholder={t('pool.search')}
        />
      </SearchInputBlock>
      <Wrapper>
        <Title>{t('pool.sortBy')}</Title>
        <SortBlock>
          Liquidity (dsc)
          <ArrowDown />
        </SortBlock>
      </Wrapper>
      <APYWrapper>
        <Title>{t('pool.APYBasis')} <Tooltip title={t('tooltipTitle.APYBasis')} /></Title>
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
      </APYWrapper>
      <Title><Refresh /></Title>
      <ButtonSecondary
        onClick={() => setCreatePoolModalOpen(true)}
      >
        <LogoPlus /> {t('action.createPool')}
      </ButtonSecondary>
    </Container>
  );
}
