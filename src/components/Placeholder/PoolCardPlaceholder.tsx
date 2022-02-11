import React from 'react';
import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';

const Wrapper = styled(SpecialContainer)`
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

const BlockTitle = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 1.5rem;
  `}
`;

const LogoPool = styled.div`
  position: relative;
  margin-right: 1.75rem;
  & > div {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.globalGreyOp02};
    width: 32px;
    height: 32px;
  }
  & > div:last-child {
    background-color: ${({ theme }) => theme.globalGreyOp02};
    position: absolute;
    left: 19px;
    top: -5px;
    filter: drop-shadow(0px 4px 8px #202632);
  }
`;

const TitlePool = styled.div`
  width: 76px;
  height: 16px;
  background-color: ${({ theme }) => theme.globalGreyOp02};
  border-radius: 4px;
`;

const LabelPool = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    justify-content: flex-end;
  `}
`;

const JumboBlock = styled.div`
  display: flex;
  margin-left: .5rem;
  padding: 4px;
  background-color: ${({ theme }) => theme.globalGreyOp02};
  border-radius: 4px;
  width: 48px;
  height: 22px;
`;

const MiceBlock = styled(JumboBlock)`
  width: 34px;
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
  background-color: ${({ theme }) => theme.globalGreyOp02};
  border-radius: 12px;
  width: 27px;
  height: 6px;
  margin-bottom: .75rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0;
  `}
`;

const LabelVolume = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.globalGreyOp02};
  border-radius: 12px;
  width: 63px;
  height: 12px;
`;

const Button = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 142px;
  height: 40px;
  background-color: ${({ theme }) => theme.globalGreyOp02};
  border-radius: 12px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`;

export default function PoolCardPlaceholder() {
  const volume = [1, 2, 3];

  return (
    <Wrapper>
      <UpperRow>
        <BlockTitle>
          <LogoPool>
            <div />
            <div />
          </LogoPool>
          <TitlePool />
        </BlockTitle>
        <LabelPool>
          <JumboBlock />
          <MiceBlock />
        </LabelPool>
      </UpperRow>
      <LowerRow>
        <BlockVolume>
          {volume.map((el) => (
            <Column key={el}>
              <TitleVolume />
              <LabelVolume />
            </Column>
          ))}
        </BlockVolume>
        <Button />
      </LowerRow>
    </Wrapper>
  );
}
