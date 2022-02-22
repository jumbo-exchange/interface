import styled from 'styled-components';
import { Modal } from '../styles';

export const LiquidityModalContainer = styled(Modal)`
  max-width: 500px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 330px;
  `}
`;

export const ModalBody = styled.div`
  margin: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
