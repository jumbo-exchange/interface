import React from 'react';
import styled from 'styled-components';
import { FilterButton } from 'components/Button';
import { ReactComponent as SearchIcon } from 'assets/images-app/search-icon.svg';
import { ReactComponent as InfoIcon } from 'assets/images-app/info.svg';
import { ReactComponent as ArrowDownIcon } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as PlaceHolderLoader } from 'assets/images-app/placeholder-loader.svg';
import { isMobile } from 'utils/userAgent';
import Tooltip from 'components/Tooltip';

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
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: .625rem;
  `}
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
  margin: .813rem 0;
`;

const MobileColumn = styled.div`
  display: flex;
  flex-direction: column;
  & > div:first-child {
    margin-bottom: .625rem;
  }
`;
const RightPosition = styled(Title)`
  justify-content: flex-end;
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
          <Title>
            Smart Pools
            <Toggle>
              <LabelCheckbox htmlFor="toggle">
                <input id="toggle" type="checkbox" defaultChecked />
                <ToggleSwitch />
              </LabelCheckbox>
            </Toggle>
          </Title>
        </MobileRow>
        <MobileRow>
          <MobileColumn>
            <Title>Sort by</Title>
            <SortBlock>
              Liquidity (dsc)
              <ArrowDown />
            </SortBlock>
          </MobileColumn>
          <MobileColumn>
            <RightPosition>APR Basis <LogoInfo /></RightPosition>
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
          </MobileColumn>
        </MobileRow>
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
      <Wrapper>
        <Title>Smart Pools <Tooltip title="Smart Pools" /></Title>
        <Toggle>
          <LabelCheckbox htmlFor="toggle">
            <input id="toggle" type="checkbox" defaultChecked />
            <ToggleSwitch />
          </LabelCheckbox>
        </Toggle>
      </Wrapper>
      <Title><Loading />Refresh</Title>
    </Container>
  );
}
