import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GetTrendingFriends,
  SearchByContract,
} from "../../requests/friendCalls";
import CardBuilder from "./CardBuilder";
import MiddleHome from "./MiddleHome";
import { supabase } from "../../client";
function Hero(props) {
  const { heroData, recentTxs, trending } = props;
  return (
    <div className=" p-2 md:w-screen w-screen">
      <div className="grid sm:grid-cols-2 gap-2 ">
        <div className=" text-center font-bold font-mono mt-auto mb-auto p-5 lg:p-20 md:p-10">
          <h3 className="text-white text-[18px] md:text-[25px] lg:text-[30px]">
            Empower Liquidity Through SocialFi
          </h3>
          <h3 className="text-stone-600 text-[13px] md:text-[12px] lg:text-[14px] mt-1 text-center">
            FrenMint offers a cost-effective way to mint ERC-1155 NFTs via
            Friend.Tech shares, providing 31% lower fees for traders and up to
            38% higher revenue for hosts.
          </h3>
          <div className="relative inline-flex  group mt-5 md:mt-10">
            <div className="absolute transitional-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <Link
              to={"/newswap"}
              title="Get quote now"
              className="relative inline-flex items-center justify-center px-8 py-2  font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 text-[10px]"
              role="button"
            >
              Begin Minting
            </Link>
          </div>
        </div>

        <div className=" p-4 md:p-5 md:me-10 place-content-center ">
          {heroData ? (
            <>
              <div className="">
                <CardBuilder data={heroData} isHero={true} />
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="mt-4">
        <MiddleHome trending={trending} recentTxs={recentTxs} />
      </div>
    </div>
  );
}

export default Hero;
