import { useState, useEffect } from "react";
import { getShareBalance, getShareUri } from "./txRequests";
import { getEthPrice } from "./priceCalls";
import _ from "lodash";
import { config } from "../config";
import friendTechABI from "../abi/FriendTechABi";
import { readContract } from "@wagmi/core";

const jwt = import.meta.env.VITE_FRIEND_TECH_JWT;

const debankOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    AccessKey: "533a2166f29ab81d9b2a1148c77bd513939b1211",
  },
};

export async function GetTrendingFriends() {
  try {
    const res = await fetch("https://prod-api.kosetto.com/lists/top-by-price");
    const trendingUsers = await res.json();

    return trendingUsers.users;
  } catch (error) {
    console.log(error);
    return null;
  }
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
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function SearchByUser(userName) {
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
    return data.users;
  } catch (error) {
    console.log(error);
  }
}

function formatUserName(target) {
  let formatted;
  if (/\s/.test(target)) {
    formatted = target.replace(/\s/, "%20");
    return formatted;
  }
  return target;
}

export async function fetchFollowers(shareAddress) {
  try {
    const followerData = [];
    let currentPageStart;
    const res = await fetch(
      `https://prod-api.kosetto.com/users/${shareAddress}/token/holders?requester=${shareAddress}`
    );
    const data = await res.json();
    followerData.push({
      page: data.users,
    });
    currentPageStart = data?.nextPageStart;
    if (data.nextPageStart !== null) {
      while (currentPageStart !== null) {
        const currentFollwerPage = await followerReccuring(
          shareAddress,
          currentPageStart
        );

        currentPageStart = currentFollwerPage.nextPageStart;
        if (currentPageStart === null) {
          break;
        } else {
          followerData.push({
            page: currentFollwerPage.users,
          });
        }
      }
    }
    return followerData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function followerReccuring(userAdderss, pageStart) {
  try {
    const res = await fetch(
      `https://prod-api.kosetto.com/users/${userAdderss}/token/holders?requester=${userAdderss}&pageStart=${pageStart}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
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
    const output = await formatDebankResponse(data);
    return output;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findHoldingsShareData(
  readContract,
  config,
  FriendTechABi,
  userAddress,
  holdings
) {
  const formattedHoldings = [];
  for (const key in holdings) {
    const currentShare = holdings[key];
    const currentShareCA = await getShareUri(
      readContract,
      config,
      FriendTechABi,
      currentShare?.identifier
    );
    const currentShareFTData = await SearchByContract(currentShareCA);
    const shareBalance = await getShareBalance(
      readContract,
      config,
      FriendTechABi,
      userAddress,
      currentShare?.identifier
    );
    formattedHoldings.push({
      nftID: currentShare?.identifier,
      contract: currentShareCA,
      balance: shareBalance,
      ...currentShareFTData,
    });
  }
  return formattedHoldings;
}

async function formatDebankResponse(data) {
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
  return formattedBalance;
}

export async function fetchGlobalActivity() {
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
  }
}

export async function formatChartData(chartData) {
  for (const key in chartData) {
    const currentShare = chartData[key];
    const currentDate = currentShare?.date;
    const buyAmountEth = uintFormat(currentShare.ethAmount);
    const sharesBought = currentShare.shareAmount;
    const convertedDate = new Date(currentDate);
    let month = convertedDate.toLocaleString("default", { month: "long" });
    let day = convertedDate.getDate();
    let year = convertedDate.getFullYear();
    let formattedDate = `${month} ${day}, ${year}`;
    chartData[key].fullDate = formattedDate;
    const calculatePriceAtTime = Number(buyAmountEth) / Number(sharesBought);
    chartData[key].priceAtDate = calculatePriceAtTime;
  }
  return chartData;
}

//if lapotop discharges we gotta finish these last two functions here we get all chart data for users

export async function getShareChartData(shareAddress) {
  let currentPageStart = null;
  let isNull = false;
  let shareChartData = [];
  try {
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
    currentPageStart = data.nextPageStart;

    for (const key in activity) {
      if (activity[key].subject !== null) {
        const currentShareAddress = activity[key].subject.address;
        if (currentShareAddress.localeCompare(shareAddress) === 0) {
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
    if (data.nextPageStart !== null) {
      currentPageStart = data.nextPageStart;
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
            const currentShareAddress = usersActivity[key].subject.address;

            if (
              currentShareAddress !== null ||
              usersActivity[key].club == null
            ) {
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

        currentPageStart = newData?.nextPageStart;
        if (currentPageStart === null) {
          break;
        }
      }
    }
    const formattedData = await formatChartData(shareChartData);
    return formattedData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function formatSudoSwapPoolData(a) {}

export function uintFormat(value) {
  return Number(value) / 10 ** 18;
}

export async function continueFindingChartData(pageStart, shareAddress) {
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
    return await data;
  } catch (error) {
    console.log(error);
  }
}

// getWrappedPoolsHoldings("0xa24e1426Bc37d0D1a9e7037f5De3322E800F2D7d");

export async function getIdHoldings(userAddress) {
  try {
    const res = await fetch(
      `https://pro-openapi.debank.com/v1/user/nft_list?id=${userAddress}&chain_id=base`,
      debankOptions
    );
    const data = await res.json();
    console.log(data);
    for (const key in data) {
      if (
        data[key]?.contract_id.includes(
          "0x8D3C4a673Dd2fAC51d4fde7A42a0dfc5E4DCb228"
        )
      ) {
        console.log(data[key]);
      }
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getChart(address) {
  const ethPrice = await getEthPrice();
  const priceHistory = await getShareChartData(address);
  // const formattedPriceHistory = await formatChartData(priceHistory);
  const orderedPriceHistory = _.orderBy(priceHistory, ["date"]);
  let totalVolume = 0;
  for (const key in priceHistory) {
    const currentData = priceHistory[key];
    totalVolume += Math.round(Number(currentData?.priceAtDate) * ethPrice);
  }

  return { volume: totalVolume, history: orderedPriceHistory };
}

export async function getUserHoldings(userAddress) {
  const userHoldings = await findId(userAddress);
  const holdingsData = await findHoldingsShareData(
    readContract,
    config,
    friendTechABI,
    userAddress,
    userHoldings
  );

  return holdingsData;
}
