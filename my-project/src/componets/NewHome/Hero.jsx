import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GetTrendingFriends,
  SearchByContract,
} from "../../requests/friendCalls";
import CardBuilder from "./CardBuilder";
import MiddleHome from "./MiddleHome";
import { supabase } from "../../client";
import { LuFileSymlink } from "react-icons/lu";
import { HiArrowPath } from "react-icons/hi2";
function Hero(props) {
  const { heroData, recentTxs, trending } = props;
  return (
    <div className=" p-2 md:w-screen w-screen">
      <div className="grid sm:grid-cols-2 gap-2 md:hidden ">
        <div className=" text-center font-bold font-mono mt-auto mb-auto  p-5 lg:p-20 md:p-10 ">
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
      <div className=" hidden md:block p-10">
        <div className="text-center">
          <h3 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold text-[40px] break">
            SocialFi in the palm of your hands
          </h3>
          <h3 className="text-gray-500 font-mono font-bold text-[15px] break-words md:w-[80%] lg:w-[50%] mx-auto">
            FrenMint offers a cost-effective way to mint ERC-1155 NFTs via
            Friend.Tech shares, providing 31% lower fees for traders and up to
            38% higher revenue for hosts.
          </h3>
        </div>
        <div className=" mt-4 w-[50%] mx-auto">
          <div className="flex justify-center gap-2 text-[12px]">
            <Link
              to={"https://telegra.ph/What-is-FrenMint-06-03"}
              target="_blank"
              className="border border-stone-900  w-[130px] rounded-lg bg-stone-900 p-1"
            >
              <div className="flex justify-center gap-1">
                <LuFileSymlink className="mt-0.5" />
                <h3>Docs</h3>
              </div>
            </Link>
            <Link
              to={"/newswap"}
              className="border border-stone-900  w-[130px] rounded-lg bg-stone-900 p-1"
            >
              <div className="flex justify-center gap-1">
                <HiArrowPath className="mt-0.5" />
                <h3>Mint</h3>
              </div>
            </Link>
            <Link
              to={"https://telegra.ph/GODDOG-Official-Whitepaper-06-01"}
              target="_blank"
              className="border border-stone-900  w-[130px] rounded-lg bg-stone-900 p-1"
            >
              <div className="flex justify-center gap-1">
                <LuFileSymlink className="mt-0.5" />
                <h3>Whitepaper</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <MiddleHome trending={trending} recentTxs={recentTxs} />
      </div>
    </div>
  );
}

export default Hero;
