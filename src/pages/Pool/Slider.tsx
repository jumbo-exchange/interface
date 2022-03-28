import React from 'react';
import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { IMainInfo } from '.';
import { InfoBLock, TitleInfo, LabelInfo } from './styles';

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

const SliderNav = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
`;

const SliderLink = styled.div`
  display: inline-block;
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: white;
  margin: 0 .25rem 0;
`;

export default function Slider({ mainInfo }: {mainInfo: IMainInfo[]}) {
  const newMainInfo = [
    {
      array: [mainInfo[0], mainInfo[2]],
    },
    {
      array: [mainInfo[1], mainInfo[3]],
    },
  ];

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
      <SliderNav>
        <SliderLink />
        <SliderLink />
      </SliderNav>
      {
      // TODO: claim button
      }
    </Container>
  );
}
