import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const SpecialContainer = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.backgroundCard};

  max-width: 100%;
  min-width: 310px;
  height: fit-content;

  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.white};
  box-shadow: 0px 32px 72px -12px ${({ theme }) => theme.boxShadowCard};
  border-radius: 36px;
  padding: 24px;
  ::before {
    content: '';
    position: absolute;
    top: -1px;
    bottom: 0;
    left: -1px;
    right: -1px;
    background: ${({ theme }) => theme.specialBorderCard};
    border-radius: 36px;
    z-index: -1;
  }
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0 1rem 0 1rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 1rem;
    padding: 25px 16px 16px 16px;
  `}
  transition: all 1s ease-out;
`;
