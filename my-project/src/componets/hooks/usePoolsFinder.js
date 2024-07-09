import { useEffect, useState } from "react";
import {
  GetTrendingFriends,
  SearchByUser,
  getUserHoldings,
} from "../../requests/friendCalls";
import {
  getExistingFilteredPools,
  getExistingPools,
} from "../../requests/SudoSwapRequests";

//to make a async hook we must use a useEffect hook withing it
export const usePoolFinder = (currentERC20, userAddress, type) => {
  console.log(currentERC20);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log(currentERC20);

    const findPools = async () => {
      const res = await getExistingFilteredPools(
        userAddress,
        true,
        currentERC20?.address
      );
      setData({ results: res });
    };

    findPools();
  }, [currentERC20, type]);

  return data;
};

//target for tm before i push th ecode do a lot of bug fixes
//might have to make a seperate componet for the pool swap
//checks before pushing

//if this doesnt work we can fix function to filter the pairs itself
