import React, { useEffect, useState } from "react";
import {
  GetTrendingFriends,
  SearchByContract,
  findHoldingsShareData,
  findId,
} from "../../requests/friendCalls";
import { readContract } from "@wagmi/core";
import friendTechABI from "../../abi/FriendTechABi";
import { uintFormat } from "../../formatters/format";
import { useWallets } from "@privy-io/react-auth";
import { config } from "../../config";
import SwapTabs from "./SwapTabs";
import Swapper from "./Swapper";
function NewSwap() {
  //these are used to switch between tabs
  const [viewSwap, setViewSwap] = useState(true);
  const [viewPools, setViewPools] = useState(false);
  const [viewChart, setViewChart] = useState(false);
  const [viewPoolCreator, setViewPoolCreator] = useState(false);
  const [currentShare, setCurrentShare] = useState(null);
  const [currentSharePrice, setCurrentSharePrice] = useState(null);

  //////////////////
  const { wallets } = useWallets();
  const userAddress = wallets[0]?.address;

  const [trendingUsers, setTrendingUsers] = useState(null);
  //this is the users share holdigns with all share data
  const [holdingsData, setHoldingsData] = useState(null);

  useEffect(() => {
    getGoddogShareInfo();
    getUserHoldings();
    getTrending();
  }, []);

  useEffect(() => {
    console.log(currentShare);
    setCurrentSharePrice(uintFormat(currentShare?.displayPrice));
  }, [currentShare]);
  async function getGoddogShareInfo() {
    const goddogShareInfo = await SearchByContract(
      "0x7b202496c103da5bedfe17ac8080b49bd0a333f1"
    );
    console.log(goddogShareInfo);
    setCurrentShare(goddogShareInfo);
  }
  async function getTrending() {
    const trendingFriends = await GetTrendingFriends();
    setTrendingUsers(trendingFriends);
  }
  async function getUserHoldings() {
    const userHoldings = await findId(userAddress);
    const holdingsData = await findHoldingsShareData(
      readContract,
      config,
      friendTechABI,
      userAddress,
      userHoldings
    );
    console.log(holdingsData);

    setHoldingsData(holdingsData);
  }

  return (
    <div className="   mx-auto">
      <div className="w-[400px] mx-auto">
        <SwapTabs
          viewSwap={viewSwap}
          viewChart={viewChart}
          viewPoolCreator={viewPoolCreator}
          setViewChart={setViewChart}
          setViewPoolCreator={setViewPoolCreator}
          setViewSwap={setViewSwap}
          setViewPools={setViewPools}
          viewPools={viewPools}
        />
      </div>
      <div className="  mx-auto">
        {viewSwap ? (
          <Swapper
            trendingFriends={trendingUsers}
            holdingsData={holdingsData}
            getUserHoldings={getUserHoldings}
            getTrending={getTrending}
            currentShare={currentShare}
            setCurrentShare={setCurrentShare}
            currentSharePrice={currentSharePrice}
          />
        ) : (
          <>
            {viewChart ? (
              <div>chart</div>
            ) : (
              <>
                {viewPoolCreator ? (
                  <>
                    <h3>pool maker</h3>
                  </>
                ) : (
                  <>{viewPools ? <>pools</> : null}</>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NewSwap;
