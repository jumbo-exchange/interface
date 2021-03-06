import React from 'react';
import styled from 'styled-components';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import Big from 'big.js';
import { getUpperCase } from 'utils';
import { formatBalance, removeTrailingZeros } from 'utils/calculations';
import { useTranslation } from 'react-i18next';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
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

const ButtonMaxWallet = styled.button`
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

const ButtonHalfWallet = styled(ButtonMaxWallet)`
  margin-right: 1rem;
`;

const InputWrapper = styled.div`
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

const SharesContainer = styled.div`
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

export default function InputSharesContainer({
  shares,
  value,
  setValue,
  isShowingButtonHalf,
}:
{
  shares: string,
  value: string,
  setValue: (value: string) => void,
  isShowingButtonHalf?: boolean
}) {
  const { t } = useTranslation();

  const setHalf = () => {
    const halfShares = new Big(shares).div(2);
    if (halfShares.gte(0)) {
      setValue(removeTrailingZeros(halfShares.toFixed()));
    }
  };

  const setMax = () => {
    const maxShares = new Big(shares);
    if (maxShares.gte(0)) {
      setValue(removeTrailingZeros(maxShares.toFixed()));
    }
  };

  return (
    <Block>
      <InputLabel>
        <TotalShares>
          {t('stakeModal.shares')}: &nbsp;
          <span>{removeTrailingZeros(formatBalance(shares))}</span>
        </TotalShares>

        {isShowingButtonHalf && (
        <ButtonHalfWallet onClick={setHalf}>
          <span>{t('common.half')}</span>
        </ButtonHalfWallet>
        )}

        <ButtonMaxWallet onClick={setMax}>
          <span>{t('common.max')}</span>
        </ButtonMaxWallet>

      </InputLabel>
      <InputWrapper>
        <CurrencyInputPanel
          value={value}
          setValue={setValue}
        />
        <SharesContainer>
          {getUpperCase(t('stakeModal.shares'))}
        </SharesContainer>
      </InputWrapper>
    </Block>
  );
}
