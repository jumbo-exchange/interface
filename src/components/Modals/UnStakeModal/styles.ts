import styled from 'styled-components';
import { Modal } from '../styles';

export const UnStakeModalContainer = styled(Modal)`
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

export const TokensBlock = styled.div`
  display: flex;
  margin: .7rem 0 3rem;
`;
