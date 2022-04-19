import React, { Dispatch, SetStateAction } from 'react';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import styled from 'styled-components';
import { useModalsStore } from 'store';
import { getUpperCase } from 'utils';
import { ReactComponent as IconArrowDown } from 'assets/images-app/icon-arrow-down.svg';
import FungibleTokenContract from 'services/contracts/FungibleToken';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 22px 12px 12px;
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 10px 16px 10px 10px;
  }
  `};
  :hover {
    border: 2px solid ${({ theme }) => theme.pink};
    padding: 11px 21px 11px 11px;
    cursor: pointer;
    & > svg:last-child {
      transform: translateY(60%);
      transition: all .2s ease-out;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 9px 15px 9px 9px;
    }
  `};
  }
`;

const LogoContainer = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 12px;
  transition: all 1s ease-out;
  height: 2.375rem;
  min-width: 2.375rem;
  & > img {
    border-radius: 12px;
    height: 2.25rem;
    width: 2.25rem;
    transition: all 1s ease-out;
  }
`;

const TitleToken = styled.div`
  flex: 1;
  font-style: normal;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ArrowDown = styled(IconArrowDown)`
  margin-left: 0.875rem;
`;

export default function TokenBlock(
  {
    token,
    setToken,
  }:{
    token: FungibleTokenContract | null,
    setToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;
  },

) {
  const { setSearchModalOpen } = useModalsStore();
  return (
    <Container onClick={() => setSearchModalOpen({
      isOpen: true,
      activeToken: token,
      setActiveToken: setToken,
    })}
    >
      <LogoContainer>
        <img src={token?.metadata?.icon ?? tokenLogo} alt={token?.metadata.symbol} />
      </LogoContainer>
      <TitleToken>
        {getUpperCase(token?.metadata.symbol ?? '')}
      </TitleToken>
      <ArrowDown />
    </Container>
  );
}
