import React, { useMemo } from 'react';
import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { IMainInfo } from '.';
import {
  InfoBLock, TitleInfo, LabelInfo,
} from './styles';
import ClaimAllButton, { getCanClaimAll } from './ClaimAllButton';

const Container = styled(SpecialContainer)`
  border-radius: 24px;
  ::before {
    border-radius: 24px;
  }
`;

const Slides = styled.div`
  display: flex;
  overflow-x: scroll;
  position: relative;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  scroll-snap-align: center;
`;

const SliderNav = styled.div<{canClaimAll: boolean}>`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: ${({ canClaimAll }) => (canClaimAll ? '1rem' : '0')};
`;

const SliderLink = styled.div`
  display: inline-block;
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: white;
  margin: 0 .25rem 0;
`;

export default function Slider(
  {
    mainInfo,
    rewardList,
  }: {
    mainInfo: IMainInfo[],
    rewardList: [string, string][]
},
) {
  const newMainInfo = [
    {
      array: [mainInfo[0], mainInfo[2]],
    },
    {
      array: [mainInfo[1], mainInfo[3]],
    },
  ];

  const canClaimAll = useMemo(() => getCanClaimAll(rewardList), [rewardList]);

  return (
    <Container>
      <Slides>
        {newMainInfo.map((el, index) => (
          <Slide key={`${index + 1}`}>
            {el.array.map((item) => (
              <InfoBLock key={item.title}>
                <TitleInfo>
                  {item.title}
                </TitleInfo>
                <LabelInfo>
                  {item.label}
                </LabelInfo>
              </InfoBLock>
            ))}
          </Slide>
        ))}
      </Slides>
      <SliderNav canClaimAll={canClaimAll}>
        <SliderLink />
        <SliderLink />
      </SliderNav>
      <ClaimAllButton rewardList={rewardList} />
    </Container>
  );
}
