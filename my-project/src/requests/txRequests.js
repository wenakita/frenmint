import { readContract } from "@wagmi/core";
import { config } from "../config";
import PodsPoolABI from "../abi/PodsPoolABI";
import { ethers } from "ethers";
import { Contract } from "ethers";
import friendTechABI from "../abi/FriendTechABi";
const podsPoolCA = "0x5eecab00965c30f2aa776dfe470f926e0ba484cc";
const podsIndexFundCA = "0x5eecab00965c30f2aa776dfe470f926e0ba484cc";
const goddogTokenCA = "0xddf7d080c82b8048baae54e376a3406572429b4e";
const dogGodCA = "0xB846dc079E2A0eEad8A3173Eeaa0f1607b67E27a";
const bondMinAmount = "21700";
const exhangeRate = 1.035043; // price per poooOOO to caluclate divide amount to deposit by goddog price to find usd value then
//deposit amount in usd/ exchange rate
export async function getPoolFees() {
  try {
    const feeResults = await readContract(config, {
      address: podsPoolCA,
      abi: PodsPoolABI,
      functionName: "fees",
      args: [],
    });
    console.log(feeResults);
    return feeResults;
  } catch (error) {
    console.log(error);
  }
}

export async function bondGoddog() {}
export async function unBondGoddog() {}

export async function aprroveGoddog() {}

export async function wrapToken(
  shareContract,
  amountToBuy,
  finalAmount,
  shareAddress,
  parseEther
) {
  try {
    console.log(amountToBuy, shareAddress, finalAmount);

    const res = await shareContract.wrap(
      shareAddress,
      Number(amountToBuy),
      "0x",
      {
        value: parseEther(String(finalAmount)),
      }
    );
    const receipt = await res.wait();
    console.log(await receipt);
    return receipt;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getShareSupply(readContract, config, abi, shareAddress) {
  try {
    const supply = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: abi,
      functionName: "totalSupply",
      args: [shareAddress],
    });
    console.log(supply);
    return Number(supply);
  } catch (error) {
    console.log(error);
  }
}

export async function getShareBuyTotal(
  readContract,
  config,
  abi,
  shareAddress,
  amount
) {
  try {
    const buyTotal = await readContract(config, {
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      abi: abi,
      functionName: "getBuyPriceAfterFee",
      args: [shareAddress, amount],
    });

    console.log(Number(buyTotal) / 10 ** 18);
    return Number(buyTotal) / 10 ** 18;
  } catch (error) {
    console.log(error);
  }
}

export async function getShareSellTotal(
  readContract,
  config,
  abi,
  shareAddress,
  amount
) {
  try {
    const sellTotal = await readContract(config, {
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      abi: abi,
      functionName: "getSellPriceAfterFee",
      args: [shareAddress, amount],
    });
    console.log(sellTotal);
    console.log(Number(sellTotal) / 10 ** 18);
    return Number(sellTotal) / 10 ** 18;
  } catch (error) {
    console.log(error);
  }
}

export async function getShareBalance(readContract, config, abi, owner, nftId) {
  console.log(owner, nftId);
  try {
    const balance = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: abi,
      functionName: "balanceOf",
      args: [owner, nftId],
    });
    console.log(balance);
    return Number(balance);
  } catch (error) {
    console.log(error);
  }
}

export async function getFinalWrapTotal(
  readContract,
  config,
  friendWrapperAbi,
  shareAddress,
  amountToBuy
) {
  try {
    console.log(shareAddress);
    console.log(String(amountToBuy * Math.pow(10, 18)));
    const finalToPay = await readContract(config, {
      abi: friendWrapperAbi,
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      functionName: "getBuyPriceAfterFee",
      args: [shareAddress, amountToBuy],
    });
    console.log(Number(finalToPay) / 10 ** 18);
    return Number(finalToPay) / 10 ** 18;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getShareUri(readContract, config, abi, nftId) {
  try {
    const uriResult = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: abi,
      functionName: "uri",
      args: [nftId],
    });
    return uriResult.slice(28, uriResult.length);
  } catch (error) {
    console.log(error);
  }
}

