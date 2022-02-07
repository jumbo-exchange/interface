import styled from 'styled-components';
import { ReactComponent as PlaceHolderLoader } from 'assets/images-app/placeholder-loader.svg';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';
import { Modal } from '../styles';

export const LiquidityModalContainer = styled(Modal)`
  max-width: 500px;
`;

export const ModalTitle = styled.h2`
  flex: 1;
  font-style: normal;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.75rem;
  margin-block-start: 0;
  margin-block-end: 0;
  text-align: center;
  color: ${({ theme }) => theme.globalWhite};
`;

export const ModalBody = styled.div`
  margin: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const LogoContainerAdd = styled(AddIcon)`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  align-self: center;
`;

export const RefreshBlock = styled.div`
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  margin: 1rem .75rem;
`;

export const PlaceHolderGif = styled(PlaceHolderLoader)`
  margin-right: .438rem;
`;

export const LogoButton = styled(AddIcon)`
  width: 12px;
  height: 12px;
  margin-right: .625rem;
`;
