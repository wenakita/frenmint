import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GetTrendingFriends,
  SearchByContract,
} from "../../requests/friendCalls";
import CardBuilder from "./CardBuilder";
import MiddleHome from "./MiddleHome";
import { supabase } from "../../client";
import Hero from "./Hero";
import Faq from "./Faq";
import Socials from "./Socials";
import { useWalletData } from "../hooks/useWalletData";
import _ from "lodash";

function NewHomePage() {
  const testing = useWalletData();
  console.log(testing);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState(null);
  const [trending, setTrending] = useState(null);
  const [recentTxs, setRecentTxs] = useState(null);
  useEffect(() => {
    getHeroData();
  }, []);

  async function getRecentTx() {
    const { data, error } = await supabase.from("txs").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      const formattedData = [];
      console.log(data);
      for (const key in data) {
        const res = await SearchByContract(data[key]?.share_address);
        formattedData.push(res);
      }
      console.log(formattedData);

      setRecentTxs(formattedData);
    }
  }
  async function getTrending() {
    const result = await GetTrendingFriends();
    setTrending(result);
  }
  async function getHeroData() {
    getTrending();
    getRecentTx();
    const result = await SearchByContract(
      "0x03d5a5ff92d2078ed2cbb67eecb72c15429b41f9"
    );
    console.log(result);

    setHeroData(result);
  }
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, [2500]);
  }, [recentTxs]);
  return (
    <div>
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
