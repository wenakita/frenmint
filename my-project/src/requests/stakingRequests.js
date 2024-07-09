import WrappedPoolsStakerABI from "../abi/WrappedPoolsStakerABI";
import { readContract } from "@wagmi/core";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { config } from "../config";
import WrappedPoolsABI from "../abi/WrappedPoolsABI";
import { throttle } from "lodash";
const throttledGetStakerInfo = throttle(getStakerInfo, 1000); // 1000ms interval (adjust as needed)
export async function approveWrappedPoolSpending(signer, wrappedPoolID) {
  const stakingContract = new Contract(
    "0x8D3C4a673Dd2fAC51d4fde7A42a0dfc5E4DCb228",
    WrappedPoolsABI,
    signer
  );
  try {
    console.log("runnign");
    const res = await stakingContract.approve(
      "0xE65D793a7Ea470B750e482fEab4F5d622c4C7497",
      wrappedPoolID
    );
    const reciept = await res.wait();
  } catch (error) {
    console.log(error);
  }
}

export async function getStakerInfo(staker) {
  try {
    const info = await readContract(config, {
      address: "0xE65D793a7Ea470B750e482fEab4F5d622c4C7497",
      abi: WrappedPoolsStakerABI,
      functionName: "getStakeInfo",
      args: [staker],
    });
    //index zero is the array of the token ids the user staked, the first index is the rewards that the user has earned from staking
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
  }
}

export async function StakeWrappedPool(signer, wrappedPoolID) {
  await approveWrappedPoolSpending(signer, wrappedPoolID);
  const stakingContract = new Contract(
    "0xE65D793a7Ea470B750e482fEab4F5d622c4C7497",
    WrappedPoolsStakerABI,
    signer
  );
  try {
    console.log("runnign");
    const res = await stakingContract.stake([wrappedPoolID]);
    const reciept = await res.wait();
    return { failed: false, receipt: null, type: "Stake" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Stake" };
  }
}

export async function withdrawStakedWrappedPool(signer, wrappedPoolID) {
  await claim(signer);
  const stakingContract = new Contract(
    "0xE65D793a7Ea470B750e482fEab4F5d622c4C7497",
    WrappedPoolsStakerABI,
    signer
  );
  try {
    console.log("runnign");
    const res = await stakingContract.withdraw([wrappedPoolID]);
    const reciept = await res.wait();
    return { failed: false, receipt: null, type: "Withdraw" };
  } catch (error) {
    console.log(error);
    return { failed: true, receipt: null, type: "Withdraw" };
  }
}

export async function claim(signer) {
  const stakingContract = new Contract(
    "0xE65D793a7Ea470B750e482fEab4F5d622c4C7497",
    WrappedPoolsStakerABI,
    signer
  );
  try {
    const gasEstimate = await stakingContract.estimateGas.claimRewards();
    console.log("runnign");
    const res = await stakingContract.claimRewards({
      gasLimit: gasEstimate,
    });
    const reciept = await res.wait();
  } catch (error) {
    console.log(error);
  }
}
