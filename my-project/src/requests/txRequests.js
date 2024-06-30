import { readContract } from "@wagmi/core";
import { config } from "../config";
import PodsPoolABI from "../abi/PodsPoolABI";
import { ethers } from "ethers";
import { Contract } from "ethers";
import friendTechABI from "../abi/FriendTechABi";
import GodDogABI from "../abi/GodDogABI";
import { parseEther } from "viem";
import WrappedPoolsABI from "../abi/WrappedPoolsABI";
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
    return feeResults;
  } catch (error) {
    console.log(error);
  }
}

export async function wrap(signer, amountToBuy, finalAmount, shareAddress) {
  const shareWrapperContract = new Contract(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    friendTechABI,
    signer
  );
  try {
    const res = await shareWrapperContract.wrap(
      shareAddress,
      Number(amountToBuy),
      "0x",
      {
        value: parseEther(String(finalAmount)),
      }
    );
    const receipt = await res.wait();
    console.log(await receipt);
    return { failed: false, receipt: receipt, type: "Wrap" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Wrap" };
  }
}

export async function unwrap(signer, amountToSell, finalAmount, shareAddress) {
  const shareWrapperContract = new Contract(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    friendTechABI,
    signer
  );
  try {
    const res = await shareWrapperContract.unwrap(shareAddress, amountToSell);
    const receipt = await res.wait();
    console.log(await receipt);

    return { failed: false, receipt: receipt, type: "Unwrap" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Unwrap" };
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
    return Number(sellTotal) / 10 ** 18;
  } catch (error) {
    console.log(error);
  }
}

export async function getShareBalance(readContract, config, abi, owner, nftId) {
  try {
    const balance = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: abi,
      functionName: "balanceOf",
      args: [owner, nftId],
    });
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
    const finalToPay = await readContract(config, {
      abi: friendWrapperAbi,
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      functionName: "getBuyPriceAfterFee",
      args: [shareAddress, amountToBuy],
    });
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
export async function checkShareApproval(owner, operator) {
  try {
    const isApproved = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: friendTechABI,
      functionName: "isApprovedForAll",
      args: [owner, operator],
    });

    return isApproved;
  } catch (error) {
    console.log(error);
  }
}
export async function checkGoddogApproval(owner, operator) {
  try {
    const isApproved = await readContract(config, {
      address: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
      abi: friendTechABI,
      functionName: "isApprovedForAll",
      args: [owner, operator],
    });

    return isApproved;
  } catch (error) {
    console.log(error);
  }
}

export async function approveGoddogSpending(signer) {
  const godDogContract = new Contract(
    "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    GodDogABI,
    signer
  );
  try {
    const res = await godDogContract.approve(
      "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
      "99999999999999999999999999999999"
    );
    const reciept = await res;
    console.log(await reciept);
  } catch (error) {
    console.log(error);
  }
}
export async function approveShareSpending(signer) {
  const friendTechWrapperContract = new Contract(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    friendTechABI,
    signer
  );
  try {
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
    return { failed: false, receipt: reciept, type: "Withdraw" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Withdraw" };
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
  depositAmount,
  owner
) {
  const isAppoved = await checkShareApproval(
    owner,
    "0x605145D263482684590f630E9e581B21E4938eb8"
  );
  if (!isAppoved) {
    await approveShareSpending(signer);
  }
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

export async function sellPool(signer, abi, parameters, owner) {
  const isAppoved = await checkShareApproval(
    owner,
    "0xa07eBD56b361Fe79AF706A2bF6d8097091225548"
  );
  if (!isAppoved) {
    await approveShareSpending(signer);
  }
  const sudoSwapContract = new Contract(
    "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
    abi,
    signer
  );
  try {
    const res = await sudoSwapContract.swap(parameters, {
      gasLimit: 250000,
    });
    const reciept = await res.wait();
    return { failed: false, receipt: reciept, type: "Pool sell" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Pool sell" };
  }
}

export async function buyPool(signer, abi, parameters, owner) {
  await approveGoddogSpending(signer);

  const sudoSwapContract = new Contract(
    "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
    abi,
    signer
  );
  try {
    const res = await sudoSwapContract.swap(parameters, {
      gasLimit: 250000,
    });
    const reciept = await res.wait();
    return { failed: false, receipt: reciept, type: "Pool buy" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Pool buy" };
  }
}

async function createSharePool(signer, abi, parameters, owner) {
  const isAppoved = await checkShareApproval(
    owner,
    "0x605145D263482684590f630E9e581B21E4938eb8"
  );
  if (!isAppoved) {
    await approveShareSpending(signer);
  }
}

export async function transferShares(
  signer,
  amount,
  shareAddress,
  owner,
  receiver
) {
  const shareContract = new Contract(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    friendTechABI,
    signer
  );
  try {
    const res = await shareContract?.safeTransferFrom(
      owner,
      receiver,
      shareAddress,
      amount,
      "0x"
    );
    const reciept = await res.wait();

    return { failed: false, receipt: reciept, type: "Transfer" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Transfer" };
  }
}

export async function checkChain(chain) {
  if (chain !== 8453) {
    return false;
  }
  return true;
}

export async function transferPoolOwnerShip(
  signer,
  abi,
  poolContract,
  newOwner
) {
  const shareContract = new Contract(poolContract, abi, signer);
  try {
    const parameters = [];
    const res = await shareContract?.transferOwnership(newOwner, "0x", {
      gasLimit: 300000,
    });
    const reciept = await res.wait();

    return { failed: false, receipt: reciept, type: "Transfer ownership" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Transfer ownership" };
  }
}

async function getWrappedPoolsBalance(owner) {
  try {
    const balance = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: WrappedPoolsABI,
      functionName: "balanceOf",
      args: [owner],
    });
    return Number(balance);
  } catch (error) {
    console.log(error);
  }
}

export async function isPoolWrapped(poolAddress) {
  try {
    const wrappedPoolOwner = await readContract(config, {
      address: "0x8D3C4a673Dd2fAC51d4fde7A42a0dfc5E4DCb228",
      abi: WrappedPoolsABI,
      functionName: "ownerOf",
      args: [poolAddress],
    });
    return { address: wrappedPoolOwner, wrapped: true };
  } catch (error) {
    console.log(error);
    return { address: null, wrapped: false };
  }
}
