import React, { useEffect, useState } from "react";
import {
  GetTrendingFriends,
  SearchByContract,
  findHoldingsShareData,
  findId,
  formatChartData,
} from "../../requests/friendCalls";
import { readContract } from "@wagmi/core";
import friendTechABI from "../../abi/FriendTechABi";
import { uintFormat } from "../../formatters/format";
import { useWallets } from "@privy-io/react-auth";
import { config } from "../../config";
import SwapTabs from "./SwapTabs";
import Swapper from "./Swapper";
import { getShareChartData } from "../../requests/friendCalls";
import SwapCharts from "./SwapCharts";
import _ from "lodash";
import { getEthPrice } from "../../requests/priceCalls";
import PoolSwap from "./PoolSwap";
import CreatePool from "./CreatePool";

function NewSwap() {
  //these are used to switch between tabs
  const [viewSwap, setViewSwap] = useState(true);
  const [viewPools, setViewPools] = useState(false);
  const [viewChart, setViewChart] = useState(false);
  const [viewPoolCreator, setViewPoolCreator] = useState(false);
  const [currentShare, setCurrentShare] = useState(null);
  const [currentSharePrice, setCurrentSharePrice] = useState(null);
  const [currentPriceHistory, setCurrentPriceHistory] = useState(null);
  const [shareTotalVolume, setShareTotalVolume] = useState(null);
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
    setCurrentPriceHistory(null);
    setCurrentSharePrice(uintFormat(currentShare?.displayPrice));
    getChart();
  }, [currentShare]);
  async function getGoddogShareInfo() {
    const goddogShareInfo = await SearchByContract(
      "0x7b202496c103da5bedfe17ac8080b49bd0a333f1"
    );
    console.log(goddogShareInfo);
    setCurrentShare(goddogShareInfo);
  }

  async function getChart() {
    const ethPrice = await getEthPrice();
    const priceHistory = await getShareChartData(currentShare?.address);
    // const formattedPriceHistory = await formatChartData(priceHistory);
    console.log(priceHistory);
    const orderedPriceHistory = _.orderBy(priceHistory, ["date"]);
    let totalVolume = 0;
    for (const key in priceHistory) {
      const currentData = priceHistory[key];
      console.log(currentData?.priceAtDate);
      console.log(Math.round(Number(currentData?.priceAtDate) * ethPrice));
      totalVolume += Math.round(Number(currentData?.priceAtDate) * ethPrice);
    }
    setShareTotalVolume(totalVolume);

    setCurrentPriceHistory(orderedPriceHistory);
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
              <SwapCharts
                currentPriceHistory={currentPriceHistory}
                currentShare={currentShare}
                currentSharePrice={currentSharePrice}
                shareTotalVolume={shareTotalVolume}
              />
            ) : (
              <>
                {viewPoolCreator ? (
                  <CreatePool
                    holdingsData={holdingsData}
                    setCurrentShare={setCurrentShare}
                  />
                ) : (
                  <>
                    {viewPools ? (
                      <PoolSwap
                        currentShare={currentShare}
                        setCurrentShare={setCurrentShare}
                      />
                    ) : null}
                  </>
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
