import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';

export const Wrapper = styled(SpecialContainer)<{isFarming?: boolean}>`
  background-color: ${({ theme, isFarming }) => (isFarming ? theme.farmingBg : theme.backgroundCard)};

  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0 0 1rem 0;
  padding-top: 18px;
  min-height: 160px;
  & > div:first-child {
    min-height: 40px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      & > div:first-child {
      margin-bottom: 1.563rem;
    }
  `}
  ::before{
    border-radius: 24px;
  }
`;

export const UpperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column-reverse;
    align-items: flex-start;
    
  `}
`;

export const LowerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    align-items: flex-start;
  `}
`;

export const LabelPool = styled.div`
  display: flex;
  align-items: center;
  min-height: 40px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    justify-content: flex-end;
  `}
`;

export const JumboBlock = styled.div`
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

export const FarmBlock = styled(JumboBlock)`
  background-color: ${({ theme }) => theme.farmLabel};
`;

export const BlockVolume = styled.div`
  display: flex;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2.125rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 0 1.125rem;
    flex-direction: row;
    justify-content: space-between;
  `}
`;

export const TitleVolume = styled.div`
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

export const LabelVolume = styled.div<{isColor?: boolean}>`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme, isColor }) => (isColor ? theme.globalGreen : theme.globalWhite)};
`;

export const BlockButton = styled.div`
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
