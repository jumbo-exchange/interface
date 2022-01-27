import styled from 'styled-components';

const HeaderContainer = styled.header`
  min-height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 208px;
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
`;

const HapiButton = styled.a`
  min-height: 2.25rem;
  cursor: pointer;
  font-family: Arial;
  font-style: normal;
  font-weight: bold;
  font-size: .625rem;
  line-height: 11px;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.yellowHapi};
  border-radius: 8px;
  :hover {
    & span {
      text-decoration: underline;
    }
  }
`;

const InformationContainer = styled.div`
  flex:1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 200px;
`;

const HapiLogoContainer = styled.div`
  background-color: ${({ theme }) => theme.yellowHapi};
  border-radius: 6px 0 0 6px;
`;

const LogoTitle = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 39px;
  color: ${({ theme }) => theme.white};
`;

const HapiTitle = styled.p`
  color: ${({ theme }) => theme.yellowHapi};
  margin-block-start: 0;
  margin-block-end: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 6px 5px;
  white-space: nowrap;
`;
const HeaderStyles = {
  HapiTitle,
  LogoTitle,
  HapiLogoContainer,
  InformationContainer,
  HapiButton,
  DocsButton,
  LogoContainer,
  HeaderContainer,
};
export default HeaderStyles;
