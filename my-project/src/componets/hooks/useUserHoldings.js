import { useEffect, useState } from "react";
import { getUserHoldings } from "../../requests/friendCalls";

//to make a async hook we must use a useEffect hook withing it
export const useUserHoldings = (userAddress) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const findData = async () => {
      const holdingsData = await getUserHoldings(userAddress);
      console.log(holdingsData);
      setData(holdingsData);
    };
    if (userAddress) {
      findData();
    }
  }, [userAddress]);

  return data;
};

//target for tm before i push th ecode do a lot of bug fixes
//might have to make a seperate componet for the pool swap
//checks before pushing
