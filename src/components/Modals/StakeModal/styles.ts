import styled from 'styled-components';
import { ButtonSecondary } from 'components/Button';
import { Modal } from '../styles';

export const StakeModalContainer = styled(Modal)`
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

export const GetShareBtn = styled(ButtonSecondary)`
  margin-top: 1rem;
`;

export const TokensBlock = styled.div`
  display: flex;
  margin: .7rem 0 3rem;
`;

export const Warning = styled.div`
text-align: left;
margin-bottom: 1rem;
font-style: normal;
font-weight: 300;
font-size: .75rem;
line-height: .875rem;
color: ${({ theme }) => theme.error};
`;
