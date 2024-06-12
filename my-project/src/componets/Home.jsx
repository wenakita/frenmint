import propTypes from "prop-types";
import { GetTrendingFriends } from "../requests/friendCalls";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import TrendingFriends from "./TrendingFriends";
import NotableFriends from "./NotableFriends";
import GlobalActivity from "./GlobalActivity";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RecentTx from "./RecentTx";
import { supabase } from "../client";
import { postMessageData, createUserName } from "../requests/supaBaseHandler";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
function Home() {
  const [currentUserName, setCurrentuserName] = useState(null);
  const [hasUserName, setHasUserName] = useState(false);
  const [trendingFriends, setTrendingFriends] = useState(null);
  const [notableTrendingFriends, setNotableTrendingFriends] = useState(null);
  const [userNameInput, setUserNameInput] = useState(null);
  const [openModal, setOpenModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const { wallets } = useWallets();
  const w0 = wallets[0];

  const { user } = usePrivy();
  const width = window.innerWidth;
  const length = window.innerHeight;
  useEffect(() => {
    getTrending();
    setTimeout(() => {
      setLoading(false);
    }, [2400]);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function getTrending() {
    const trending = await GetTrendingFriends();
    console.log(trending);
    setTrendingFriends(trending);
    setNotableTrendingFriends(trending[0]);
  }

  async function fetchMessages() {
    let isFound = false;
    const { data, error } = await supabase.from("usernames").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      for (const key in data) {
        if (data[key]?.user_address === w0?.address) {
          isFound = true;

          console.log("true");
          setCurrentuserName(data[key]?.userName);
        }
      }

      if (isFound) {
        console.log("found");
        setOpenModal(false);
      } else {
        console.log(" not found");

        setOpenModal(true);
      }
    }
  }
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
            <div className="flex justify-center">
              <img
                src="https://i.ibb.co/wzQ9PG5/719shots-so.png"
                alt=""
                style={{ width: "70%" }}
                className=""
              />
            </div>
          </div>

          <div className="flex justify-center">
            <NotableFriends data={notableTrendingFriends} />
          </div>
          <div className="overflow-x-hidden mt-10 mb-10">
            <TrendingFriends data={trendingFriends} />
          </div>
          {/* <div className="flex justify-center mt-10">
            <GlobalActivity />
          </div> */}
          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gradient-to-br from-stone-950">
              <DialogPanel className="w-[350px] h-[200px] text-white border border-slate-500 rounded-lg bg-black p-2">
                <DialogTitle className="font-bold flex justify-start mb-5">
                  <img
                    src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
                    alt=""
                    className="2-5 h-5 rounded-full"
                  />
                  Create a username
                </DialogTitle>
                <label htmlFor="" className="text-[10px] ms-4">
                  Enter name
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    className="border-slate-500 bg-stone-900 w-[300px] rounded-lg"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setUserNameInput(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-center mt-5">
                  <button
                    className="border border-slate-500 rounded-lg p-1 text-white text-[10px]"
                    onClick={async () => {
                      const isCreated = await createUserName(
                        supabase,
                        userNameInput,
                        w0?.address
                      );
                      if (isCreated) {
                        setHasUserName(true);
                        setCurrentuserName(userNameInput);
                      }
                    }}
                  >
                    Create Username
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
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
