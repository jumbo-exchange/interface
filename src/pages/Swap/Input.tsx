import React from 'react';
import styled from 'styled-components';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import tokenLogo from 'assets/images-app/ETH.svg';
import { ReactComponent as WalletImage } from 'assets/images-app/wallet.svg';
import { ReactComponent as IconArrowDown } from 'assets/images-app/icon-arrow-down.svg';
import { getUpperCase } from 'utils';

const Block = styled.div`
  display: flex;
  flex-direction: column;

`;

const InputLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 .8rem;
`;

const WalletInformation = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.6rem;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 0.75rem;
  line-height: .875rem;
`;

const LogoWallet = styled(WalletImage)`
  margin-right: 0.438rem;
  width: 16px;
  height: 12px;
`;

const ButtonHalfWallet = styled.button`
  background: none;
  border: none;
  padding: 0;
  & > span {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: right;
    font-style: normal;
    font-weight: normal;
    font-size: 0.75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.globalGrey};
  }
  :hover {
    cursor: pointer;
    & > span {
      color: ${({ theme }) => theme.globalWhite};
    }
  }
`;

const ButtonMaxWallet = styled(ButtonHalfWallet)`
  margin-left: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 22px 12px 12px;
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  border-radius: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 10px 16px 10px 10px;
  `}
`;

const LogoContainer = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  & > img {
    height: 2.25rem;
    width: 2.25rem;
    transition: all 1s ease-out;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: .75rem;
    & > img {
      height: 1.5rem;
      width: 1.5rem;
      transition: all 1s ease-out;
    }
  `}
`;

const TokenContainer = styled.div`
  flex: 1;
  font-style: normal;
  font-weight: normal;
  font-size: 2rem;
  line-height: 2rem;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.125rem;
  `}
  transition: all 1s ease-out;

  :hover {
    cursor: pointer;
  }
`;

const ArrowDown = styled(IconArrowDown)`
  margin-left: 0.875rem;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: .594rem;
    height: .344rem;
  `}
  transition: all 1s ease-out;
`;

export default function Input({
  value,
  setValue,
}:
  {
    value: string,
    setValue: any,
  }) {
  const setHalfAmount = () => {
    console.log('setHalfAmount');
  };

  const setMaxAmount = () => {
    console.log('setMaxAmount');
  };

  return (
    <Block>
      <InputLabel>
        <WalletInformation>
          <LogoWallet />
          1234
        </WalletInformation>
        <ButtonHalfWallet onClick={setHalfAmount}>
          <span>HALF</span>
        </ButtonHalfWallet>
        <ButtonMaxWallet onClick={setMaxAmount}>
          <span>MAX</span>
        </ButtonMaxWallet>
      </InputLabel>
      <InputContainer>
        <LogoContainer>
          <img src={tokenLogo} alt="token" />
        </LogoContainer>
        <CurrencyInputPanel
          value={value}
          setValue={setValue}
        />
        <TokenContainer>
          {getUpperCase('ETH')}
          <ArrowDown />
        </TokenContainer>
      </InputContainer>
    </Block>
  );
}
