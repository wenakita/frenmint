import React, { useEffect, useState } from "react";
import {
  GetTrendingFriends,
  SearchByContract,
} from "../../requests/friendCalls";
import { getRecentTx } from "../../requests/supaBaseHandler";
import Faq from "./Faq";
import Hero from "./Hero";
import Socials from "./Socials";

function NewHomePage() {
  const [heroData, setHeroData] = useState(null);
  const [trending, setTrending] = useState(null);
  const [recentTxs, setRecentTxs] = useState(null);
  useEffect(() => {
    getHeroData();
  }, []);

  async function getHeroData() {
    const trendingResult = await GetTrendingFriends();
    const res = await getRecentTx();
    const result = await SearchByContract(
      "0x03d5a5ff92d2078ed2cbb67eecb72c15429b41f9"
    );
    setRecentTxs(res);
    setTrending(trendingResult);
    setHeroData(result);
  }

  return (
    <div>
      {!trending && !recentTxs ? (
        <div className="flex justify-center mb-10 mt-[300px]">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <>
          <Hero trending={trending} heroData={heroData} recentTxs={recentTxs} />
          <div className="ms-auto">
            <Faq />
          </div>
          <div className="mt-5">
            <Socials />
          </div>
        </>
      )}
    </div>
  );
}

export default NewHomePage;
