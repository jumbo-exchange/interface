import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { FarmStatusEnum } from 'components/FarmStatus';

export const Wrapper = styled(SpecialContainer)<{isFarming?: boolean}>`
  background-color: ${({ theme, isFarming }) => (isFarming ? theme.farmingBg : theme.backgroundCard)};

  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0 0 1rem 0;
  padding-top: 1.125rem;
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

export const FarmBlock = styled.div<{type: FarmStatusEnum}>`
  background-color: ${({ theme }) => theme.statusFarmInPoolBg};
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  padding: .5rem;
  border-radius: 12px;
  user-select: none;
  color: ${({ theme, type }) => {
    if (type === FarmStatusEnum.Active) return theme.statusActive;
    if (type === FarmStatusEnum.Pending) return theme.statusPending;
    return theme.statusEnded;
  }};
  :hover {
    cursor: pointer;
  }
`;

export const LogoArrowContainer = styled.div<{type: FarmStatusEnum}>`
  display: flex;
  background-color: ${({ theme, type }) => {
    if (type === FarmStatusEnum.Active) return theme.statusActiveOp01;
    if (type === FarmStatusEnum.Pending) return theme.statusPendingOp01;
    return theme.statusEnded;
  }};
  border-radius: 8px;
  padding: .438rem .313rem;
  margin-left: .5rem;
  svg {
    path {
      fill: ${({ theme, type }) => {
    if (type === FarmStatusEnum.Active) return theme.statusActive;
    if (type === FarmStatusEnum.Pending) return theme.statusPending;
    return theme.statusEnded;
  }};
    }
  }
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
  white-space: nowrap;
`;

export const BlockButton = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  & > button {
    padding: .563rem .938rem;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column-reverse;
  `}
`;

export const TitlePool = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: .5rem;
  `}
`;

export const FarmsStatus = styled.div<{type: FarmStatusEnum}>`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  border: 1px solid ${({ theme, type }) => {
    if (type === FarmStatusEnum.Active) return theme.statusActive;
    if (type === FarmStatusEnum.Pending) return theme.statusPending;
    return theme.statusEnded;
  }};
  
  box-sizing: border-box;
  border-radius: 4px;
  color: ${({ theme, type }) => {
    if (type === FarmStatusEnum.Active) return theme.statusActive;
    if (type === FarmStatusEnum.Pending) return theme.statusPending;
    return theme.statusEnded;
  }};

  user-select: none;
  font-style: normal;
  font-weight: 400;
  font-size: .75rem;
  line-height: .875rem;
  max-height: 22px;
  padding: 4px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    align-self: center;
  `}
`;

export const FarmWrapper = styled(SpecialContainer)<{isShowingTime?: boolean}>`
  background-color: ${({ theme }) => theme.farmingTimeBg};
  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  margin: 0 0 1rem 0;
  padding: 0;
  min-height: ${({ isShowingTime }) => (isShowingTime ? '160px' : '190px')};
  ::before{
    border-radius: 24px;
  }
`;

export const FarmContainer = styled.div`
  background-color: ${({ theme }) => theme.farmingBg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
  padding: 1.125rem 1.5rem 1.5rem;
  border-radius: 24px;

  & > div:first-child {
      min-height: 40px;
    }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      & > div:first-child {
      margin-bottom: 1.563rem;
    }
  `}
`;

export const FarmTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  background-color: ${({ theme }) => theme.farmingTimeBg};
  border-radius: 0 0 24px 24px;
  & > p {
    margin: 0;
    font-style: normal;
    font-weight: 300;
    font-size: .75rem;
    line-height: .875rem;
  }
`;
