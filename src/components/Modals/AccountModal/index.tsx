import React from 'react';
import styled from 'styled-components';
import getConfig from 'services/config';
import nearLogo from 'assets/images-app/near.svg';
import { useModalsStore, useStore } from 'store';
import { ReactComponent as CloseIcon } from 'assets/images-app/close.svg';
import { ReactComponent as RightArrow } from 'assets/images-app/right-arrow.svg';
import { ReactComponent as WalletImage } from 'assets/images-app/wallet.svg';
import { ButtonSecondary, ButtonFourth } from 'components/Button';
import { wallet as nearWallet } from 'services/near';
import { useTranslation } from 'react-i18next';
import {
  Modal, Layout, ModalBlock, ModalTitle, ModalIcon,
} from '../styles';

const NewModal = styled(Modal)`
  margin: 0 1rem;
  min-width: 360px;
`;

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
    width: 100%;
    padding: 1.156rem;
  }
`;

const WalletIcon = styled(WalletImage)`
  margin-right: .313rem;
`;

export default function AccountModal() {
  const { wallet, setWallet } = useStore();
  const { isAccountModalOpen, setAccountModalOpen } = useModalsStore();
  const { t } = useTranslation();

  const headerTitle = wallet ? t('accountModal.yourWallet') : t('accountModal.connectWallet');
  const config = getConfig();

  return (
    <>
      {isAccountModalOpen && (
      <Layout onClick={() => setAccountModalOpen(false)}>
        <NewModal onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              {headerTitle}
            </ModalTitle>
            <ModalIcon onClick={() => setAccountModalOpen(false)}>
              <CloseIcon />
            </ModalIcon>
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
                <WalletRow onClick={() => nearWallet.requestSignIn(config.farmContractId)}>
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
              <WalletIcon /> {t('accountModal.disconnect')}
            </ButtonSecondary>
          </ModalFooter>
          )}
        </NewModal>
      </Layout>
      )}
    </>
  );
}
