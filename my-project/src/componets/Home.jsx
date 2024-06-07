import propTypes from "prop-types";
import { GetTrendingFriends } from "../requests/friendCalls";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import TrendingFriends from "./TrendingFriends";
import NotableFriends from "./NotableFriends";
import GlobalActivity from "./GlobalActivity";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      {loading ? (
        <div className="flex justify-center mb-10 mt-[300px]">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <>
          <center className="flex justify-center">
            <RecentTx />
          </center>
          <div className=" text-center p-2 mt-5">
            <h3 className="text-white font-mono font-bold">
              Socialfi in the palm of your hands
            </h3>
            <div className="flex justify-center">
              <h3 className="text-stone-600 text-[8px] font-mono font-bold text-center  w-[300px] ">
                Trade thoushands of friend.tech users instantly on frenmint and
                increase your liquidity at the same time
              </h3>
            </div>

            <motion.div
              className="flex justify-center"
              style={{
                width: 410,
                height: 200,
                borderRadius: 8,

                align: "center",
                cursor: "pointer",
              }}
              animate={["initial"]}
              whileHover={["grow"]}
              variants={{
                grow: {
                  scale: 1.1,
                },
                rotate: {
                  rotate: [null, -5, 5, 0],
                  transition: {
                    // delay,
                    duration: 10,
                    // repeat: Infinity,
                    // repeatDelay: 0.2,
                    // repeatType: "reverse"
                  },
                },
                initial: {
                  y: [-20, 20],
                  rotate: 0,
                  transition: {
                    delay: 0.6,
                    duration: 2,
                    repeat: Infinity,
                    // repeatDelay: 0.2,
                    repeatType: "reverse",
                  },
                },
              }}
            >
              <img
                src="https://i.ibb.co/wzQ9PG5/719shots-so.png"
                alt=""
                style={{ width: "60%" }}
              />
            </motion.div>
          </div>

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
