import React from 'react';
import styled from 'styled-components';
import { useModalsStore, useStore } from 'store';
import { ReactComponent as CloseIcon } from 'assets/images-app/close.svg';
import nearLogo from 'assets/images-app/near.svg';
import { ReactComponent as RightArrow } from 'assets/images-app/right-arrow.svg';
import { ButtonSecondary, ButtonFourth } from 'components/Button';
import { wallet as nearWallet } from 'services/near';
import getConfig from 'services/config';
import {
  Modal, Layout, ModalBlock, ModalTitle, ModalClose,
} from '../styles';

const NewModalBlock = styled(ModalBlock)`
  margin: 0 1.5rem .5rem 1.5rem;
  flex-direction: column;
`;

const WalletRow = styled(ButtonFourth)`
  background-color: ${({ theme }) => theme.BgCardGrey};
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const WalletTitle = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  line-height: 140.38%;
  & > img {
    width: 2rem;
    height: 2rem;
    margin-right: 16px;
  }
`;

const ModalFooter = styled.div`
  margin: 1.5rem;
  & > button {
    color: ${({ theme }) => theme.pink};
    width: 100%;
    padding: 1.156rem;
  }
`;

export default function AccountModal() {
  const { wallet, setWallet } = useStore();
  const { isAccountModalOpen, setAccountModalOpen } = useModalsStore();

  const headerTitle = wallet ? 'Your account' : 'Connect wallet';
  const config = getConfig();

  return (
    <>
      {isAccountModalOpen && (
      <Layout onClick={() => setAccountModalOpen(false)}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              {headerTitle}
            </ModalTitle>
            <ModalClose onClick={() => setAccountModalOpen(false)}>
              <CloseIcon />
            </ModalClose>
          </ModalBlock>
          <NewModalBlock>
            {wallet
              ? (
                <WalletRow>
                  <WalletTitle>
                    <img src={nearLogo} alt="logo" />
                    {wallet ? wallet.account().accountId : 'Near'}
                  </WalletTitle>
                  {!wallet && <RightArrow />}
                </WalletRow>
              )
              : (
                <WalletRow onClick={() => nearWallet.requestSignIn(config.contractId)}>
                  <WalletTitle>
                    <img src={nearLogo} alt="logo" />
                    Near
                  </WalletTitle>
                  <RightArrow />
                </WalletRow>
              )}
          </NewModalBlock>
          {wallet && (
          <ModalFooter>
            <ButtonSecondary onClick={() => {
              nearWallet.signOut();
              setWallet(null);
            }}
            >
              Disconnect
            </ButtonSecondary>
          </ModalFooter>
          )}
        </Modal>
      </Layout>
      )}
    </>
  );
}
