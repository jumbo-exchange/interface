import { ReactComponent as CentralArrow } from 'assets/images/arrow-central.svg';
import { ReactComponent as LowerLeftArrow } from 'assets/images/arrow-lower-left.svg';
import { ReactComponent as LowerRightArrow } from 'assets/images/arrow-lower-right.svg';
import styled from 'styled-components';

export const UpperContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 70%;
  margin: 4.375rem auto;
  
  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: column;
    align-items: flex-start;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: unset;
    margin: 4.375rem 4.5rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: unset;
    margin: 4.375rem 2rem;
    align-items: center;
  `}
`;

export const MainInformation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const Gif = styled.img`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin-top: 2rem;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`;

export const NearContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.greyText};
  & > svg {
    margin-left: 1rem;
  }
`;

export const MainTitle = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 3rem;
  line-height: 3.563rem;
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 2rem;
    line-height: 2.375rem;
  `}
`;

export const ListElement = styled.li`
  font-style: normal;
  font-weight: 300;
  font-size: 1.25rem;
  line-height: 140%;
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 1rem;
  `}
`;
export const GreyCardContainer = styled.section`
  background-color: ${({ theme }) => theme.greyCard};
  border-radius: 240px 240px 0 0;
  box-shadow: 0px 0px 72px -12px ${({ theme }) => theme.greyCardShadow};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius: 7.5rem 7.5rem 0 0;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 3rem 3rem 0 0;
  `}
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding: 0 10%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0%;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    padding: 0%;
  `}
`;

export const GreyCard = styled.div`
  color: ${({ theme }) => theme.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3.75rem;
  padding: 0 5%;

  & > h2 {
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

export const BlackCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.blackCardBg} 0%,
    ${({ theme }) => theme.globalBlack} 100%
  );
  border-radius: 15rem 15rem 0 0;
  box-shadow: 0 0 4.5rem ${({ theme }) => theme.blackCardShadow};
  margin-top: 34px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius: 7.5rem 7.5rem 0 0;
    margin-top: 3.5rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    border-radius: 48px 48px 0 0;
  `}
`;

export const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 2rem;
  line-height: 2.375rem;
  text-align: center;
  color: ${({ theme }) => theme.white};
  padding-top: 4.5rem;
  margin-bottom: 1.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding-top: 3rem;
  `}
`;

export const Label = styled.div`
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 2.125rem;
  text-align: center;
  color: ${({ theme }) => theme.blackCardText};
  margin-top: 1.5rem;
  margin-bottom: 4.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-style: normal;
    font-size: 1rem;
    line-height: 1.375rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
  `}
`;

export const BlockInformation = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr) 0.2fr 0.5fr 0.2fr 2fr 0.2fr 0.5fr 0.2fr repeat(
      2,
      1fr
    );
  grid-template-rows: 0.6fr 0.1fr 0.3fr 1fr 0fr 0.1fr 1.4fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  color: ${({ theme }) => theme.globalWhite};
  max-width: 1000px;
  padding-bottom: 6.25rem;
  align-self: center;
  user-select: none;
`;

export const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 2.125rem;
  box-sizing: border-box;
  border-radius: 32px;
  padding: 0.625rem;
`;

export const UpperBlock = styled(Block)`
  grid-area: 1 / 4 / 2 / 9;
  border: 2px dashed ${({ theme }) => theme.redBorder};
`;

export const MiddleLeftBlock = styled(Block)`
  grid-area: 4 / 1 / 5 / 5;
  border: 2px dashed ${({ theme }) => theme.globalWhite};
  max-height: 96px;
  min-width: 300px;
`;

export const MiddleRightBlock = styled(Block)`
  grid-area: 4 / 8 / 5 / 12;
  border: 2px dashed ${({ theme }) => theme.globalWhite};
  line-height: 34px;
  max-height: 96px;
  min-width: 300px;
`;

export const LowerBlock = styled(Block)`
  width: 100%;
  grid-area: 7 / 4 / 8 / 9;
  font-style: normal;
  line-height: 2rem;
  color: ${({ theme }) => theme.greenText};
  background: ${({ theme }) => theme.darkGreenBg};
  border-radius: 32px;
`;

export const CentralArrowContainer = styled(CentralArrow)`
  grid-area: 3 / 6 / 5 / 7;
`;
export const LowerLeftArrowContainer = styled(LowerLeftArrow)`
  justify-self: flex-end;
  grid-area: 6 / 2 / 8 / 3;
`;
export const LowerRightArrowContainer = styled(LowerRightArrow)`
  justify-self: flex-start;
  grid-area: 6 / 10 / 8 / 11;
`;

export const TabletImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 6.25rem;
  & > img {
    min-width: 700px;
  }
`;

export const MobileImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 4.5rem;
  & > img {
    width: 95%;
  }
`;

export default {
  UpperContainer,
  MainInformation,
  Gif,
  NearContainer,
  MainTitle,
  ListElement,
  GreyCardContainer,
  CardWrapper,
  GreyCard,
  BlackCardContainer,
  Title,
  Label,
  BlockInformation,
  UpperBlock,
  MiddleLeftBlock,
  MiddleRightBlock,
  LowerBlock,
  CentralArrowContainer,
  LowerLeftArrowContainer,
  LowerRightArrowContainer,
  TabletImgContainer,
  MobileImgContainer,
};
