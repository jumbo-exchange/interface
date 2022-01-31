import React from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import { ButtonSecondary, FilterButton } from 'components/Button';
import { ReactComponent as SearchIcon } from 'assets/images-app/search-icon.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as Plus } from 'assets/images-app/plus.svg';
import { ReactComponent as PlaceHolderLoader } from 'assets/images-app/placeholder-loader.svg';
import { isMobile } from 'utils/userAgent';
import { useModalsStore } from 'store';

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
  padding: 13px 11px;
  & > svg {
    margin-right: .75rem;
    align-self: center;
  }
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
    margin-bottom: .25rem;
  }
`;

const Title = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
`;

const FilterBlock = styled.div`
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
  color: ${({ theme }) => theme.globalWhite};
  :hover {
    cursor: pointer;
  }
`;

const ArrowDown = styled(ArrowDownIcon)`
  width: 9.5px;
  height: 5.5px;
  margin-left: .453rem;
`;

const Loading = styled(PlaceHolderLoader)`
  width: 14px;
  height: 14px;
  margin-right: .5rem;
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

const filters = [
  {
    title: '24H',
    isActive: false,
  },
  {
    title: '7D',
    isActive: false,
  },
  {
    title: '30D',
    isActive: true,
  },
];

export default function PoolSettings() {
  const { setCreatePollModalOpen } = useModalsStore();

  if (isMobile) {
    return (
      <MobileContainer>
        <SearchInputBlock>
          <SearchIcon />
          <SearchInput
            placeholder="Search"
          />
        </SearchInputBlock>
        <MobileRow>
          <Title><Loading />Refresh</Title>
          <Wrapper>
            <Title>APR Basis <Tooltip title="APR Basis" /></Title>
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
          </Wrapper>
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
      <Wrapper>
        <Title>APR Basis <Tooltip title="APR Basis" /></Title>
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
      </Wrapper>
      <Title><Loading />Refresh</Title>
      <ButtonSecondary
        onClick={() => setCreatePoolModalOpen(true)}
      >
        <LogoPlus /> Create Pool
      </ButtonSecondary>
    </Container>
  );
}
