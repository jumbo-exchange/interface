import styled from 'styled-components';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';
import { Modal } from '../styles';

export const LiquidityModalContainer = styled(Modal)`
  max-width: 500px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 350px;
    min-width: 330px;
  `}
`;

export const ModalBody = styled.div`
  margin: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const LogoContainerAdd = styled(AddIcon)`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  align-self: center;
`;

export const RefreshBlock = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 2.063rem .75rem;
  & > div {
    font-size: 1rem;
  }
`;

export const YourSharesBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalGrey};
  margin: 1.5rem .75rem 0;
  & > span {
    color: ${({ theme }) => theme.globalWhite};
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: .75rem;
    line-height: .875rem;
  `}
`;
