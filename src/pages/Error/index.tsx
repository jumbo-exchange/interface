import React from 'react';
import styled from 'styled-components';
import gif from 'assets/gif/400.gif';
import { ButtonSecondary } from 'components/Button';
import { ReactComponent as Back } from 'assets/images-app/icon-back.svg';
import { useNavigate } from 'react-router-dom';

const ContainerError = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  & > div {
    max-width: 290px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const GifError = styled.img`
  width: 168px;
  height: 130px;
`;

const TitleError = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 2rem;
  line-height: 2.375rem;
  color: ${({ theme }) => theme.globalWhite};
  margin-top: 4.5rem;
  margin-bottom: .5rem;
`;

const LabelError = styled.p`
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.188rem;
  text-align: center;
  color: ${({ theme }) => theme.globalGrey};
  margin-top: 0;
  margin-bottom: 2rem;
`;

const IconBack = styled(Back)`
  margin-right: .813rem;
`;

const ButtonBack = styled(ButtonSecondary)`
  padding: 1.25rem 1.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: .8rem 1rem;
    font-size: .875rem;
    line-height: 1.063rem;
  `}
`;

export default function Error() {
  const navigate = useNavigate();

  const titleError = '404 Error';
  const labelError = 'The page you’re looking for is now beyond our reach';

  return (
    <ContainerError>
      <div>
        <GifError src={gif} alt="gif" />
        <TitleError>{titleError}</TitleError>
        <LabelError>{labelError}</LabelError>
        <ButtonBack
          onClick={() => {
            navigate('/');
          }}
        >
          <IconBack />Back Home
        </ButtonBack>
      </div>
    </ContainerError>
  );
}
