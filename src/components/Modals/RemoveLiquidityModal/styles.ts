import styled from 'styled-components';
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
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 1rem 1rem;
  `}
`;

export const TitleAction = styled.div`
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
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    margin: 0 .5rem 2rem;
    & > div:last-child {
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

export const SlippageBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Error = styled.div`
  text-align: left;
  margin: 1rem .875rem 0;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.error};
`;
