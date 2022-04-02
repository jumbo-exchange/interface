import React, { useRef, useState } from 'react';
import { ReactComponent as MenuIcon } from 'assets/images-app/menu.svg';
import { ReactComponent as ClaimArrow } from 'assets/images-app/claim-arrow.svg';

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
      title: 'Claim',
      logo: ClaimArrow,
      onClick: () => {
        setShow(false);
        setWithdrawDepositModalOpen(true);
      },
    },
  ];

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton
        onClick={handleClick}
      >
        <MenuIcon />
      </StyledMenuButton>

      {show && (
        <MenuFlyout>
          {menu.map(({ title, logo, onClick }) => {
            const Logo = logo;
            return (
              <MenuItem key={title} onClick={onClick}>
                <Logo />
                <p>{title}</p>
              </MenuItem>
            );
          })}
        </MenuFlyout>
      )}

    </StyledMenu>
  );
}
