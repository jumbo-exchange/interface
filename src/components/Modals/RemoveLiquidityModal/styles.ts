import styled from 'styled-components';
import { Modal } from '../styles';

export const LiquidityModalContainer = styled(Modal)`
  max-width: 500px;
  min-width: 328px;
`;

export const ModalTitle = styled.h2`
  flex: 1;
  font-style: normal;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.75rem;
  margin-block-start: 0;
  margin-block-end: 0;
  text-align: center;
  color: ${({ theme }) => theme.globalWhite};
`;

export const ModalBody = styled.div`
  margin: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 1rem 1rem;
  `}
`;

export const TitleAction = styled.p`
  margin: 1rem .875rem;
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalGrey};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 1rem .5rem;
    font-size: .75rem;
    line-height: .875rem;
  `}
`;

export const WithdrawTokenBlock = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 .875rem 2rem;
  & > div:last-child {
    flex: 1;
    justify-content: center;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    margin: 0 .5rem 2rem;
    & > div:last-child {
      flex: 0;
      justify-content: flex-start;
      margin-top: .75rem;
    }
  `}
`;

export const TokenLogo = styled.div`
  display: flex;
  align-items: center;
  margin-right: .5rem;
  & > img {
    height: 2.25rem;
    width: 2.25rem;
    transition: all 1s ease-out;
  }
`;

export const TokenBlock = styled.div`
  display: flex;
  align-items: center;
`;

export const TokenValueBlock = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.188rem;
  & > p {
    margin: 0;
  }
`;
