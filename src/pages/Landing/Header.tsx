import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';
import { ReactComponent as DocsLogo } from 'assets/images/docs-icon.svg';
import { docsLink } from 'utils/constants';
import { isMobile } from 'utils/userAgent';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { APP } from 'utils/routes';

const HeaderContainer = styled.header`
  min-height: 5rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 13rem;
  ${({ theme }) => theme.mediaWidth.upToLarge`
      padding: 0 4.5rem;
  `}
  
  ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 0 1.5rem;
  `}
`;

const LogoContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > svg {
    margin-right: 0.438rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex: 3;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1;
  `}
`;

const DocsButton = styled.a`
  padding: 0.625rem;
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
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
    margin-right: .5rem;
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
  justify-content: flex-end;
  align-items: center;
  min-width: 12.5rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex: 2;
    min-width: unset;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1;
    justify-content: flex-end;
  `}
`;

const LogoTitle = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 2.438rem;
  color: ${({ theme }) => theme.white};
`;

const ButtonOpenApp = styled(Link)`
  background: ${({ theme }) => theme.pink};
  border-radius: 12px;
  border: none;
  width: 103px;
  height: 44px;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.white};
  margin-left: 1.5rem;
  :hover {
    cursor: pointer;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration:none;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <LogoContainer>
        <JumboLogo />
        {isMobile ? null : (<LogoTitle>jumbo</LogoTitle>)}
      </LogoContainer>
      <InformationContainer>
        <DocsButton
          href={docsLink}
          target="_blank"
          rel="noreferrer"
        >
          <DocsLogo />
          <span>Read</span> Docs
        </DocsButton>
        <ButtonOpenApp to={APP}>
          Open App
        </ButtonOpenApp>
      </InformationContainer>
    </HeaderContainer>
  );
}
