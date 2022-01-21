import styled from 'styled-components';
import { isMobile, isTablet } from 'utils/userAgent';

export const Container = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
  padding: 1.5rem 4.5rem 2.563rem 4.5rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0 2rem 1rem 2rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 1.25rem 1rem 1.25rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 1rem 0.875rem 1rem;
  `}
  transition: all 1s ease;
`;

export const ContainerMobile = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
  padding: 1.5rem 2.063rem 2rem 2.063rem;
`;

export const ChildContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: normal;
  white-space: nowrap;
  margin: ${isMobile ? '1.5rem 0' : '0'};
`;

export const SocialNetworkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 0 1 0;
  border-radius: 32px;
`;

export const ChildSocialNetwork = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.938rem 1.188rem;
  text-decoration: none;
  & > svg {
    path{
      fill: ${({ theme }) => theme.globalGrey}
    }
  }
  & > div {
    margin-top: 0.5rem;
    font-style: normal;
    font-weight: 300;
    font-size: 0.75rem;
    line-height: 1.063rem;
    text-align: center;
    color: ${({ theme }) => theme.globalGrey};
  }
  :hover {
    & > svg {
      path{
        fill: ${({ theme }) => theme.globalWhite}
      }
    }
    & > div {
      color: ${({ theme }) => theme.globalWhite};
    }
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex: ${isMobile ? '0' : '1 1 0'};
  justify-content: flex-end;
  font-style: normal;
  font-weight: 300;
  font-size: 0.75rem;
  line-height: 1.031rem;
  color: ${({ theme }) => theme.globalGrey};
`;

export const LeftContainer = styled.div`
  flex: 1 1 0;
`;

export const HapiButton = styled.a`
  min-height: 2.25rem;
  max-width: 115px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.yellowHapi};
  border-radius: 8px;
  color: ${({ theme }) => theme.yellowHapi};
  text-decoration:none;
  margin-top: ${isTablet ? '10px' : '0'};
  p, span {
    font-family: Arial;
    font-style: normal;
    font-weight: bold;
    font-size: .625rem;
    line-height: 0.688rem;
  }
  :hover {
    & span {
      text-decoration: underline;
    }
  }
  
  :visited, :hover {
    color: ${({ theme }) => theme.yellowHapi};
  }
`;

export const HapiLogoContainer = styled.div`
  background-color: ${({ theme }) => theme.yellowHapi};
  border-radius: 6px 0 0 6px;
`;

export const HapiTitle = styled.p`
  color: ${({ theme }) => theme.yellowHapi};
  margin-block-start: 0;
  margin-block-end: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0.375rem 0.313rem;
  white-space: nowrap;
`;
