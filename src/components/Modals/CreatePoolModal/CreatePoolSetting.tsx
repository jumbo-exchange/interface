import React, { useState } from 'react';
import styled from 'styled-components';
import Big from 'big.js';
import Toggle from 'components/Toggle';
import Tooltip from 'components/Tooltip';
import {
  poolFeeOptions,
  MAX_TOTAL_FEE,
  MIN_TOTAL_FEE,
  COEFFICIENT_TOTAL_FEE,
  tooltipTitle,
} from 'utils/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.25rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin: 1rem 0;
`;

const TotalFeeBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1.25rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const RowTitle = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalGrey};
  margin: 0;
`;

const LabelTitle = styled.p`
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.188rem;
  margin: 0;
`;

const Error = styled.div`
  font-style: normal;
  margin-top: 1rem;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.error};
`;

export default function CreatePoolSettings(
  {
    fee,
    setFee,
  }:{
    fee: string;
    setFee:(fee: string) => void
  },
) {
  const [error, setError] = useState(false);

  const feeList = [
    {
      title: 'LP Fee',
      percent: 80,
      tooltip: tooltipTitle.lPFee,
    },
    {
      title: 'Protocol Fee',
      percent: 16,
      tooltip: tooltipTitle.protocolFee,
    },
    {
      title: 'Referral Fee',
      percent: 4,
      tooltip: tooltipTitle.referralFee,
    },
  ];

  const getCurFee = (percent: number) => {
    let result;
    if (
      !!fee
      && new Big(fee).gt(MIN_TOTAL_FEE)
      && new Big(fee).lt(MAX_TOTAL_FEE)
    ) {
      result = new Big(fee)
        .mul(percent)
        .div('100')
        .toFixed();
    } else {
      result = '-';
    }
    return `${result} %`;
  };

  const onChange = (value:string) => {
    if (!value || Number(value) <= 0) {
      setFee(MIN_TOTAL_FEE.toString());
      setError(true);
      return;
    }
    const bigValue = new Big(value);
    if (!bigValue.gt(MIN_TOTAL_FEE)) {
      setFee(MIN_TOTAL_FEE.toString());
      setError(true);
      return;
    }
    if (!bigValue.lt(MAX_TOTAL_FEE)) {
      setFee(MAX_TOTAL_FEE.toString());
      setError(true);
      return;
    }

    setFee(bigValue.toString());

    setError(false);
  };

  return (
    <Container>
      <Title>Total Fee <Tooltip title={tooltipTitle.totalFee} /> </Title>
      <TotalFeeBlock>
        <Toggle
          value={fee}
          coefficient={COEFFICIENT_TOTAL_FEE}
          options={poolFeeOptions}
          onChange={onChange}
        />
        {error && (
          <Error>
            Your transaction may be frontrun
          </Error>
        )}
      </TotalFeeBlock>
      <Column>
        {feeList.map(({ title, percent, tooltip }) => (
          <Row key={title}>
            <RowTitle>{title} <Tooltip title={tooltip} /> </RowTitle>
            <LabelTitle>{getCurFee(percent)}</LabelTitle>
          </Row>
        ))}
      </Column>
    </Container>
  );
}
