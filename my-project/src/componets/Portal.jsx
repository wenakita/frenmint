import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import { useBalance } from "wagmi";
function Portal() {
  const navigate = useNavigate();
  const {
    login,
    logout,
    ready,
    authenticated,
    user,
    connectWallet,
    linkEmail,
  } = usePrivy();
  const wallet = user?.wallet;
  const address = wallet?.address;
  const userEthBalance = useBalance({
    address: wallet?.address,
  });
  useEffect(() => {
    if ((authenticated && wallet) || (ready && authenticated)) {
      navigate("/home");
    }
  });
  return (
    <div className="mt-20 mb-20">
      <div className="flex justify-center">
        <img
          src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmVg8EcB3EE9GTNbjF6uvrcQ3i8QG6TRhYT8Aa3SmmXNBX?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
          alt=""
          style={{ maxWidth: "80%" }}
        />
      </div>

      <div className="flex justify-center mt-10">
        {(authenticated && wallet) || (ready && authenticated) ? (
          <button
            className="border border-slate-500 rounded-lg text-white p-2 text-[20px] hover:bg-white hover:text-black"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className="border border-slate-500 rounded-lg text-white p-2 text-[20px] hover:bg-white hover:text-black"
              onClick={login}
            >
              FrenMint Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Portal;
