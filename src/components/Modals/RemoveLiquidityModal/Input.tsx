import React from 'react';
import styled from 'styled-components';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { getUpperCase } from 'utils';
import { formatBalance } from 'utils/calculations';

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 .875rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 .5rem 1rem;
  `}
`;

const TotalShares = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalGrey};
  & > span {
    color: ${({ theme }) => theme.globalWhite};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: .75rem;
    line-height: .875rem;
  `}
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
    font-size: 1.125rem;
    line-height: 1.313rem;
    color: ${({ theme }) => theme.globalGrey};
  }
  :hover {
    cursor: pointer;
    & > span {
      color: ${({ theme }) => theme.globalWhite};
    }
  }
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

export default function Input({
  shares,
  withdrawValue,
  setWithdrawValue,
}:
{
  shares: string,
  withdrawValue: string,
  setWithdrawValue: React.Dispatch<React.SetStateAction<string>>,
}) {
  return (
    <Block>
      <InputLabel>
        <TotalShares>
          Shares: &nbsp;
          <span>{formatBalance(shares)}</span>
        </TotalShares>

        <ButtonHalfWallet onClick={() => console.log('HALF')}>
          <span>HALF</span>
        </ButtonHalfWallet>
        <ButtonMaxWallet onClick={() => console.log('HALF')}>
          <span>MAX</span>
        </ButtonMaxWallet>

      </InputLabel>
      <InputContainer>
        <CurrencyInputPanel
          value={withdrawValue}
          setValue={setWithdrawValue}
        />
        <TokenContainer>
          {getUpperCase('SHARES')}
        </TokenContainer>
      </InputContainer>
    </Block>
  );
}
