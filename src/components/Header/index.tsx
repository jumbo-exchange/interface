import styled from 'styled-components';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';

const HeaderContainer = styled.header`
  min-height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-content: center;
  padding: 0 208px;
`;

const LogoContainer = styled.div`

`;

export default function Header() {
  return (
    <HeaderContainer>
      <LogoContainer>
        <JumboLogo />
        <h1>Jumbo</h1>
      </LogoContainer>
    </HeaderContainer>
  );
}
