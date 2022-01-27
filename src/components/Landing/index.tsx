import styled from 'styled-components';
import Header from 'components/Header';
import { ReactComponent as NearLogo } from 'assets/images/near-logo.svg';
import { ReactComponent as JetLogo } from 'assets/images/jets-icon.svg';
import { ReactComponent as SlippageLogo } from 'assets/images/slippage-icon.svg';
import { ReactComponent as FarmingLogo } from 'assets/images/farming-icon.svg';

const benefitsList = [
  'Instanteneous Swaps',
  'Highest Yields and Seamless Pool Transition',
  'Permissionless Liquidity Pools',
];

const MainInformation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 60%;
  margin: 70px auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: unset;
    margin: 70px 72px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: unset;
      margin: 70px 32px;
  `}
`;

const NearContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 19px;
  color: ${({ theme }) => theme.greyText};
  & > svg {
    margin-left: 1rem;
  }
`;

const MainTitle = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 3rem;
  line-height: 57px;
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 2rem;
    line-height: 38px;
  `}
`;

const ListElement = styled.li`
  font-style: normal;
  font-weight: 300;
  font-size: 1.25rem;
  line-height: 140%;
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 1rem;
  `}
`;
const GreyCardContainer = styled.section`
  background-color:  ${({ theme }) => theme.greyCard};
  border-radius: 240px 240px 0 0;
  
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  box-shadow: 0px 0px 72px -12px ${({ theme }) => theme.greyCardShadow};
  padding: 0 10%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0%;
    border-radius: 120px 120px 0 0;
  `}
 
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    border-radius: 48px 48px 0 0;
    padding: 0%;
  `}
`;

const GreyCard = styled.div`
    color: ${({ theme }) => theme.white};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    padding:  0 5%;

    & > h1{
      font-style: normal;
      font-weight: 500;
      font-size: 1.5rem;
      line-height: 1.75rem;
      text-align: center;
    }
    
    & > h5 {
      font-style: normal;
      font-weight: 300;
      font-size: 1rem;
      line-height: 1.185rem;
      text-align: center;
      margin-block-start: 0;
    }
    
    ${({ theme }) => theme.mediaWidth.upToSmall`
      padding:  0 10%;
    `}
`;

const benefitsCards = [
  {
    Image: JetLogo,
    title: 'Jets',
    subtitle: 'Interface-embedded system that helps to find the most promising pools',
  },
  {
    Image: SlippageLogo,
    title: 'Low Slippage',
    subtitle: 'The lowest slippage possible thanks to NEAR and proprietary algorithms',
  },
  {
    Image: FarmingLogo,
    title: 'Yield Finder',
    subtitle: 'Find the best Yields and Transition between pools in ONE Click',
  },
];

export default function Landing() {
  return (
    <>
      <Header />
      <MainInformation>
        <NearContainer>
          Powered by
          <NearLogo />
        </NearContainer>
        <MainTitle>
          The Most Intuitive <br />
          DeFi Experience <br />
          You Will Ever Have
        </MainTitle>
        {benefitsList.map((el) => <ListElement key={el}>{el}</ListElement>)}
      </MainInformation>
      <GreyCardContainer>
        <CardWrapper>
          {benefitsCards.map(({ Image, title, subtitle }) => (
            <GreyCard key={title}>
              <Image />
              <h2>{title}</h2>
              <h5>{subtitle}</h5>
            </GreyCard>
          ))}
        </CardWrapper>

      </GreyCardContainer>
    </>
  );
}
