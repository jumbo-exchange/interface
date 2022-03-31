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

const Container = styled.div<{isAllPools: boolean}>`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1.5rem 0;
  justify-content: ${({ isAllPools }) => (isAllPools ? 'space-between' : 'flex-start')};
  & > div:not(:first-child), & > button {
    margin-left: ${({ isAllPools }) => (isAllPools ? ' 0' : '1.5rem')};
  }
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

const NoWrapTitle = styled(Title)`
  white-space: nowrap;
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

const WrapperRow = styled.div`
  display: flex;
  align-self: center;
`;

const Toggle = styled.div`
  display: flex;
  margin-left: .5rem;
`;

const LabelCheckbox = styled.label`
  cursor: pointer;
  display: flex;
  & > input {
    position: absolute;
    visibility: hidden;
  }
`;

const ToggleSwitch = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.globalGrey};
  width: 32px;
  height: 16px;
  position: relative;
  border-radius: 8px;
  transition: background 0.25s;
  &:before {
    content: "";
    display: block;
    background: ${({ theme }) => theme.globalWhite};
    border-radius: 50%;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 2px;
    left: 3px;
    transition: left 0.25s;
  }
  #toggle:checked + & {
    background: ${({ theme }) => theme.globalGreen0p02};
    &:before {
      background: ${({ theme }) => theme.globalGreen};
      left: 18px;
    }
  }
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
  setIsShowingEndedOnly,
}:{
  setPoolsArray: Dispatch<SetStateAction<IPool[]>>,
  currentFilterPools: FilterPoolsEnum,
  setIsShowingEndedOnly: Dispatch<SetStateAction<boolean>>,
}) {
  const { setCreatePoolModalOpen } = useModalsStore();
  const { pools, tokens } = useStore();
  const { t } = useTranslation();

  const [currentAPRFilter, setCurrentAPRFilter] = useState(APRFiletEnum['24H']);
  const [searchValue, setSearchValue] = useState<string>('');

  const isAllPools = currentFilterPools === FilterPoolsEnum['All Pools'];
  const isFarming = currentFilterPools === FilterPoolsEnum.Farming;

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
          {isAllPools
          && (
          <Wrapper>
            <Title>{t('pool.sortBy')}</Title>
            <SortBlock>
              Liquidity (dsc)
              <ArrowDown />
            </SortBlock>
          </Wrapper>
          )}
          {isFarming && (
          <WrapperRow>
            <NoWrapTitle>{t('pool.endedOnly')}</NoWrapTitle>
            <Toggle>
              <LabelCheckbox htmlFor="toggle">
                <input
                  id="toggle"
                  type="checkbox"
                  onChange={(e) => setIsShowingEndedOnly(e.target.checked)}
                />
                <ToggleSwitch />
              </LabelCheckbox>
            </Toggle>
          </WrapperRow>
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
        {!isFarming && (
        <ButtonSecondary
          onClick={() => setCreatePoolModalOpen(true)}
        >
          <LogoPlus /> {t('action.createPool')}
        </ButtonSecondary>
        )}
      </MobileContainer>
    );
  }

  return (
    <Container isAllPools={isAllPools}>
      <SearchInputBlock>
        <SearchIcon />
        <SearchInput
          value={searchValue}
          onChange={(value) => onChange(value.target.value)}
          placeholder={t('pool.search')}
        />
      </SearchInputBlock>
      {isAllPools && (
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
      <Title><Refresh /></Title>
      { isFarming
        ? (
          <WrapperRow>
            <Title>{t('pool.endedOnly')}</Title>
            <Toggle>
              <LabelCheckbox htmlFor="toggle">
                <input
                  id="toggle"
                  type="checkbox"
                  onChange={(e) => setIsShowingEndedOnly(e.target.checked)}
                />
                <ToggleSwitch />
              </LabelCheckbox>
            </Toggle>
          </WrapperRow>
        )
        : (
          <ButtonSecondary
            onClick={() => setCreatePoolModalOpen(true)}
          >
            <LogoPlus /> {t('action.createPool')}
          </ButtonSecondary>
        )}
    </Container>
  );
}
