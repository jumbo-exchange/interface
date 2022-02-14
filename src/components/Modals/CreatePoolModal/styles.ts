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

export const CreateIconContainer = styled(AddIcon)`
  width: 12px;
  height: 12px;
  margin-right: .625rem;
`;
