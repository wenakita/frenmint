import { useAccount, useBalance } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { base } from "wagmi/chains";

//to make a async hook we must use a useEffect hook withing it
export const usePoolBalance = (currentShare) => {
  const [data, setData] = useState(null);

  const poolBalance = useBalance({
    address: currentShare?.sudoSwapData?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });

  useEffect(() => {
    const fetchPoolBalance = async () => {
      setData(poolBalance?.data?.formatted);
    };

    fetchPoolBalance();
  }, [poolBalance, currentShare]);

  console.log(data);

  return data;
};
