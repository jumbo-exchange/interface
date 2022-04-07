import styled from 'styled-components';

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

export const SlippageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Warning = styled.div`
  text-align: left;
  margin: 1rem .875rem 0;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.error};
`;
