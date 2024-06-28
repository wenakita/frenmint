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
import { useLocation } from "react-router-dom";
import ShareSender from "./ShareSender";
import { useBalance } from "wagmi";
import { base } from "wagmi/chains";
import Pods from "./Pods";
import MdSwapperSide from "./MdSwapperSide";

function NewSwap() {
  const location = useLocation();
  console.log(location?.state);

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
    console.log(location?.state?.userData);
    if (location?.state) {
      console.log(location?.state?.userData);
      if (location?.state?.data !== null) {
        setCurrentShare(location?.state);
      }
      if (location?.state?.userData !== null) {
        setCurrentShare(location?.state?.userData);
      }
    } else if (location?.state === null) {
      getGoddogShareInfo();
    }
  }, [location?.state]);

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
                        ) : (
                          <>{viewPods ? <Pods /> : null}</>
                        )}
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
