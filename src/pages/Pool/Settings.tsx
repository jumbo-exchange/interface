import React from 'react';
import styled from 'styled-components';
import { FilterButton } from 'components/Button';
import { ReactComponent as SearchIcon } from 'assets/images-app/search-icon.svg';
import { ReactComponent as InfoIcon } from 'assets/images-app/info.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as PlaceHolderLoader } from 'assets/images-app/placeholder-loader.svg';

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
  }
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  font-style: normal;
  font-weight: normal;
  width: 100%;
  font-size: .75rem;
  line-height: .875rem;
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

const LogoInfo = styled(InfoIcon)`
  margin-left: .397rem;
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

const Toggle = styled.div`
  cursor: pointer;
  display: inline-block;
`;

const LabelCheckbox = styled.label`
  cursor: pointer;
  display: inline-block;
`;

const ToggleCheckbox = styled.input`
  position: absolute;
  visibility: hidden;
  :checked{
    background: $green;
    ::before {
      left: 30px;
    }
  }
`;

const ToggleSwitch = styled.div`
  display: inline-block;
  background: #ccc;
  border-radius: 16px;
  width: 58px;
  height: 32px;
  position: relative;
  vertical-align: middle;
  transition: background 0.25s;
  ::before {
    content: '';
    display: block;
    background: linear-gradient(to bottom, #fff 0%,#eee 100%);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.25);
    width: 24px;
    height: 24px;
    position: absolute;
    top: 4px;
    left: 4px;
    transition: left 0.25s;
  }
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

export default function Settings() {
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
        <Title>APR Basis <LogoInfo /></Title>
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
      <Wrapper>
        <Title>Smart Pools <LogoInfo /></Title>
        <Toggle>
          <LabelCheckbox htmlFor="toggle">
            <ToggleCheckbox id="toggle" type="checkbox" />
            <ToggleSwitch />
          </LabelCheckbox>
        </Toggle>
      </Wrapper>
      <Title><Loading />Refresh</Title>
    </Container>
  );
}
