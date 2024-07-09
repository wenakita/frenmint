import { readContract } from "@wagmi/core";
import { config } from "../../../config";
import FriendABI from "../../../abi/FriendABI";
import { uintFormat } from "../../../requests/friendCalls";

import {
  getEthPrice,
  getGoddogPrice,
  getTokenPrice,
} from "../../../requests/priceCalls";
import SudoSwapPoolABI from "../../../abi/SudoSwapPoolABI";

const friendTechContract = "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4";
const wrapperContract = "0xbeea45F16D512a01f7E2a3785458D4a7089c8514";

export async function getCurrentShareNumber(supply) {
  console.log((supply * supply) / 16000);
  return (supply * supply) / 16000;
}

export async function detectTxType(type, share, amount, ERC20) {
  console.log(type);
  const ethPriceUSD = await getEthPrice();
  const goddogPrice = await getGoddogPrice();
  const friendPrice = await getTokenPrice(
    "0x0bD4887f7D41B35CD75DFF9FfeE2856106f86670"
  );
  console.log(friendPrice);

  let res;
  let usdValue;
  let output;
  let dif;
  let pairedERC20;
  type = String(type).toLowerCase();

  switch (type) {
    case "mint":
      res = await getQuote(
        friendTechContract,
        FriendABI,
        [share?.address, amount],
        "getBuyPriceAfterFee"
      );
      dif = Number(uintFormat(res) - uintFormat(share?.displayPrice)).toFixed(
        4
      );
      usdValue = Number(uintFormat(res) * ethPriceUSD).toFixed(2);

      output = {
        quote: uintFormat(res),
        usd: usdValue,
        fees: dif,
        feesUsd: Number(dif * ethPriceUSD).toFixed(2),
      };
      break;
    case "burn":
      res = await getQuote(
        friendTechContract,
        FriendABI,
        [share?.address, amount],
        "getSellPriceAfterFee"
      );
      dif = Number(uintFormat(res) - uintFormat(share?.displayPrice)).toFixed(
        4
      );

      usdValue = Number(uintFormat(res) * ethPriceUSD).toFixed(2);
      output = {
        quote: uintFormat(res),
        usd: usdValue,
        fees: dif,
        feesUsd: Number(dif * ethPriceUSD).toFixed(2),
      };
      break;
    case "buy":
      pairedERC20 = await getPoolERC20Pair(share?.sudoSwapData?.address);
      console.log(pairedERC20);
      //try and call to get the paired erc20 address so we dont have to passin from component look into ca for referece
      res = await getPoolQuote(share?.sudoSwapData?.address, "getBuyNFTQuote", [
        share?.sudoSwapData?.erc1155Id,
        amount,
      ]);
      console.log(res);
      if (pairedERC20 === "0x0bD4887f7D41B35CD75DFF9FfeE2856106f86670") {
        usdValue = (uintFormat(res) * friendPrice).toFixed(2);
      } else {
        usdValue = (uintFormat(res) * goddogPrice).toFixed(2);
      }
      output = {
        quote: uintFormat(res),
        usd: usdValue,
        fees: uintFormat(res) * 0.042,
        feesUsd: (uintFormat(res) * 0.042 * goddogPrice).toFixed(2),
        unFormatted: res,
        pairedERC20,
      };
      break;
    case "sell":
      pairedERC20 = await getPoolERC20Pair(share?.sudoSwapData?.address);
      console.log(pairedERC20);
      //try and call to get the paired erc20 address so we dont have to passin from component look into ca for referece

      res = await getPoolQuote(
        share?.sudoSwapData?.address,
        "getSellNFTQuote",
        [share?.sudoSwapData?.erc1155Id, amount]
      );
      console.log(res);
      if (pairedERC20 === "0x0bD4887f7D41B35CD75DFF9FfeE2856106f86670") {
        usdValue = (uintFormat(res) * friendPrice).toFixed(2);
      } else {
        usdValue = (uintFormat(res) * goddogPrice).toFixed(2);
      }
      output = {
        quote: uintFormat(res),
        usd: usdValue,
        fees: (uintFormat(res) * 0.042).toFixed(2),
        feesUsd: (uintFormat(res) * 0.042 * goddogPrice).toFixed(2),
        unFormatted: res,
        pairedERC20,
      };
      break;
    case "pool":
      console.log(share);
      res = await calculatePoolQuote(share, amount, ERC20);
      output = res;
      break;
  }
  return output;
}

async function calculatePoolQuote(share, amount, ERC20) {
  const ethPriceUSD = await getEthPrice();
  const ERC20PRICEUSD = await getTokenPrice(ERC20?.address);
  const sharePrice = uintFormat(share?.displayPrice);
  const deltaEquation = amount * 11 + 1;
  const spotPrice = (sharePrice * deltaEquation * ethPriceUSD) / ERC20PRICEUSD;
  const initialBalance = sharePrice * amount;
  const finalDepositAmount = (initialBalance * ethPriceUSD) / ERC20PRICEUSD;
  console.log(finalDepositAmount);
  return {
    quote: 0, //lp to deposit
    usd: finalDepositAmount * ERC20PRICEUSD,
    fees: 0,
    feesUsd: 0,
    LP: finalDepositAmount,
    intialTokenBalance: finalDepositAmount,
    delta: deltaEquation,
    spotPrice: spotPrice,
    ethPrice: ethPriceUSD,
    ERC20Price: ERC20PRICEUSD,
    depositAmount: amount,
    ERC20Address: ERC20,
  };
}

async function getQuote(contractAddress, abi, params, targetFunction) {
  try {
    const quote = await readContract(config, {
      address: contractAddress,
      abi: abi,
      functionName: targetFunction,
      args: params,
    });
    return quote;
  } catch (error) {
    console.log(error);
  }
}

async function getPoolQuote(poolAddress, targetFunction, params) {
  try {
    const buyQuoteResult = await readContract(config, {
      address: poolAddress,
      abi: SudoSwapPoolABI,
      functionName: targetFunction,
      args: params,
    });
    const output = Number(buyQuoteResult[3]) / 10 ** 18;
    console.log(output);
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
    return buyQuoteResult[3];
  } catch (error) {
    console.log(error);
  }
}

export async function getTokenBalance(address, abi, owner) {
  try {
    const balance = await readContract(config, {
      address: address,
      abi: abi,
      functionName: "balanceOf",
      args: [owner],
    });
    const output = Number(balance) / 10 ** 18;
    console.log(output);
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
    return output;
  } catch (error) {
    console.log(error);
  }
}
export async function getPoolERC20Pair(poolAddress) {
  try {
    const pair = await readContract(config, {
      address: poolAddress,
      abi: SudoSwapPoolABI,
      functionName: "token",
      args: [],
    });

    console.log(pair);
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
    return pair;
  } catch (error) {
    console.log(error);
  }
}
