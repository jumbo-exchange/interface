import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { ReactComponent as Soon } from 'assets/images-app/logo-soon.svg';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 736px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 328px;
  `}
`;

export const FilterBlock = styled.div`
  display: flex;
  margin-bottom: 2.375rem;
  align-content: center;
  white-space: nowrap;
  & > button {
    margin: 0 .625rem;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > button {
      margin: 0 .25rem;
    }
  `}
`;

export const InformationBlock = styled(SpecialContainer)`
  max-width: 736px;
  width: 100%;
  flex-direction: row;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0;
  min-height: 90px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    & > button {
      margin: 1.25rem 0 0;
    }
  `}
  ::before{
    border-radius: 24px;
  }
`;

export const WrapperInfoBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const InfoBLock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem;
`;

export const TitleInfo = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin-bottom: .5rem;
`;

export const LabelInfo = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
`;

export const LogoSoon = styled(Soon)`
  margin-left: .25rem;
`;
