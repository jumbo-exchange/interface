import React from 'react';
import styled from 'styled-components';
import { ReactComponent as TriangleWarning } from 'assets/images-app/warning.svg';
import { ReactComponent as CircleWarning } from 'assets/images-app/info-circle.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.warningBg};
  border-radius: 12px;
  padding: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  margin-left: .375rem;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.188rem;
`;

const Description = styled.div`
  text-align: left;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: 1.063rem;
  margin: .75rem 0;
`;

interface IWarning {
  children?: JSX.Element,
  title: string,
  description?: string,
  currentIcon?: boolean
}

export default function Warning(
  {
    children,
    title,
    description,
    currentIcon = true,
  }: IWarning,
) {
  return (
    <Container>
      <Wrapper>
        {currentIcon
          ? <TriangleWarning />
          : <CircleWarning />}

        <Title>{title}</Title>
      </Wrapper>
      {description && <Description>{description}</Description>}
      {children}
    </Container>
  );
}
