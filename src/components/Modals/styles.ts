import styled from 'styled-components';

export const Layout = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.layoutBlack};
`;

export const Modal = styled.div`

  min-width: 400px;
  min-height: 170px;
  
  position: relative;
  background-color: ${({ theme }) => theme.backgroundCard};

  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.white};
  box-shadow: 0px 32px 72px -12px ${({ theme }) => theme.boxShadowCard};
  border-radius: 24px;
  ::before {
    content: '';
    position: absolute;
    top: -1px;
    bottom: 0;
    left: -1px;
    right: -1px;
    background: ${({ theme }) => theme.specialBorderCard};
    border-radius: 24px;
    z-index: -1;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
      min-width: 80%;
      margin: 0 16px;
      max-height: 100%;
      width: 100%;
  `}
`;

export const ModalBlock = styled.div`
  margin: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  flex-grow: 0;
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  margin-block-start: 0;
  margin-block-end: 0;
`;

export const ModalClose = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
