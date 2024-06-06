import propTypes from "prop-types";
import { GetTrendingFriends } from "../requests/friendCalls";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import TrendingFriends from "./TrendingFriends";
import NotableFriends from "./NotableFriends";
import GlobalActivity from "./GlobalActivity";
import { useEffect, useState } from "react";
import RecentTx from "./RecentTx";
function Home() {
  const [loading, setLoading] = useState(true);
  const { wallets } = useWallets();
  const w0 = wallets[0];
  let trendingFriends = GetTrendingFriends();
  const notableTrendingFriends = trendingFriends[0];

  const { user } = usePrivy();
  const width = window.innerWidth;
  const length = window.innerHeight;
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }, []);
  return (
    <div className="">
      <center className="flex justify-center">
        <RecentTx />
      </center>
      <div className="text-[30px] text-center p-5  flex justify-center">
        <img
          src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmNfe9547vPVgd8qqdCFeH81yHos1n1CoQZu1D9n5Nrjvp?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
          alt=""
          style={{ maxWidth: "80%" }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center mt-20 mb-10">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <NotableFriends data={notableTrendingFriends} />
          </div>
          <div className="flex justify-center mt-10 mb-10">
            <TrendingFriends data={trendingFriends} />
          </div>
          {/* <div className="flex justify-center mt-10">
            <GlobalActivity />
          </div> */}
        </>
      )}
    </div>
  );
}

Home.propTypes = {
  data: propTypes.array.isRequired,
};

export default Home;

//tg desktop app dimensions : w- 380, l -557
//ios tg app dimensions: w-428, l-734
