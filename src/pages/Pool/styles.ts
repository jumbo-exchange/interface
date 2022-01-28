import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { ButtonClaim } from 'components/Button';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 736px;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 1rem;
    max-width: 328px;
  `}
`;

export const FilterBlock = styled.div`
  display: flex;
  margin-bottom: 2.375rem;
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

export const WrapperInfoBLock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const InfoBLock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.375rem;
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

export const BtnClaim = styled(ButtonClaim)`
  margin-left: 1rem;
`;

export const PoolResult = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;
