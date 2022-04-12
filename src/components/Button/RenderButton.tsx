import React from 'react';
import { wallet } from 'services/near';
import styled from 'styled-components';

import { CurrentButton, useModalsStore } from 'store';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { ReactComponent as LogoWallet } from 'assets/images-app/wallet.svg';
import { ReactComponent as SwapIcon } from 'assets/images-app/swap-icon.svg';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';
import { useTranslation } from 'react-i18next';
import { POOL } from 'utils/routes';
import { useNavigate } from 'react-router-dom';

const Wallet = styled(LogoWallet)`
  margin-right: .625rem;
  width: 16px;
  height: 12px;
  path {
    fill: ${({ theme }) => theme.globalWhite};
  }
`;

const IconSwap = styled(SwapIcon)`
  margin-left: .75rem;
`;

export const AddIconLogo = styled(AddIcon)`
  width: 12px;
  height: 12px;
  margin-left: .625rem;
`;

export default function RenderButton({
  typeButton,
  onSubmit,
  disabled,
}: {
  typeButton: CurrentButton,
  onSubmit:() => void,
  disabled: boolean,
  }) {
  const isConnected = wallet.isSignedIn();
  const { setAccountModalOpen } = useModalsStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  function CurrentTitle(variant: CurrentButton) {
    switch (variant) {
      case CurrentButton.AddLiquidity:
        return t('action.addLiquidity');
      case CurrentButton.CreatePool:
        return t('action.createPool');
      case CurrentButton.Swap:
        return t('action.swap');
      case CurrentButton.Withdraw:
        return t('action.removeLiquidity');
      case CurrentButton.Stake:
        return t('action.stake');
      case CurrentButton.UnStake:
        return t('action.unStakeAndClaim');
      default:
        return null;
    }
  }
  const title = isConnected ? CurrentTitle(typeButton) : t('action.connectWallet');

  function CurrentIcon({ variant }:{variant: CurrentButton}) {
    switch (variant) {
      case CurrentButton.AddLiquidity:
        return <AddIconLogo />;
      case CurrentButton.CreatePool:
        return <AddIconLogo />;
      case CurrentButton.Swap:
        return <IconSwap />;
      case CurrentButton.Stake:
        return <AddIconLogo />;
      default:
        return null;
    }
  }

  if (isConnected) {
    return (
      <ButtonPrimary
        onClick={onSubmit}
        disabled={disabled}
      >{title}
        <CurrentIcon variant={typeButton} />
      </ButtonPrimary>
    );
  }
  return (
    <ButtonSecondary onClick={() => {
      const { pathname } = window.location;
      if (pathname.includes(POOL)) {
        navigate(POOL);
      }
      setAccountModalOpen(true);
    }}
    >
      <Wallet />
      {title}
    </ButtonSecondary>
  );
}

const BtnPrimary = styled(ButtonPrimary)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: .75rem 0;
  `}
`;

const BtnSecondary = styled(ButtonSecondary)`
  margin-right: .75rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0;
  `}
`;

const LogoButton = styled(AddIcon)`
  width: 12px;
  height: 12px;
  margin-right: .625rem;
`;

interface IButtons {
  toPageAdd: () => void,
  titleAdd: string,
  toPageRemove: () => void,
  titleRemove: string,
  showRemoveButton: boolean
  showAddButton?: boolean
}

export const PoolOrFarmButtons = ({
  toPageAdd,
  titleAdd,
  toPageRemove,
  titleRemove,
  showRemoveButton,
  showAddButton,
}: IButtons) => (
  <>
    {showRemoveButton && (
      <BtnSecondary onClick={toPageRemove}>
        {titleRemove}
      </BtnSecondary>
    )}
    {showAddButton && (
    <BtnPrimary onClick={toPageAdd}>
      <LogoButton /> {titleAdd}
    </BtnPrimary>
    )}
  </>
);