export async function getSingleBuyNftPrice(
  readContract,
  config,
  abi,
  nftId,
  poolAddress,
  amount
) {
  try {
    const buyQuoteResult = await readContract(config, {
      address: poolAddress,
      abi: abi,
      functionName: "getBuyNFTQuote",
      args: [nftId, amount],
    });
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
    const output = Number(buyQuoteResult[3]) / 10 ** 18;
    return buyQuoteResult[3];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getSingleSellNftPrice(
  readContract,
  config,
  abi,
  nftId,
  poolAddress,
  amount
) {
  try {
    const buyQuoteResult = await readContract(config, {
      address: poolAddress,
      abi: abi,
      functionName: "getSellNFTQuote",
      args: [nftId, amount],
    });
    const output = Number(buyQuoteResult[3]) / 10 ** 18;

    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
    return buyQuoteResult[3];
  } catch (error) {
    console.log(error);
  }
}

export async function getSharePrice(
  readContract,
  config,
  abi,
  shareAddress,
  amount
) {
  try {
    const price = await readContract(config, {
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      abi: abi,
      functionName: "getBuyPrice",
      args: [shareAddress, amount],
    });
    const answer = Number(price) / 10 ** 18;
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero

    setTimeout(() => {
      return answer;
    }, [1000]);
  } catch (error) {
    console.log(error);
  }
}

// async function checkGoddogApporval() {
//   try {
//     cosnt approvalStatus = readContract(config, {

//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

export async function approveGoddogSpending() {}
export async function approveShareSpending(signer) {
  const friendTechWrapperContract = new Contract(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    friendTechABI,
    signer
  );
  try {
    console.log("running");
    const res = await friendTechWrapperContract.setApprovalForAll(
      "0x605145D263482684590f630E9e581B21E4938eb8",
      true
    );
    const reciept = await res.wait();
    console.log(await reciept);
  } catch (error) {
    console.log(error);
  }
}

export async function withdrawGoddog(signer, abi, targetPool, withdrawAmount) {
  console.log(signer);
  console.log(withdrawAmount);
  const SudoSwapPoolContract = new Contract(targetPool, abi, signer);
  try {
    const res = await SudoSwapPoolContract.withdrawERC20(
      goddogTokenCA,
      ethers.BigNumber.from(withdrawAmount)
        .mul(ethers.BigNumber.from("10").pow(18))
        .toString()
    );
    const reciept = await res.wait();
    console.log(await reciept);
    return { failed: false, receipt: reciept, type: "withdraw" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "withdraw" };
  }
}

export async function withdrawShares(
  signer,
  abi,
  targetPool,
  withdrawAmount,
  nftId
) {
  const SudoSwapPoolContract = new Contract(targetPool, abi, signer);
  try {
    const res = await SudoSwapPoolContract.withdrawERC1155(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      [nftId],
      [withdrawAmount]
    );
    const reciept = await res.wait();
    console.log(await reciept);
    return { failed: false, receipt: reciept, type: "Withdraw" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Withdraw" };
  }
}
export async function depositShares(
  signer,
  abi,
  targetPool,
  nftId,
  depositAmount
) {
  await approveShareSpending(signer);
  const SudoSwapContract = new Contract(
    "0x605145D263482684590f630E9e581B21E4938eb8",
    abi,
    signer
  );
  try {
    const res = await SudoSwapContract.depositERC1155(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      nftId,
      targetPool,
      depositAmount
    );
    const reciept = await res.wait();
    return { failed: false, receipt: reciept, type: "Deposit" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Deposit" };
  }
}
export async function depositGoddog(signer, abi, targetPool, depositAmount) {
  const SudoSwapContract = new Contract(
    "0x605145D263482684590f630E9e581B21E4938eb8",
    abi,
    signer
  );
  try {
    const res = await SudoSwapContract.depositERC20(
      goddogTokenCA,
      targetPool,
      ethers.BigNumber.from(depositAmount)
        .mul(ethers.BigNumber.from("10").pow(18))
        .toString()
    );
    const reciept = await res.wait();
    return { failed: false, receipt: reciept, type: "Deposit" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Deposit" };
  }
}
