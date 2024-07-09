import { useAccount } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import {
  GetTrendingFriends,
  getChart,
  getUserHoldings,
} from "../../requests/friendCalls";

//to make a async hook we must use a useEffect hook withing it
export const useShareInfo = (currentShare, userAddress) => {
  console.log(currentShare, userAddress);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getCurrentShareData = async () => {
      const trendingResult = await GetTrendingFriends();
      const res = await getChart(currentShare?.address);

      setData({
        chart: res?.history,
        volume: res?.volume,
      });
    };

    getCurrentShareData();
  }, [currentShare, userAddress]);

  return data;
};
