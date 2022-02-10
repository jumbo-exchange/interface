import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';

import { ReactComponent as WalletImage } from 'assets/images-app/wallet.svg';
import { ReactComponent as IconArrowDown } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as Exchange } from 'assets/images-app/exchange.svg';
import { ReactComponent as PlaceHolderLoader } from 'assets/images-app/placeholder-loader.svg';
import { ReactComponent as Info } from 'assets/images-app/info.svg';
import { ReactComponent as RouteArrow } from 'assets/images-app/route-arrow.svg';
import { ReactComponent as SwapIcon } from 'assets/images-app/swap-icon.svg';

interface ICurrent {
  isActive?: boolean
}

interface IColor {
  isColor?: boolean
}

export const Container = styled(SpecialContainer)`
  max-width: 500px;
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ArrowDown = styled(IconArrowDown)`
  margin-left: 0.875rem;
`;

export const ChangeTokenContainer = styled.div`
  display: flex;
  align-self: center;
  color: ${({ theme }) => theme.globalGrey};
  margin: 1.125rem 0;
  & > span {
    font-style: normal;
    font-weight: 500;
    font-size: .75rem;
    line-height: .875rem;
  }
  :hover {
    & > svg {
      path {
        fill: ${({ theme }) => theme.globalWhite};
      }
    }
    cursor: pointer;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

export const ChangeTokenLogo = styled(Exchange)`
  margin-right: .5rem;
`;

export const ExchangeBlock = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.125rem .75rem 1.375rem .75rem;
  font-style: normal;
  font-weight: normal;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
`;

export const RefreshBlock = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  margin-right: 1.25rem;
  :hover {
    cursor: pointer;
  }
`;

export const PlaceHolderGif = styled(PlaceHolderLoader)`
  margin-right: .438rem;
`;

export const ExchangeLabel = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
`;

export const SettingsBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-right: .453rem;
::before {
    content: '';
    background: ${({ theme }) => theme.globalGreyOp02};
    height: 1px;
    width: 100%;
  }
`;

export const SettingsLabel = styled.div<PropsWithChildren<ICurrent>>`
  display: flex;
  align-items: center;
  & > span {
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme, isActive }) => (isActive ? theme.globalWhite : theme.globalGrey)};
    margin-left: 1rem;
  }
  & > svg {
    width: .594rem;
    height: .344rem;
    margin-left: .453rem;
    transform: ${({ isActive }) => (isActive && 'rotate(0.5turn)')};
    transition: all 0.3s ease-out;
    path {
      fill: ${({ theme, isActive }) => (isActive ? theme.globalWhite : theme.globalGrey)};
    }
  }
  :hover {
    cursor: pointer;
    & > span {
    color: ${({ theme }) => theme.globalWhite};
  }
    & > svg {
      path {
        fill: ${({ theme }) => theme.globalWhite};
      }
    }
  }
`;

export const Wallet = styled(WalletImage)`
  margin-right: .625rem;
  width: 16px;
  height: 12px;
  path {
    fill: ${({ theme }) => theme.globalWhite};
  }
`;

export const SwapInformation = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const LogoInfo = styled(Info)`
  margin-left: .397rem;
`;

export const RouteBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  & > div {
    margin-top: 1rem;
    display: flex;
    align-items: center;
  }
`;

export const RowInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const TitleInfo = styled.p`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin: 0;
`;

export const LabelInfo = styled.p<PropsWithChildren<IColor>>`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme, isColor = false }) => (isColor ? theme.globalGreen : theme.globalWhite)};
  margin: 0;
`;

export const TokenImg = styled.img`
  margin-right: .5rem;
  width: 24px;
  height: 24px;
`;

export const RouteArrowLogo = styled(RouteArrow)`
  margin: 0 1rem;
`;

export const BlockButton = styled.div`
  z-index: 4;
  background-color: ${({ theme }) => theme.backgroundCard};
  padding-top: 1.625rem;
  & > button {
    width: 100%;
  }
`;

export const IconSwap = styled(SwapIcon)`
  margin-left: .75rem;
`;
