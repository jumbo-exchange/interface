import React from 'react';
import { wallet } from 'services/near';
import styled from 'styled-components';

import { CurrentButton, useModalsStore } from 'store';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { ReactComponent as LogoWallet } from 'assets/images-app/wallet.svg';
import { ReactComponent as SwapIcon } from 'assets/images-app/swap-icon.svg';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';

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

  function CurrentTitle(variant: CurrentButton) {
    switch (variant) {
      case CurrentButton.AddLiquidity:
        return 'Add Liquidity';
      case CurrentButton.CreatePool:
        return 'Create Pool';
      case CurrentButton.Swap:
        return 'Swap';
      case CurrentButton.Withdraw:
        return 'Withdraw';
      default:
        return null;
    }
  }
  const title = isConnected ? CurrentTitle(typeButton) : 'Connect Wallet';

  function CurrentIcon({ variant }:{variant: CurrentButton}) {
    switch (variant) {
      case CurrentButton.AddLiquidity:
        return <AddIconLogo />;
      case CurrentButton.CreatePool:
        return <AddIconLogo />;
      case CurrentButton.Swap:
        return <IconSwap />;
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
    <ButtonSecondary onClick={() => setAccountModalOpen(true)}>
      <Wallet />
      {title}
    </ButtonSecondary>
  );
}
