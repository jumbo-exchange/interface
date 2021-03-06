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
  overflow: hidden;
`;

export const Modal = styled.div`
  min-width: 400px;
  min-height: 150px;
  
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
  position: relative;
`;

export const ModalTitle = styled.h2`
  text-align: left;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  margin-block-start: 0;
  margin-block-end: 0;
  color: ${({ theme }) => theme.globalWhite};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.188rem;
  `}
  transition: all 1s ease;
`;

export const ModalIcon = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  & > svg {
    justify-self: center;
    transition: all 1s ease;
  }
  :hover {
  cursor: pointer;
  background-color: ${({ theme }) => theme.globalGreyOp02};
    svg {
      path {
        fill: ${({ theme }) => theme.globalWhite};
      }
    }
  }
`;
