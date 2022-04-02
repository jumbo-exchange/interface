import styled from 'styled-components';

export const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-left: 1rem;
`;

export const StyledMenuButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  padding: .281rem .656rem;
  border-radius: 6px;
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.menuBg};
  }
`;

export const MenuFlyout = styled.span`
  min-width: 196px;
  max-height: 350px;
  overflow: auto;
  background: ${({ theme }) => theme.menuBg};
  box-shadow: 0px 16px 36px -12px rgba(10, 12, 18, 0.2);
  border-radius: 12px;

  padding: .375rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  z-index: 100;
  top: 2.5rem;
  right: 0;
`;

export const MenuItem = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: .438rem .813rem;
  width: 100%;
  border-radius: 6px;
  & > svg {
    margin-right: 1rem;
  }
  & > p {
    user-select: none;
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;
    line-height: 1rem;
    color: ${({ theme }) => theme.globalWhite};
    margin: 0;
  }
  :hover {
    background-color: ${({ theme }) => theme.globalGreyOp04};
    cursor: pointer;
    text-decoration: none;
  }
`;
