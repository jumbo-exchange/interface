import React, { useState } from 'react';
import styled from 'styled-components';
import Toggle from 'components/Toggle';
import Tooltip from 'components/Tooltip';
import { slippageToleranceOptions, tooltipTitle } from 'utils/constants';
import Big from 'big.js';

// TODO: add transition to container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  margin: 1rem 0;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
`;

const SlippageBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1.25rem;
`;

const Error = styled.div`
  text-align: left;
  margin-top: 1rem;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.error};
`;

export default function SwapSettings(
  {
    slippageTolerance,
    setSlippageTolerance,
  }:{
    slippageTolerance: string,
    setSlippageTolerance: (slippageTolerance:string) => void,
  },
) {
  const [error, setError] = useState(false);

  const onChange = (value:string) => {
    setSlippageTolerance(value);
    if (!value || Number(value) <= 0) {
      setError(true);
      return;
    }
    const bigValue = new Big(value);
    if (!bigValue.gt('0.01')) {
      setError(true);
      return;
    }
    if (!bigValue.lt('101')) {
      setError(true);
      return;
    }

    setSlippageTolerance(bigValue.toString());

    setError(false);
  };

  return (
    <Container>
      <Title>
        Slippage Tolerance
        <Tooltip title={tooltipTitle.slippageTolerance} />
      </Title>
      <SlippageBlock>
        <Toggle
          value={slippageTolerance}
          coefficient={0.5}
          options={slippageToleranceOptions}
          onChange={onChange}
        />
        {error && (
          <Error>
            Your transaction may be frontrun
          </Error>
        )}
      </SlippageBlock>
    </Container>
  );
}
