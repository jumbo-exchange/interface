import { ReactComponent as JetLogo } from 'assets/images/jets-icon.svg';
import { ReactComponent as SlippageLogo } from 'assets/images/slippage-icon.svg';
import { ReactComponent as FarmingLogo } from 'assets/images/farming-icon.svg';
import i18n from 'i18n';

export const benefitsList = [
  i18n.t('landing.benefitsList.first'),
  i18n.t('landing.benefitsList.second'),
  i18n.t('landing.benefitsList.third'),
];

export const benefitsCards = [
  {
    Image: JetLogo,
    title: i18n.t('landing.benefitsCards.jets'),
    subtitle: i18n.t('landing.benefitsCards.subtitleJets'),
  },
  {
    Image: SlippageLogo,
    title: i18n.t('landing.benefitsCards.lowSlippage'),
    subtitle: i18n.t('landing.benefitsCards.subtitleLowSlippage'),
  },
  {
    Image: FarmingLogo,
    title: i18n.t('landing.benefitsCards.yieldFinder'),
    subtitle: i18n.t('landing.benefitsCards.subtitleYieldFinder'),
  },
];
