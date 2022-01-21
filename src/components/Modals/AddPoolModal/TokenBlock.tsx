import React from 'react';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import styled from 'styled-components';
import { IToken, TokenType, useModalsStore } from 'store';
import { getUpperCase } from 'utils';
import { ReactComponent as IconArrowDown } from 'assets/images-app/icon-arrow-down.svg';

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
  `}
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
  `}
  }
`;

const LogoToken = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  & > img {
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
  { token, tokenType }:{ token: IToken | null, tokenType: TokenType},
) {
  const { setSearchModalOpen } = useModalsStore();
  return (
    <Container onClick={() => setSearchModalOpen({ isOpen: true, tokenType })}>
      <LogoToken>
        <img src={token?.metadata?.icon ?? tokenLogo} alt={token?.metadata.symbol} />
      </LogoToken>
      <TitleToken>
        {getUpperCase(token?.metadata.symbol ?? '')}
      </TitleToken>
      <ArrowDown />
    </Container>
  );
}
