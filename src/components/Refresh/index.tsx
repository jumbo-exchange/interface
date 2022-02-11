import React from 'react';
import styled from 'styled-components';

export const REFRESH_TIMER = 5;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  font-style: normal;
  font-weight: 500;
  font-size: .75rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalGrey};
  :hover {
    cursor: pointer;
  }
  & > svg {
    margin-right: .5rem;
  }
`;

const Path = styled.path<{currentTime?: number}>`
  animation: ${(props) => props.currentTime}s ease-in-out infinite both circle-animation;
  display: block;
  fill: transparent;
  stroke: #84DA18;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 280;
  stroke-width: 10px;
  transform-origin: 50% 50%;

  @keyframes circle-animation {
    0% {
      stroke-dashoffset: 289;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
`;

const Loader = ({ time }: {time: number}) => {
  const strokeWidth = 8;
  const radius = (50 - strokeWidth / 2);
  const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;
  const diameter = Math.PI * 2 * radius;

  return (
    <svg
      viewBox="0 0 100 100"
      width={14}
      height={14}
    >
      <path
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={{ stroke: '#454D5C' }}
      />
      <Path
        currentTime={time}
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={{
          stroke: '#84DA18',
          strokeLinecap: 'round',
          strokeDasharray: `${diameter}px ${diameter}px`,
        }}
      />
    </svg>
  );
};

export default function Refresh() {
  return (
    <Container>
      <Loader time={REFRESH_TIMER} />Refresh
    </Container>
  );
}
