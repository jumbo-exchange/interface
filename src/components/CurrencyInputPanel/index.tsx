import React from 'react';
import styled from 'styled-components';
import { escapeRegExp, inputRegex } from 'utils/index';

interface IInputPanel {
  value: string;
  setValue: (value: string)=> void;
  disabled?: boolean;
}

export const Input = styled.input`
  width: 100%;
  outline: none;
  border: none;
  background: none;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  line-height: 1.75rem;
  color: ${({ theme }) => theme.globalWhite};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.125rem;
  `}
  transition: all 1s ease-out;
`;

export default function CurrencyInputPanel({ value, setValue, disabled = false }: IInputPanel) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput[0] === '.' || nextUserInput[0] === ',') {
      return setValue(`0${nextUserInput}`);
    }
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setValue(nextUserInput);
    }
    return null;
  };
  return (
    <Input
      value={value}
      onChange={(event) => enforcer(event.target.value.replace(/,/g, '.'))}
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder="0.0"
      minLength={1}
      maxLength={79}
      spellCheck="false"
      disabled={disabled}
    />
  );
}
