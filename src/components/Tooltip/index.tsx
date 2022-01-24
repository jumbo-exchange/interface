import React, { useState, useEffect, PropsWithChildren } from 'react';

import styled from 'styled-components';

import { isMobile } from 'utils/userAgent';
import { ReactComponent as Info } from 'assets/images-app/info.svg';

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
  const [show, setShow] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  // const [mobile, setMobile] = useState<boolean | null>(null);

  // const handleCheckDevice = () => {
  //   if (window.innerWidth < 500 || isMobile) {
  //     setMobile(true);
  //   } else {
  //     setMobile(false);
  //   }
  // };

  // useEffect(() => {
  //   handleCheckDevice();
  //   window.addEventListener('resize', handleCheckDevice);

  //   return () => {
  //     window.removeEventListener('resize', handleCheckDevice);
  //   };
  // }, []);

  const mouseEventDisabled = () => (mouseDisabled || window.innerWidth < 500 || isMobile);

  const handleClick = () => {
    setShow(true);
    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);
      setShow(false);
    }, 3000);
  };

  return (
    <Container
      onMouseOver={() => (!mouseEventDisabled() ? setShow(true) : null)}
      onMouseOut={() => (!mouseEventDisabled() ? setShow(false) : null)}
      onClick={handleClick}
    >
      {children || <Info />}
      {show
        && (
        <HoverContent className={show ? 'show' : ''} bottom={bottom}>
          {title}
        </HoverContent>
        )}
    </Container>
  );
}
