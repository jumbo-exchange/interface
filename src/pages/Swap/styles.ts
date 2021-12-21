import styled from 'styled-components';

import { isMobile } from 'utils/userAgent';
import { ReactComponent as WalletImage } from 'assets/images/wallet.svg';
import { ReactComponent as IconArrowDown } from 'assets/images/icon-arrow-down.svg';
import { ReactComponent as Exchange } from 'assets/images/exchange.svg';

export const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.backgroundCard};
  max-width: 500px;
  min-width: 328px;
  height: 400px;
  display: flex;

  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.white};
  box-shadow: 0px 32px 72px -12px ${({ theme }) => theme.boxShadowCard};
  border-radius: 36px;
  /* border  need fix */
  padding: 24px;
`;

export const ActionContainer = styled.div`
  background: ${({ theme }) => theme.BgCardGrey};
  border-radius: ${isMobile ? '2px' : '8px'};
  display: flex;
  flex-direction: column;
`;

export const Block = styled.div`
  background: ${({ theme }) => theme.BgCardGrey};
  border-radius: ${isMobile ? '2px' : '8px'};
  display: flex;
  flex-direction: column;
  padding: 10px 0px 0px 0px;
`;

export const WalletInformation = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 27px;
  align-items: flex-end;
  font-style: normal;
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.063rem;
  align-items: center;
`;

export const LogoWallet = styled(WalletImage)`
  margin-right: 0.438rem;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const LogoContainer = styled.div`
  margin-right: 1rem;
  >img{
    height: 3rem;
    width: 3rem;
  }
`;

export const TokenContainer = styled.div`
  flex: 1;

`;

export const TokenTitle = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 2rem;
  line-height: 2rem;
  text-align: right;
  display: flex;
  align-items: center;
`;

export const ArrowDown = styled(IconArrowDown)`
  margin-left: 0.875rem;
`;

export const MinterLogo = styled.div`
  margin-right: 4px;
  &>img{
    max-height: 1.5rem;
    max-width: 1.5rem;
  }
`;

export const MinterName = styled.div`
  margin-top: .75rem;
  font-style: normal;
  font-weight: normal;
  font-size: .75rem;
  line-height: .75rem;
  display: flex;
  align-items: center;
`;

export const ExchangeContainer = styled.div`
  align-self: center;
`;

export const ExchangeLogo = styled(Exchange)`
  cursor: pointer;
`;

export const ExchangeLabel = styled.div`
  display: flex;
  justify-content: center;
  font-style: normal;
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.063rem;
  text-align: center;
  color: ${({ theme }) => theme.globalBLack};
  margin: 24px 0;
  white-space: nowrap;
  & > div:first-child {
    flex: 1 1 0;
    display: flex;
    justify-content: flex-end;
    overflow: hidden;
  }
  & > div:nth-child(2) { 
    flex: 0 1 0;
    padding: 0 10px;
  }

  & > div:last-child { 
    flex: 1 1 0;
    display: flex;
    justify-content: flex-start;
    overflow: hidden;
  }
`;

export const TokenWrapper = styled.div`
  display:flex;
  flex-direction: row;
  cursor: pointer;
`;

export const Wallet = styled(LogoWallet)`
  margin-right: 0.625rem;
  path {
    fill: ${({ theme }) => theme.globalWhite};
  }
`;
