import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 736px;
  white-space: nowrap;
`;

export const FilterBlock = styled.div`
  display: flex;
  margin-bottom: 2.375rem;
  & > button {
    margin: 0 .625rem;
  }
`;

export const InformationBlock = styled.div`
  width: 100%;
  & > div {
    max-width: 736px;
    width: 100%;
    flex-direction: row;
    border-radius: 12px;
    justify-content: space-between;
    ::before{
      border-radius: 12px;
    }
  }
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

export const ResultBlock = styled.div``;
