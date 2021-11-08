import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';
import { ReactComponent as DocsLogo } from 'assets/images/docs-icon.svg';
import { ReactComponent as HapiLogo } from 'assets/images/hapi-logo.svg';
import HeaderStyles from './styles';

export default function Header() {
  return (
    <HeaderStyles.HeaderContainer>
      <HeaderStyles.LogoContainer>
        <JumboLogo />
        <HeaderStyles.LogoTitle>Jumbo</HeaderStyles.LogoTitle>
      </HeaderStyles.LogoContainer>
      <HeaderStyles.InformationContainer>
        <HeaderStyles.DocsButton>
          <DocsLogo />
          Read Docs
        </HeaderStyles.DocsButton>
        <HeaderStyles.HapiButton>
          <HeaderStyles.HapiLogoContainer>
            <HapiLogo />
          </HeaderStyles.HapiLogoContainer>
          <HeaderStyles.HapiTitle>
            Protected by
            <span>HAPI Protocol</span>
          </HeaderStyles.HapiTitle>
        </HeaderStyles.HapiButton>
      </HeaderStyles.InformationContainer>
    </HeaderStyles.HeaderContainer>
  );
}
