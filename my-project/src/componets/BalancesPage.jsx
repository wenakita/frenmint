import React, { useEffect, useState } from "react";
import Balances from "./Balances";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useBalance } from "wagmi";
function BalancesPage() {
  const { exportWallet } = usePrivy();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }, []);

  const { wallets } = useWallets();
  const w0 = wallets[0];
  const userAddress = w0?.address;
  const ETHBalance = useBalance({
    address: userAddress,
  });

  return (
    <div className="mb-20">
      {loading ? (
        <div className="flex justify-center mt-[250px] mb-10">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <div>
          <div className="text-[30px] text-center p-5  flex justify-center">
            <img
              src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmNfe9547vPVgd8qqdCFeH81yHos1n1CoQZu1D9n5Nrjvp?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
              alt=""
              style={{ maxWidth: "80%" }}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="text-white border border-slate-500 p-2 rounded-xl hover:bg-white hover:text-black"
              onClick={exportWallet}
            >
              Export Wallet
            </button>
          </div>
          <div className="mt-10">
            <h3 className="text-white flex justify-center font-mono font-bold text-[8px] text-center">
              Your unique deposit address: {w0?.address}
            </h3>
          </div>
          <div className="text-center">
            <h3 className="text-white text-[10px] font-mono mt-2">
              ETH Balance: {ETHBalance?.data?.formatted}
            </h3>
          </div>
          <h3 className="text-white text-center mt-10 font-mono font-bold mb-3">
            Your balances
          </h3>
          <center className="mt-2 ">
            <Balances />
          </center>
        </div>
      )}
    </div>
  );
}

export default BalancesPage;
