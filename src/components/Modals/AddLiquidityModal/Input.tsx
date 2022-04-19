import React from 'react';
import styled from 'styled-components';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import Big from 'big.js';
import FungibleTokenContract from 'services/contracts/FungibleToken';

import { ReactComponent as WalletImage } from 'assets/images-app/wallet.svg';
import { getUpperCase } from 'utils';
import { formatTokenAmount } from 'utils/calculations';
import { useTranslation } from 'react-i18next';

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
    font-size: 1rem;
    line-height: 1.313rem;
    color: ${({ theme }) => theme.globalGrey};
  }
  :hover {
    cursor: pointer;
    & > span {
      color: ${({ theme }) => theme.globalWhite};
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    & > span {
      font-size: 1.125rem;
    }
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > span {
      font-size: .75rem;
      line-height: .875rem;
    }
  `}
`;

const ButtonMaxWallet = styled(ButtonHalfWallet)`
  margin-left: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: .75rem 1.375rem .75rem .75rem;
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  border-radius: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: .625rem 1rem .625rem .625rem;
  }
  `}
  :focus-within {
    border: 2px solid ${({ theme }) => theme.pink};
    padding: .688rem 1.313rem .688rem .688rem;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: .563rem .938rem .563rem .563rem;
    }
  `}
  }
`;

const LogoContainer = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 12px;
  transition: all 1s ease-out;
  height: 2.375rem;
  min-width: 2.375rem;
  & > img {
    border-radius: 12px;
    height: 2.25rem;
    width: 2.25rem;
    transition: all 1s ease-out;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: .75rem;
    border-radius: 8px;
    height: 1.625rem;
    min-width: 1.625rem;
    & > img {
      border-radius: 8px;
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
  const newBalance = formatTokenAmount(currentBalance.toFixed() ?? 0, token?.metadata.decimals);
  if (newBalance !== '0') {
    return new Big(newBalance).toFixed(3);
  }
  return 0;
};

export default function Input({
  token,
  value,
  setValue,
  balance,
}:
{
  token: FungibleTokenContract | null,
  value: string,
  setValue: (value: string)=> void,
  balance: string,
}) {
  const { t } = useTranslation();

  const currentBalance = new Big(balance ?? 0);
  const setHalfAmount = () => {
    if (!balance) return;
    const newBalance = currentBalance.div(2).toFixed();
    setValue(formatTokenAmount(newBalance, token?.metadata.decimals));
  };

  const setMaxAmount = () => {
    if (!balance) return;
    const newBalance = formatTokenAmount(
      currentBalance.toFixed() ?? 0, token?.metadata.decimals,
    );
    setValue(newBalance);
  };

  return (
    <Block>
      <InputLabel>
        <WalletInformation>
          <LogoWallet />
          {getCurrentBalance(currentBalance, token)}
        </WalletInformation>
        <ButtonHalfWallet onClick={setHalfAmount}>
          <span>{t('common.half')}</span>
        </ButtonHalfWallet>
        <ButtonMaxWallet onClick={setMaxAmount}>
          <span>{t('common.max')}</span>
        </ButtonMaxWallet>
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
