import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { ReactComponent as InfoIcon } from 'assets/images-app/info.svg';

export const Wrapper = styled(SpecialContainer)`
  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0;
  margin-bottom: 1rem;
  & > div:first-child {
    margin-bottom: 1.5rem;
  }
  ::before{
    border-radius: 24px;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BlockTitle = styled.div`
  display: flex;
`;

export const LogoPool = styled.div`
  position: relative;
  margin-right: 1.75rem;
  & > img {
    width: 24px;
    height: 24px;
  }
  & > img:last-child {
    position: absolute;
    left: 19px;
    top: -5px;
    filter: drop-shadow(0px 4px 8px #202632);
  }
`;

export const TitlePool = styled.div`
  display: flex;
  & > p {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.188rem;
    color: ${({ theme }) => theme.globalWhite};
    margin: 0;
  }
`;

export const LabelPool = styled.div`
  p {
    font-style: normal;
    font-weight: 500;
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

export const BlockVolume = styled.div`
  display: flex;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2.125rem;
`;

export const TitleVolume = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin-bottom: .75rem;
`;

export const LabelVolume = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalWhite};
`;

export const LogoInfo = styled(InfoIcon)`
  margin-left: 6.35px;
`;

export const BlockButton = styled.div`
  display: flex;
`;
