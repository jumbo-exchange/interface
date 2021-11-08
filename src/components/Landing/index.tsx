import styled from 'styled-components';
import Header from 'components/Header';
import { ReactComponent as NearLogo } from 'assets/images/near-logo.svg';

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
  &> svg {
    margin-left: 1rem;
  }
`;

const MainTitle = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 3rem;
  line-height: 57px;
  color: ${({ theme }) => theme.white};
`;

const ListElement = styled.li`
  font-style: normal;
  font-weight: 300;
  font-size: 1.25rem;
  line-height: 140%;
  color: ${({ theme }) => theme.white};
`;

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
    </>
  );
}
