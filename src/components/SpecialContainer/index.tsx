import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.backgroundCard};

  max-width: 500px;
  min-width: 328px;
  height: fit-content;

  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.white};
  box-shadow: 0px 32px 72px -12px ${({ theme }) => theme.boxShadowCard};
  border-radius: 36px;
  padding: 24px;
  ::before {
    content: '';
    position: absolute;
    top: -1px;
    bottom: 0;
    left: -1px;
    right: -1px;
    background: ${({ theme }) => theme.specialBorderCard};
    border-radius: 36px;
    z-index: -1;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 1rem 10rem 1rem;
  `}
`;

export default function SpecialContainer({ children }: {children: JSX.Element[]}) {
  return (
    <Container>
      {children}
    </Container>
  );
}
