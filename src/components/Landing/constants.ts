import { ReactComponent as JetLogo } from 'assets/images/jets-icon.svg';
import { ReactComponent as SlippageLogo } from 'assets/images/slippage-icon.svg';
import { ReactComponent as FarmingLogo } from 'assets/images/farming-icon.svg';

export const benefitsList = [
  'Instantaneous Swaps',
  'Highest Yields and Seamless Pool Transition',
  'Permissionless Liquidity Pools',
];

export const benefitsCards = [
  {
    Image: JetLogo,
    title: 'Jets',
    subtitle:
      'Interface-embedded system that helps to find the most promising pools',
  },
  {
    Image: SlippageLogo,
    title: 'Low Slippage',
    subtitle:
      'The lowest slippage possible thanks to NEAR and proprietary algorithms',
  },
  {
    Image: FarmingLogo,
    title: 'Yield Finder',
    subtitle: 'Find the best Yields and Transition between pools in ONE Click',
  },
];
