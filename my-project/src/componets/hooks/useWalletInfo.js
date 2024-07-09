import { useAccount, useBalance } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { base } from "wagmi/chains";
import { getTokenBalance } from "../swapv2/contract_calls/contractReads";
import GodDogABI from "../../abi/GodDogABI";
import OfficialFriendTokenABI from "../../abi/OfficialFriendTokenABI";
//to make a async hook we must use a useEffect hook withing it
export const useWalletInfo = (currentERC20) => {
  const { wallets } = useWallets();
  const [walletData, setWalletData] = useState(null);
  const goddogBalanceResult = useBalance({
    address: wallets[0]?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });

  const friendBalance = useBalance({
    address: wallets[0]?.address,
    token: "0x0bD4887f7D41B35CD75DFF9FfeE2856106f86670",
    chainId: base.id,
  });

  const ethBal = useBalance({
    address: wallets[0]?.address,
    chainId: base.id,
  });
  console.log(ethBal);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (wallets.length === 0) return;

      const provider = await wallets[0]?.getEthersProvider();
      const network = await provider.getNetwork();
      const signer = await provider?.getSigner();
      const goddogBalanceCA = await getTokenBalance(
        "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
        GodDogABI,
        wallets[0]?.address
      );
      const friendBalanceCA = await getTokenBalance(
        "0x0bD4887f7D41B35CD75DFF9FfeE2856106f86670",
        OfficialFriendTokenABI,
        wallets[0]?.address
      );
      console.log(goddogBalanceCA);
      const data = {
        address: wallets[0]?.address,

        signer: signer,
        network: network?.chainId,
        goddogbalance: goddogBalanceCA,
        ethBal: Number(ethBal?.data?.formatted).toFixed(6),
        friendBalance: friendBalanceCA,
      };
      console.log(data);
      setWalletData(data);
    };

    fetchUserInfo();
  }, [wallets]);

  return walletData;
};
