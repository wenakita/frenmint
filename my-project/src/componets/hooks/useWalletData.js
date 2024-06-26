import React, { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";

export const useWalletData = () => {
  const { wallets } = useWallets();
  const currentWallet = wallets[0];
  const [userData, setUserData] = useState(null);
  const [permissionData, setPermissionData] = useState({});

  useEffect(() => {
    const getWalletSigner = async (wallet) => {
      const currentProvider = await wallet?.getEthersProvider();
      const currentSigner = currentProvider?.getSigner();
      setPermissionData({
        currentProvider,
        currentSigner,
      });
    };
    getWalletSigner(currentWallet);
    setUserData({
      address: currentWallet?.address,
      permissions: {
        permissionData,
      },
    });
  }, []);

  return userData;
};

// async function getWalletSigner(provider) {
//   return provider?.getSigner();
// }
