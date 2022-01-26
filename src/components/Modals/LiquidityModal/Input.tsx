import React from 'react';
import styled from 'styled-components';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import Big from 'big.js';

import { ReactComponent as WalletImage } from 'assets/images-app/wallet.svg';
import { formatAmount, getUpperCase } from 'utils';
import { TokenType } from 'store';
import FungibleTokenContract from 'services/FungibleToken';

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 .875rem 1rem;
`;

const WalletInformation = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.188rem;
`;

const LogoWallet = styled(WalletImage)`
  margin-right: 0.438rem;
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
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
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
  }
  `}
  :focus-within {
    border: 2px solid ${({ theme }) => theme.pink};
    padding: 11px 21px 11px 11px;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 9px 15px 9px 9px;
    }
  `}
  }
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
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: .6rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.125rem;
  `}
`;

const getCurrentBalance = (
  currentBalance: Big,
  token: FungibleTokenContract | null,
) => {
  const newBalance = formatAmount(currentBalance.toFixed() ?? 0, token?.metadata.decimals);
  if (newBalance !== '0') {
    return new Big(newBalance).toFixed(3);
  }
  return 0;
};

export default function Input({
  token,
  tokenType,
  value,
  setValue,
  balance,
}:
{
  token: FungibleTokenContract | null,
  tokenType: TokenType,
  value: string,
  setValue: any,
  balance:string,
}) {
  const currentBalance = new Big(balance ?? 0);
  const setHalfAmount = () => {
    if (!balance) return;
    const newBalance = currentBalance.div(2);
    setValue(formatAmount(newBalance.toFixed(), token?.metadata.decimals));
  };

  const setMaxAmount = () => {
    if (!balance) return;
    const newBalance = formatAmount(currentBalance.toFixed() ?? 0, token?.metadata.decimals);
    setValue(newBalance);
  };

  return (
    <Block>
      <InputLabel>
        <WalletInformation>
          <LogoWallet />
          {getCurrentBalance(currentBalance, token)}
        </WalletInformation>
        {(tokenType === TokenType.Input) && (
          <>
            <ButtonHalfWallet onClick={setHalfAmount}>
              <span>HALF</span>
            </ButtonHalfWallet>
            <ButtonMaxWallet onClick={setMaxAmount}>
              <span>MAX</span>
            </ButtonMaxWallet>
          </>
        )}

      </InputLabel>
      <InputContainer>
        <LogoContainer>
          <img src={token?.metadata?.icon ?? tokenLogo} alt={token?.metadata.symbol} />
        </LogoContainer>
        <CurrencyInputPanel
          value={value}
          setValue={setValue}
        />
        <TokenContainer>
          {getUpperCase(token?.metadata.symbol ?? '')}
        </TokenContainer>
      </InputContainer>
    </Block>
  );
}
