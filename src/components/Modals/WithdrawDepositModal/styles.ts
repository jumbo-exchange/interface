import styled from 'styled-components';
import { ReactComponent as ClaimArrow } from 'assets/images-app/claim-arrow.svg';
import { ModalBlock, Modal } from '../styles';

export const Container = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    position: fixed;
    bottom: 0;
    width: 100%;
  `}
`;

export const ClaimModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  min-width: 360px;
  max-height: 560px;
  min-height: 400px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 320px;
    width: 100%;
    border-radius: 24px 24px 0 0;
    ::before {
      border-radius: 24px 24px 0 0;
    }
  `}
`;

export const ClaimModalBlock = styled(ModalBlock)<{canClaim: boolean}>`
  flex-direction: column;
  justify-content: ${({ canClaim }) => (canClaim ? 'flex-start' : 'center')};
  overflow-x: hidden;
  flex: 1;
  margin: 0 1rem 0 1rem;
  & > div{
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.globalGreyOp04};
    border-radius: 10px;
  }
`;

export const TokenRowContainer = styled.div`
  min-height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-bottom: .75rem;
`;

export const TokenDescriptionBlock = styled.div`
  display: flex; 
  flex-direction: column;
  flex-grow: 2;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 1rem;
  `}
  transition: all 1s ease;
`;

export const TokenTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  margin-bottom: .5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.188rem;
    margin-bottom: .25rem;
  `}
  transition: all 1s ease;
`;

export const TokenSubtitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  margin-block-start: 0;
  margin-block-end: 0;
  color: ${({ theme }) => theme.globalGrey};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: .75rem;
    line-height: .875rem;
  `}
  transition: all 1s ease;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 16px;
  transition: all 1s ease-out;
  height: 3.125rem;
  min-width: 3.125rem;
  & > img {
    border-radius: 16px;
    width: 3rem;
    height: 3rem;
    transition: all 1s ease;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 16px;
    height: 3.125rem;
    min-width: 3.125rem;
    & > img {
      border-radius: 16px;
      height: 3rem;
      width: 3rem;
      transition: all 1s ease-out;
    }
  `}
`;

export const ModalFooter = styled.div`
  margin: 1.5rem;
  & > button {
    width: 100%;
    padding: 1.156rem;
  }
`;

export const IconClaim = styled(ClaimArrow)`
  margin-right: 1rem;
`;

export const NoClaimBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > img {
    width: 84px;
    height: 65px;
  }
`;
