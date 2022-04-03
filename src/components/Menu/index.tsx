import React, { MutableRefObject, useRef, useState } from 'react';
import { ReactComponent as MenuIcon } from 'assets/images-app/menu.svg';
import { ReactComponent as ClaimArrow } from 'assets/images-app/claim-arrow.svg';
import i18n from 'i18n';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useModalsStore } from 'store';
import {
  MenuFlyout, StyledMenu, StyledMenuButton, MenuItem,
} from './styles';

export default function Menu() {
  const node = useRef<HTMLDivElement>();
  const [show, setShow] = useState(false);
  const { setWithdrawDepositModalOpen } = useModalsStore();
  const handleClick = () => setShow(!show);
  useOnClickOutside(node, show ? handleClick : undefined);

  const menu = [
    {
      title: i18n.t('action.claim'),
      Logo: ClaimArrow,
      onClick: () => {
        setShow(false);
        setWithdrawDepositModalOpen(true);
      },
    },
  ];

  return (
    <StyledMenu ref={node as MutableRefObject<HTMLDivElement>}>
      <StyledMenuButton
        onClick={handleClick}
      >
        <MenuIcon />
      </StyledMenuButton>

      {show && (
        <MenuFlyout>
          {menu.map(({ title, Logo, onClick }) => (
            <MenuItem key={title} onClick={onClick}>
              <Logo />
              <p>{title}</p>
            </MenuItem>
          ))}
        </MenuFlyout>
      )}

    </StyledMenu>
  );
}
