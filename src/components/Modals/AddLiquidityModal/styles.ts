import styled from 'styled-components';
import { ReactComponent as PlaceHolderLoader } from 'assets/images-app/placeholder-loader.svg';
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

export const LogoContainerAdd = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
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

export const AcceptBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem .75rem 2.25rem;
`;

export const LabelAccept = styled.label`
  display: flex;
  font-style: normal;
  font-weight: normal;
  font-size: 0.75rem;
  line-height: 17px;
  color: ${({ theme }) => theme.globalWhite};
  position: relative;
  cursor: pointer;
  user-select: none;
  &::before {
    position: absolute;
    color: ${({ theme }) => theme.globalGrey};
    clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%);
    text-decoration: line-through;
    text-decoration-thickness: 3px;
    text-decoration-color: $black;
    transition: clip-path 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  & > span {
    margin-left: 12px;
  }
`;

export const InputAccept = styled.input`
  position: relative;
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.globalWhite};
  border: 1px solid ${({ theme }) => theme.globalGrey};
  border-radius: 6px;
  appearance: none;
  outline: 0;
  cursor: pointer;
  padding: 8px 8px;
  margin: 0;
  &::before {
    position: absolute;
    content: '';
    display: none;
    top: 1px;
    left: 5px;
    width: 4px;
    height: 10px;
    border-style: solid;
    border-color: ${({ theme }) => theme.globalWhite};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  &:checked {
    color: ${({ theme }) => theme.globalWhite};
    &::before {
      display: block;
    }
  }
`;

export const DescriptionAccept = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: .75rem;
  line-height: 1.063rem;
  color: ${({ theme }) => theme.globalGrey};
  margin-top: .5rem;
  margin-left: 1.875rem;
`;
