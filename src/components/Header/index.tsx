import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';
import { ReactComponent as DocsLogo } from 'assets/images/docs-icon.svg';
import { docsLink } from 'utils/constants';

import HeaderStyles from './styles';

export default function Header() {
  return (
    <HeaderStyles.HeaderContainer>
      <HeaderStyles.LogoContainer>
        <JumboLogo />
        <HeaderStyles.LogoTitle>jumbo</HeaderStyles.LogoTitle>
      </HeaderStyles.LogoContainer>
      <HeaderStyles.InformationContainer>
        <HeaderStyles.DocsButton
          href={docsLink}
          target="_blank"
          rel="noreferrer"
        >
          <DocsLogo />
          <span>Read</span> Docs
        </HeaderStyles.DocsButton>
      </HeaderStyles.InformationContainer>
    </HeaderStyles.HeaderContainer>
  );
}
