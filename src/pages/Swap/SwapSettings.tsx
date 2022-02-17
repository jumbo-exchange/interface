import React, { useState } from 'react';
import styled from 'styled-components';
import Toggle from 'components/Toggle';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import {
  slippageToleranceOptions,
  tooltipTitle,
  MIN_SLIPPAGE_TOLERANCE,
  MAX_SLIPPAGE_TOLERANCE,
  COEFFICIENT_SLIPPAGE,
} from 'utils/constants';

const Container = styled.div<{isSettingsOpen?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: ${({ isSettingsOpen }) => (isSettingsOpen ? '110px' : '0')};
  transition: .5s;
  overflow: ${({ isSettingsOpen }) => (isSettingsOpen ? 'visible' : 'hidden')};
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

const Warning = styled.div`
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
    isSettingsOpen,
  }:{
    slippageTolerance: string,
    setSlippageTolerance: (slippageTolerance:string) => void,
    isSettingsOpen: boolean,
  },
) {
  const [warning, setWarning] = useState(false);

  const onChange = (value:string) => {
    if (!value || Number(value) <= 0) {
      setSlippageTolerance(MIN_SLIPPAGE_TOLERANCE.toString());
      setWarning(true);
      return;
    }
    if (Number(value) < MIN_SLIPPAGE_TOLERANCE) {
      setSlippageTolerance(MIN_SLIPPAGE_TOLERANCE.toString());
      setWarning(true);
      return;
    }
    if (Number(value) >= (MAX_SLIPPAGE_TOLERANCE)) {
      setSlippageTolerance(MAX_SLIPPAGE_TOLERANCE.toString());
      return;
    }

    setSlippageTolerance(value);

    setWarning(false);
  };

  return (
    <Container isSettingsOpen={isSettingsOpen}>
      <Title>
        Slippage Tolerance
        <Tooltip title={tooltipTitle.slippageTolerance} />
      </Title>
      <SlippageBlock>
        <Toggle
          value={slippageTolerance}
          coefficient={COEFFICIENT_SLIPPAGE}
          options={slippageToleranceOptions}
          onChange={onChange}
        />
        {warning && (
          <Warning>
            Your transaction may be frontrun
          </Warning>
        )}
      </SlippageBlock>
    </Container>
  );
}
