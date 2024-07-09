import { Quoter } from "sudo-defined-quoter";
import { readContract } from "@wagmi/core";
import { config } from "../config";
import friendTechABI from "../abi/FriendTechABi";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI";
import {
  getShareBalance,
  getShareUri,
  getSingleBuyNftPrice,
  getSingleSellNftPrice,
  isPoolWrapped,
} from "./txRequests";
import { SearchByContract, getIdHoldings } from "./friendCalls";
import { getStakerInfo } from "./stakingRequests";

export async function getWrappedPoolHoldings(userAddress) {
  const existingPools = await getExistingPools(userAddress);
  return existingPools;
}

export async function getWrappedPools(userAddress) {
  const wrappedPools = [];
  const wrappedPoolCA = "0x8d3c4a673dd2fac51d4fde7a42a0dfc5e4dcb228";
  const resTwo = await getIdHoldings(userAddress);
  console.log(resTwo);
  const dissectedHoldings = await dissectHoldings(
    userAddress,
    resTwo,
    wrappedPoolCA
  );
  for (const key in dissectedHoldings) {
    const currentHolding = dissectedHoldings[key];
    const poolAddress = parseIdToAddress(currentHolding?.inner_id);
    //correct pool addressses are displayed
    currentHolding.poolAddress = poolAddress;
    dissectedHoldings[key] == currentHolding;
  }
  console.log(dissectedHoldings);
  const existingPools = await getExistingPools(userAddress);

  for (let i = 0; i <= existingPools.length - 1; i++) {
    const currentPool = existingPools[i];
    console.log(currentPool);
    for (let j = 0; j < dissectedHoldings.length; j++) {
      if (
        dissectedHoldings[j].poolAddress === currentPool?.sudoSwapData?.address
      ) {
        console.log(true);
        currentPool.wrappedPoolData = dissectedHoldings[j];
        wrappedPools.push(currentPool);
      }
    }
  }

  return wrappedPools;
}
//left off working here
export async function getStakedWrappedPools(userAddress, userStakingInfo) {
  const wrappedPoolCA = "0x8d3c4a673dd2fac51d4fde7a42a0dfc5e4dcb228";
  const stakedPoolsFound = [];

  try {
    // Get existing pools
    const allPools = await getExistingPools(userAddress);
    console.log("All pools:", allPools);

    // Get staker info

    const idsDeposited = userStakingInfo[0];
    console.log("IDs deposited:", idsDeposited);

    // Iterate over deposited IDs
    for (let i = 0; i < idsDeposited.length; i++) {
      const currentId = String(idsDeposited[i]);
      const currentIdParsed = parseIdToAddress(currentId);
      console.log("Current ID parsed:", currentIdParsed);

      // Iterate over all pools
      for (let j = 0; j < allPools.length; j++) {
        const currentPool = allPools[j];
        console.log("Current pool:", currentPool?.sudoSwapData?.address);

        // Check if pool address matches deposited ID
        if (currentPool?.sudoSwapData?.address === currentIdParsed) {
          console.log("Match found for ID:", currentIdParsed);
          currentPool.wrappedPoolID = currentId;
          currentPool.totalRewards = userStakingInfo[1];
          stakedPoolsFound.push(currentPool);
        }
      }
    }

    console.log("Staked pools found:", stakedPoolsFound);
    return stakedPoolsFound;
  } catch (error) {
    console.error("Error fetching staked pools:", error);
    return null; // Return empty array or handle error as per your application's logic
  }
}

//here we convert the wrapped pools inner id into the pools address we parse the 721 into a address

function parseIdToAddress(id) {
  // Convert the ID to a hexadecimal string
  let hexString = BigInt(id).toString(16);

  // Pad the string with leading zeros to ensure it is 40 characters long
  hexString = hexString.padStart(40, "0");

  // Add the "0x" prefix to make it a valid Ethereum address
  const address = "0x" + hexString;

  return address;
}

//to get the wrapped pools pool address we have to convert the innerId to address type
async function dissectHoldings(userAddress, data, targetCA) {
  const wrappedPoolsFullData = [];
  console.log(targetCA);
  for (const key in data) {
    const currentHolding = data[key];
    if (currentHolding?.contract_id.includes(targetCA)) {
      console.log(currentHolding);
      wrappedPoolsFullData.push(currentHolding);
    }
  }
  console.log(wrappedPoolsFullData);

  return wrappedPoolsFullData;
}

