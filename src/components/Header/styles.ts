import styled from 'styled-components';

const HeaderContainer = styled.header`
  min-height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 208px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
      padding: 0 72px;
  `}
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 0 24px;
  `}
`;

const LogoContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > svg {
    margin-right: 7px;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex: 3;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1;
  `}
`;

const DocsButton = styled.a`
  padding: 10px;
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 19px;
  color: ${({ theme }) => theme.white};
  outline: none;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  text-decoration: none;
  & > svg {
    margin-right: 11px;
  }
  white-space: nowrap;
  & > span {
    margin-right: 8px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    & > span {
      display: none;
    }
  `}
`;

const InformationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex: 2;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1;
  `}
`;

const LogoTitle = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 39px;
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`;

const HeaderStyles = {
  LogoTitle,
  InformationContainer,
  DocsButton,
  LogoContainer,
  HeaderContainer,
};
export default HeaderStyles;
