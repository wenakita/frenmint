import { useWallets } from "@privy-io/react-auth";
import { readContract } from "@wagmi/core";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import friendTechABI from "../../abi/FriendTechABi";
import { config } from "../../config";
import { uintFormat } from "../../formatters/format";
import {
  GetTrendingFriends,
  SearchByContract,
  findHoldingsShareData,
  findId,
  getShareChartData,
} from "../../requests/friendCalls";
import { getEthPrice } from "../../requests/priceCalls";
import CreatePool from "./CreatePool";
import PoolSwap from "./PoolSwap";
import ShareSender from "./ShareSender";
import SwapCharts from "./SwapCharts";
import SwapTabs from "./SwapTabs";
import Swapper from "./Swapper";

function NewSwap(props) {
  // document.getElementById("my_modal_300").showModal();  works every where

  const location = useLocation();
  //these are used to switch between tabs
  const [viewSwap, setViewSwap] = useState(true);
  const [viewPools, setViewPools] = useState(false);
  const [viewChart, setViewChart] = useState(false);
  const [viewPoolCreator, setViewPoolCreator] = useState(false);
  const [viewSend, setViewSend] = useState(false);
  const [viewPods, setViewPods] = useState(false);
  const [viewLending, setViewLending] = useState(false);

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
    getUserHoldings();
    getTrending();
  }, []);
  useEffect(() => {
    if (location?.state) {
      if (location?.state?.userData !== null) {
        setCurrentShare(location?.state?.userData);
      }
    } else if (location?.state === null) {
      getGoddogShareInfo();
    }
  }, [location?.state]);

  useEffect(() => {
    setCurrentPriceHistory(null);
    setCurrentSharePrice(uintFormat(currentShare?.displayPrice));
    getChart();
  }, [currentShare]);
  async function getGoddogShareInfo() {
    const goddogShareInfo = await SearchByContract(
      "0x7b202496c103da5bedfe17ac8080b49bd0a333f1"
    );
    setCurrentShare(goddogShareInfo);
  }

  async function getChart() {
    const ethPrice = await getEthPrice();
    const priceHistory = await getShareChartData(currentShare?.address);
    // const formattedPriceHistory = await formatChartData(priceHistory);
    const orderedPriceHistory = _.orderBy(priceHistory, ["date"]);
    let totalVolume = 0;
    for (const key in priceHistory) {
      const currentData = priceHistory[key];
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
    setHoldingsData(null);
    const userHoldings = await findId(userAddress);
    const holdingsData = await findHoldingsShareData(
      readContract,
      config,
      friendTechABI,
      userAddress,
      userHoldings
    );

    setHoldingsData(holdingsData);
  }

  return (
    <div className="mt-5   mx-auto">
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
          setViewSend={setViewSend}
          viewSend={viewSend}
          viewLending={viewLending}
          setViewLending={setViewLending}
          setViewPods={setViewPods}
          viewPods={viewPods}
        />
      </div>
      <div className="  mx-auto">
        {viewSwap ? (
          <div className="">
            <div>
              <Swapper
                trendingFriends={trendingUsers}
                holdingsData={holdingsData}
                getUserHoldings={getUserHoldings}
                getTrending={getTrending}
                currentShare={currentShare}
                setCurrentShare={setCurrentShare}
                currentSharePrice={currentSharePrice}
                currentPriceHistory={currentPriceHistory}
                shareTotalVolume={shareTotalVolume}
              />
            </div>
          </div>
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
                    currentPriceHistory={currentPriceHistory}
                    currentShare={currentShare}
                    shareTotalVolume={shareTotalVolume}
                    getUserHoldings={getUserHoldings}
                  />
                ) : (
                  <>
                    {viewPools ? (
                      <PoolSwap
                        currentShare={currentShare}
                        setCurrentShare={setCurrentShare}
                        holdingsData={holdingsData}
                        currentPriceHistory={currentPriceHistory}
                        shareTotalVolume={shareTotalVolume}
                      />
                    ) : (
                      <>
                        {viewSend ? (
                          <ShareSender holdingsData={holdingsData} />
                        ) : null}
                      </>
                    )}
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
