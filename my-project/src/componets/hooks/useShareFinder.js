import { useEffect, useState } from "react";
import {
  GetTrendingFriends,
  SearchByUser,
  getUserHoldings,
} from "../../requests/friendCalls";
import { getExistingPools } from "../../requests/SudoSwapRequests";

//to make a async hook we must use a useEffect hook withing it
export const useShareFinder = (
  searchInput,
  userAddress,
  type,
  currentERC20
) => {
  console.log(type);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log(currentERC20);

    const findShares = async () => {
      let res;

      if (searchInput) {
        res = await SearchByUser(searchInput);
        if (res) {
          console.log(res.length);
        }
      } else {
        res = await GetTrendingFriends();
      }

      return { results: res };
    };

    const getHoldings = async () => {
      const holdingsData = await getUserHoldings(userAddress);

      console.log(holdingsData);
      return { results: null };
    };

    const findData = async () => {
      if (type[0] === "Mint" || type[0] === "Pool") {
        const res = await findShares();
        console.log(res);
        setData(res);
      }
    };
    findData();
  }, [searchInput, type]);

  return data;
};

//target for tm before i push th ecode do a lot of bug fixes
//might have to make a seperate componet for the pool swap
//checks before pushing
