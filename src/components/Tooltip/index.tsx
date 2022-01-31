import React, { useState, PropsWithChildren, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as Info } from 'assets/images-app/info.svg';
import { isMobile, isTablet } from 'utils/userAgent';
import TooltipModal from 'components/Modals/TooltipModal';
import { useModalsStore } from 'store';

interface IBottom {
  bottom?: string
}

const Container = styled.div`
    position: relative;
    margin: 0 8px;
    display: flex;
    z-index: 3;

    svg {
      pointer-events: none;
    }

    @keyframes fadeInTop {
        from {
            opacity: 0.2;
            transform: translate(-50%, 10px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }

    :hover {
      cursor: pointer;
    }
`;

const HoverContent = styled.div<PropsWithChildren<IBottom>>`
  position: absolute;
  left: 50%;
  bottom: ${({ bottom }) => (bottom || '25px')};
  background-color: ${({ theme }) => theme.tooltip};
  color: white;
  border-radius: 8px;
  padding: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: .75rem;
  line-height: 1.063;
  width: max-content;
  max-width: 250px;
  z-index: 1;
  box-shadow: 0px 3px 12px 0px rgb(0 0 0 / 15%);

  &.show {
    animation-name: fadeInTop;
    animation-duration: 200ms;
    animation-fill-mode: forwards;
  }
`;

export default function Tooltip(
  {
    children,
    title,
    bottom,
  }:{
    children?: JSX.Element;
    title: string;
    bottom?: string;
  },
) {
  const {
    isTooltipModalOpen,
    setTooltipModalOpen,
    setTitleTooltipModal,
  } = useModalsStore();
  const [show, setShow] = useState(false);

  const handleClick = () => {
    if (isMobile || isTablet) {
      setTitleTooltipModal(title);
      setTooltipModalOpen(true);
    }
  };
  return (
    <Container
      onMouseOver={() => setShow(true)}
      onMouseOut={() => setShow(false)}
      onClick={handleClick}
    >
      {children || <Info />}
      {show && !isTooltipModalOpen
        && (
        <HoverContent className={show ? 'show' : ''} bottom={bottom}>
          {title}
        </HoverContent>
        )}
    </Container>
  );
}
