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
  const videoUrl =
    "https://video.twimg.com/ext_tw_video/1794791753373122560/pu/vid/avc1/1280x720/ynYfJaVL179cmuqA.mp4?tag=12";

  return (
    <div className="md:mt-10">
      <div className="text-center">
        <img
          src="https://pouch.jumpshare.com/preview/9uKzXkh0Laewc8Y-kA6KB5FvpUo_ei-iM563CXEz259Sth04L2zGF7MByluT_mq-t6hHybwlS5QK8_xodZRweIz0S_r5-BEoroGYyBAl-pI"
          alt=""
          className="w-[500px] h-[400px] mx-auto"
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
              className="border border-stone-800 bg-neutral-900 rounded-lg text-white p-2 text-[15px] font-bold hover:bg-white hover:text-black"
              onClick={login}
            >
              FrenMint login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Portal;
