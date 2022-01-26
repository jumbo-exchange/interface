import React, { useState } from 'react';
import styled from 'styled-components';
import Big from 'big.js';
import Toggle from 'components/Toggle';
import Tooltip from 'components/Tooltip';
import { poolFeeOptions } from 'utils/constants';

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

export default function AddPoolSettings(
  {
    fee,
    setFee,
  }:{
    fee: string;
    setFee:(fee:string) => void
  },
) {
  const [error, setError] = useState(false);

  const feeList = [
    {
      title: 'LP Fee',
      percent: 80,
    },
    {
      title: 'Protocol Fee',
      percent: 16,
    },
    {
      title: 'Referral Fee',
      percent: 4,
    },
  ];

  const getCurFee = (percent: number) => {
    let result;
    if (
      !!fee
      && new Big(fee).gt('0.01')
      && new Big(fee).lt('20')
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
    setFee(value);
    if (!value || Number(value) <= 0) {
      setError(true);
      return;
    }
    const bigValue = new Big(value);
    if (!bigValue.gt('0.01')) {
      setError(true);
      return;
    }
    if (!bigValue.lt('20')) {
      setError(true);
      return;
    }

    setFee(bigValue.toString());

    setError(false);
  };

  return (
    <Container>
      <Title>Total Fee <Tooltip title="Total Fee" /> </Title>
      <TotalFeeBlock>
        <Toggle
          value={fee}
          coefficient={0.5}
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
        {feeList.map(({ title, percent }) => (
          <Row key={title}>
            <RowTitle>{title} <Tooltip title={title} /> </RowTitle>
            <LabelTitle>{getCurFee(percent)}</LabelTitle>
          </Row>
        ))}
      </Column>
    </Container>
  );
}
