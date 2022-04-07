import React, { Dispatch, useState, SetStateAction } from 'react';
import {
  COEFFICIENT_SLIPPAGE,
  MAX_SLIPPAGE_TOLERANCE,
  MIN_SLIPPAGE_TOLERANCE,
} from 'utils/constants';

import Toggle from 'components/Toggle';
import Tooltip from 'components/Tooltip';
import { useTranslation } from 'react-i18next';
import {
  SlippageWrapper,
  Warning,
  TitleAction,
} from './styles';

export default function SlippageBlock(
  { slippageToleranceOptions, slippageValue, onChange } :{
    slippageToleranceOptions: {label: string, value: string}[],
    slippageValue: string,
    onChange: Dispatch<SetStateAction<string>>
  },
) {
  const [warning, setWarning] = useState<boolean>(false);
  const { t } = useTranslation();

  const onChangeSlippage = (value:string) => {
    if (!value || Number(value) <= 0) {
      onChange(MIN_SLIPPAGE_TOLERANCE.toString());
      setWarning(true);
      return;
    }
    if (Number(value) < MIN_SLIPPAGE_TOLERANCE) {
      onChange(value);
      setWarning(true);
      return;
    }
    if (Number(value) >= (MAX_SLIPPAGE_TOLERANCE)) {
      onChange(MAX_SLIPPAGE_TOLERANCE.toString());
      return;
    }

    onChange(value);
    setWarning(false);
  };

  return (
    <SlippageWrapper>
      <TitleAction>
        {t('removeLiquidityModal.slippageTolerance')}
        <Tooltip title={t('tooltipTitle.slippageTolerance')} />
      </TitleAction>
      <Toggle
        value={slippageValue}
        coefficient={COEFFICIENT_SLIPPAGE}
        options={slippageToleranceOptions}
        onChange={onChangeSlippage}
      />
      {warning && (
      <Warning>
        {t('warningMessage.transactionMayFail')}
      </Warning>
      )}
    </SlippageWrapper>
  );
}