export async function getExistingFilteredPools(
  userAddress,
  shouldFilter,
  ERC20Address
) {
  console.log(ERC20Address);
  let q = new Quoter(import.meta.env.VITE_DEFINED_KEY, 8453);
  let a = await q.getPoolsForCollection(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
  );
  const poolFormattedData = [];
  for (const key in a) {
    const currentId = a[key]?.erc1155Id;
    const currentShareContract = await getShareUri(
      readContract,
      config,
      friendTechABI,
      currentId
    );
    const currentPoolAddress = a[key].address;
    console.log(
      a[key]?.tokenAddress.toLowerCase() === String(ERC20Address).toLowerCase()
    );
    if (currentShareContract !== null) {
      const currentShareData = await SearchByContract(currentShareContract);
      if (currentShareData !== null) {
        const isWrapped = await isPoolWrapped(currentPoolAddress);
        console.log(isWrapped);

        const userShareBalance = await getShareBalance(
          readContract,
          config,
          friendTechABI,
          userAddress,
          currentId
        );
        const buyPrice = await getSingleBuyNftPrice(
          readContract,
          config,
          SudoSwapPoolABI,
          currentId,
          currentPoolAddress,
          "1"
        );
        const sellPrice = await getSingleSellNftPrice(
          readContract,
          config,
          SudoSwapPoolABI,
          currentId,
          currentPoolAddress,
          "1"
        );

        if (
          String(a[key]?.tokenAddress).toLowerCase() ===
            String(ERC20Address).toLowerCase() &&
          shouldFilter
        ) {
          poolFormattedData.push({
            sudoSwapData: a[key],
            ...currentShareData,
            balance: userShareBalance,
            buyPrice: Number(sellPrice),
            sellPrice: buyPrice,
            isWrapped: isWrapped?.wrapped,
            wrappedPoolOwner: isWrapped?.address,
          });
        }
      }
    }
  }
  console.log(poolFormattedData);
  // setSelectedPool(poolFormattedData[0]);
  // setAvailablePools(poolFormattedData);
  return poolFormattedData;
}

export async function getExistingPools(userAddress) {
  let q = new Quoter(import.meta.env.VITE_DEFINED_KEY, 8453);
  let a = await q.getPoolsForCollection(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
  );
  const poolFormattedData = [];
  for (const key in a) {
    const currentId = a[key]?.erc1155Id;
    const currentShareContract = await getShareUri(
      readContract,
      config,
      friendTechABI,
      currentId
    );
    const currentPoolAddress = a[key].address;

    if (currentShareContract !== null) {
      const currentShareData = await SearchByContract(currentShareContract);
      if (currentShareData !== null) {
        let ERC20IMG;
        console.log(a[key]?.tokenAddress);
        switch (a[key]?.tokenAddress) {
          case "0x0bd4887f7d41b35cd75dff9ffee2856106f86670":
            ERC20IMG =
              "https://dd.dexscreener.com/ds-data/tokens/base/0x0bd4887f7d41b35cd75dff9ffee2856106f86670.png?size=lg&key=ad3594";
            break;
          default:
            ERC20IMG =
              "https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46";
            break;
        }
        const isWrapped = await isPoolWrapped(currentPoolAddress);
        console.log(isWrapped);
        const userShareBalance = await getShareBalance(
          readContract,
          config,
          friendTechABI,
          userAddress,
          currentId
        );
        const buyPrice = await getSingleBuyNftPrice(
          readContract,
          config,
          SudoSwapPoolABI,
          currentId,
          currentPoolAddress,
          "1"
        );
        const sellPrice = await getSingleSellNftPrice(
          readContract,
          config,
          SudoSwapPoolABI,
          currentId,
          currentPoolAddress,
          "1"
        );

        poolFormattedData.push({
          sudoSwapData: a[key],
          ...currentShareData,
          balance: userShareBalance,
          buyPrice: Number(sellPrice),
          sellPrice: buyPrice,
          isWrapped: isWrapped?.wrapped,
          wrappedPoolOwner: isWrapped?.address,
          pairIMGURL: ERC20IMG,
        });
      }
    }
  }
  console.log(poolFormattedData);
  // setSelectedPool(poolFormattedData[0]);
  // setAvailablePools(poolFormattedData);
  return poolFormattedData;
}
