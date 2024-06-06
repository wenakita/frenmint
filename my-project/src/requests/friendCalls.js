import { useState, useEffect } from "react";
const jwt = import.meta.env.VITE_FRIEND_TECH_JWT;
console.log(jwt);
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-api-key": "3652122689914635ac7806c7547255fe",
  },
};
const debankOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    AccessKey: "ff780c99533c7de9d82cc0b5826e8fc1ca114207",
  },
};

export function GetTrendingFriends() {
  const [trendingUsers, setTrendingUsers] = useState([]);
  useEffect(() => {
    fetch("https://prod-api.kosetto.com/lists/top-by-price")
      .then(function (results) {
        return results.json();
      })
      .then(function (data) {
        setTrendingUsers(data.users);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return trendingUsers;
}

export async function getTrending() {
  const res = await fetch("https://prod-api.kosetto.com/lists/top-by-price");
  const trendingUsers = await res.json();

  return trendingUsers;
}

export async function SearchByContract(address) {
  try {
    const response = await fetch(
      `https://prod-api.kosetto.com/users/${address}`,
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg5MjQ1ZDRlNzg5Y2Y5ZWY0YTJhZDE4MDJhZDlmODZkZWQzNGVjZGNiIiwiaWF0IjoxNzE1MDM5OTAwLCJleHAiOjE3MTc2MzE5MDB9.LfBn7S7_F0FTZfwg0NhNy8ZQPXG0zFpfqds-ikv-_n4",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function SearchByUser(userName) {
  console.log(userName);
  try {
    const formattedQueryName = formatUserName(userName);
    const response = await fetch(
      `https://prod-api.kosetto.com/v2/search/users?username=${formattedQueryName}`,
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg5MjQ1ZDRlNzg5Y2Y5ZWY0YTJhZDE4MDJhZDlmODZkZWQzNGVjZGNiIiwiaWF0IjoxNzE1MDM5OTAwLCJleHAiOjE3MTc2MzE5MDB9.LfBn7S7_F0FTZfwg0NhNy8ZQPXG0zFpfqds-ikv-_n4",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return data.users;
  } catch (error) {
    console.log(error);
  }
}

function formatUserName(target) {
  let formatted;
  console.log(target);
  if (/\s/.test(target)) {
    formatted = target.replace(/\s/, "%20");
    return formatted;
  }
  return target;
}

// export async function findId(userAddress) {
//   console.log(userAddress);
//   try {
//     const response = await fetch(
//       `https://api.opensea.io/api/v2/chain/base/account/${userAddress}/nfts`,
//       options
//     );
//     const data = await response.json();
//     const output = dissectShares(data.nfts);
//     console.log(data);
//     return output;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

// function dissectShares(data) {
//   let foundShares = [];
//   console.log(data);
//   for (const key in data) {
//     if (
//       data[key].collection === "wrapped-friendtech" &&
//       data[key].token_standard === "erc1155"
//     ) {
//       foundShares.push(data[key]);
//     }
//   }
//   return foundShares;
// }

// findNftHoldings("0x0f76Cd9bb6b3b7eAeDA808818218d61F923b3494");

export async function findId(userAddress) {
  try {
    const res = await fetch(
      `https://pro-openapi.debank.com/v1/user/nft_list?id=${userAddress}&chain_id=base`,
      debankOptions
    );
    const data = await res.json();
    console.log(data);
    const output = await formatDebankResponse(data);
    console.log(output);
    return output;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function formatDebankResponse(data) {
  console.log(data);
  let formattedBalance = [];
  for (const key in data) {
    if (
      data[key].contract_id === "0xbeea45f16d512a01f7e2a3785458d4a7089c8514"
    ) {
      const currentId = data[key].inner_id;
      formattedBalance.push({
        identifier: currentId,
      });
    }
  }
  console.log(formattedBalance);
  return formattedBalance;
}

export async function fetchGlobalActivity() {
  console.log("here");
  console.log(import.meta.env.VITE_FRIEND_TECH_JWT);
  try {
    const response = await fetch(
      "https://prod-api.kosetto.com/global-activity-v2"
    );
    const data = await response.json();
    dissectBuyTypes(data.events);
    return "1";
  } catch (error) {
    return null;
  }
}

async function dissectBuyTypes(data) {
  for (const key in data) {
    console.log(data[key]);
  }
}

export async function fetchFollowers(userAddress) {
  console.log(userAddress);
  try {
    const response = await fetch(
      `https://prod-api.kosetto.com/users/${userAddress}/following-list?requester=${userAddress}`,
      {
        headers: {
          Authorization: import.meta.env.VITE_FRIEND_TECH_JWT,
        },
      }
    );
    const data = await response.json();
    const result = await data.followingList;
    if (result.length > 3) {
      return [result[0], result[1], result[2]];
    } else {
      return [result[0]];
    }
  } catch (error) {
    return null;
  }
}
// export async function GetTargetShareBalance(
//   userAddress,
//   targetAddress,
//   shareId,
//   useReadContract
// ) {
//   console.log(userAddress, targetAddress);

//   return "1";
// }

//if lapotop discharges we gotta finish these last two functions here we get all chart data for users

export async function getShareChartData(shareAddress) {
  let currentPageStart = null;
  let isNull = false;
  let shareChartData = [];
  try {
    console.log(shareAddress);
    const res = await fetch(
      `https://prod-api.kosetto.com/users/${shareAddress}/account-trade-activity`,
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhhMjRlMTQyNmJjMzdkMGQxYTllNzAzN2Y1ZGUzMzIyZTgwMGYyZDdkIiwiaWF0IjoxNzE3MDI1MzAzLCJleHAiOjE3MTk2MTczMDN9.pk9d_c7NMUBgRC5ySrGdxwLBoHKSYjlG8RMVKN0a5JY",
        },
      }
    );
    const data = await res.json();
    const activity = data.users;
    console.log(data.users);
    console.log(data.nextPageStart);
    currentPageStart = data.nextPageStart;

    for (const key in activity) {
      console.log(activity[key]);

      if (activity[key].subject !== null) {
        const currentShareAddress = activity[key].subject.address;
        console.log(currentShareAddress);
        console.log(currentShareAddress.localeCompare(shareAddress));
        if (currentShareAddress.localeCompare(shareAddress) === 0) {
          console.log(activity[key]);
          console.log(activity[key].isBuy);
          shareChartData.push({
            tradedShareAddress: activity[key].subject.address,
            traderShareAddress: activity[key].trader.address,
            traderName: activity[key].trader.ftName,
            traderPfp: activity[key].trader.ftPfpUrl,
            isBuy: activity[key].isBuy,
            shareAmount: activity[key].shareAmount,
            ethAmount: activity[key].ethAmount,
            date: activity[key].createdAt,
          });
        }
      }
    }
    console.log(shareChartData);
    console.log(data.nextPageStart);
    if (data.nextPageStart !== null) {
      currentPageStart = data.nextPageStart;
      console.log("ture");
      console.log(data.nextPageStart);
      while (currentPageStart !== null) {
        const newData = await continueFindingChartData(
          currentPageStart,
          shareAddress
        );
        const usersActivity = newData.users;

        for (const key in usersActivity) {
          if (
            usersActivity[key].subject !== null ||
            usersActivity[key].club == null
          ) {
            console.log(usersActivity[key]);
            const currentShareAddress = usersActivity[key].subject.address;

            if (
              currentShareAddress !== null ||
              usersActivity[key].club == null
            ) {
              console.log(currentShareAddress);
              console.log(usersActivity[key].isBuy);
              if (currentShareAddress.localeCompare(shareAddress) === 0) {
                shareChartData.push({
                  tradedShareAddress: usersActivity[key].subject.address,
                  traderShareAddress: usersActivity[key].trader.address,
                  traderName: usersActivity[key].trader.ftName,
                  traderPfp: usersActivity[key].trader.ftPfpUrl,
                  isBuy: usersActivity[key].isBuy,
                  shareAmount: usersActivity[key].shareAmount,
                  ethAmount: usersActivity[key].ethAmount,
                  date: usersActivity[key].createdAt,
                });
              }
            }
          }
        }

        console.log(newData.nextPageStart);
        currentPageStart = newData?.nextPageStart;
        if (currentPageStart === null) {
          break;
        }
      }
    }
    return shareChartData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function continueFindingChartData(pageStart, shareAddress) {
  console.log(pageStart);
  const result = [];
  try {
    const res = await fetch(
      `https://prod-api.kosetto.com/users/${shareAddress}/account-trade-activity?pageStart=${pageStart}`,
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhhMjRlMTQyNmJjMzdkMGQxYTllNzAzN2Y1ZGUzMzIyZTgwMGYyZDdkIiwiaWF0IjoxNzE3MDI1MzAzLCJleHAiOjE3MTk2MTczMDN9.pk9d_c7NMUBgRC5ySrGdxwLBoHKSYjlG8RMVKN0a5JY",
        },
      }
    );
    const data = await res.json();
    console.log(data.nextPageStart);
    return await data;
  } catch (error) {
    console.log(error);
  }
}
