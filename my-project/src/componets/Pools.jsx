import React, { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import friendTechABI from "../abi/FriendTechABi";
import { config } from "../config";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { findId } from "../requests/friendCalls";
import { uintFormat } from "../formatters/format";
import { useWallets } from "@privy-io/react-auth";
import SudoSwapABI from "../abi/SudoSwapABI";
import { useBalance } from "wagmi";
import { base } from "wagmi/chains";
import GodDogABI from "../abi/GodDogABI";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { parseEther } from "viem";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import PoolsManageDialoge from "./PoolsManageDialoge";
import { MdVerified } from "react-icons/md";

function Pools(props) {
  const [currentPool, setCurrentPool] = useState(null);
  const [poolData, setPoolData] = useState([]);
  const friendWrapperContract = "0xbeea45F16D512a01f7E2a3785458D4a7089c8514";
  const goddogContract = "0xddf7d080c82b8048baae54e376a3406572429b4e";
  const { userPools, activateLoading, getActivePools } = props;

  console.log(userPools);
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [newOwner, setNewOwner] = useState(null);
  const [currentShareBalance, setCurrentShareBalance] = useState(null);
  const [sharesToDeposit, setSharesToDeposit] = useState(null);
  const [goddogToDeposit, setGoddogToDeposit] = useState(null);
  const [sharesToWithdraw, setSharesToWithdraw] = useState(null);
  const [goddogToWithdraw, setGoddogToWithdraw] = useState(null);
  const [displayPools, setDisplayPools] = useState(false);
  const [manageOption, setManageOption] = useState(null);

  const goddogBalanceResult = useBalance({
    address: w0?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });

  const [message, setMessage] = useState(null);

  const goddogBalance = Number(goddogBalanceResult?.data?.value) / 10 ** 18;
  useEffect(() => {
    getSharesData();
  }, [userPools]);

  async function getShareBalance(targetShareId) {
    let balanceFound = false;
    const userShareBalance = await findId(w0?.address);
    for (const key in userShareBalance) {
      if (userShareBalance[key].identifier === targetShareId) {
        balanceFound = true;
      }
    }
    if (balanceFound) {
      getBalanceOfShare(targetShareId);
    }
  }

  async function getBalanceOfShare(targetId) {
    const balanceResult = readContract(config, {
      address: friendWrapperContract,
      abi: friendTechABI,
      functionName: "balanceOf",
      args: [w0?.address, targetId],
    });
    const balanceFound = await balanceResult;
    setCurrentShareBalance(String(Number(balanceFound)));
  }

  async function getSharesData() {
    const poolsFullData = [];
    for (const key in userPools) {
      const currentShareId = userPools[key]?.erc1155Id;
      const currentShareContract = await getShareUri(currentShareId);
      if (currentShareContract) {
        const currentShareData = await getUriData(currentShareContract);
        if (currentShareData) {
          poolsFullData.push({
            poolData: {
              shareData: currentShareData,
              sharePoolData: userPools[key],
            },
          });

          if (!displayPools) {
            setDisplayPools(true);
          }
        }
      }
    }
    setPoolData(poolsFullData);
  }

  async function getShareUri(targetId) {
    try {
      const uriResult = await readContract(config, {
        address: friendWrapperContract,
        abi: friendTechABI,
        functionName: "uri",
        args: [targetId],
      });
      const uriResultContract = uriResult.slice(28, uriResult.length);
      return uriResultContract;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUriData(targetShareContract) {
    try {
      const res = await fetch(
        `https://prod-api.kosetto.com/users/${targetShareContract}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //to withdraw all from pool (tokens, and nfts) do this
  //call the pool address call the multicall function
  //pass in these parameters: ()

  async function transferOwnership(targetPool) {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const SudoSwapPoolContract = new Contract(
      targetPool,
      SudoSwapPoolABI,
      signer
    );
    try {
      const res = await SudoSwapPoolContract.transferOwnership(newOwner, "0x", {
        value: parseEther("0.000004"),
      });
      const reciept = await res.wait();
      console.log(await reciept);
      activateLoading();
    } catch (error) {
      console.log(error);
    }
  }

  //depositing goddog works perfectly
  async function depositGoddog(targetPool) {
    await approveGoddog();
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const SudoSwapContract = new Contract(
      "0x605145D263482684590f630E9e581B21E4938eb8",
      SudoSwapABI,
      signer
    );
    try {
      const res = await SudoSwapContract.depositERC20(
        goddogContract,
        targetPool,
        ethers.BigNumber.from(goddogToDeposit)
          .mul(ethers.BigNumber.from("10").pow(18))
          .toString()
      );
      const reciept = await res.wait();
      console.log(await reciept);
    } catch (error) {
      console.log(error);
    }
  }

  async function approveGoddog() {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const goddogContractInstance = new Contract(
      goddogContract,
      GodDogABI,
      signer
    );
    try {
      const res = await goddogContractInstance.approve(
        "0x605145D263482684590f630E9e581B21E4938eb8",
        "99999999999999999999999999999999"
      );

      const reciept = await res.wait();
      console.log(await reciept);
    } catch (error) {
      console.log(error);
    }
  }

  async function approveShareSpending() {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const friendTechWrapperContract = new Contract(
      friendWrapperContract,
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

  //deposit works perfectly
  async function depositSpecificShares(targetId, targetPool) {
    await approveShareSpending();
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const SudoSwapContract = new Contract(
      "0x605145D263482684590f630E9e581B21E4938eb8",
      SudoSwapABI,
      signer
    );
    try {
      const res = await SudoSwapContract.depositERC1155(
        friendWrapperContract,
        targetId,
        targetPool,
        sharesToDeposit
      );
      const reciept = await res.wait();
      console.log(await reciept);

      activateLoading();
      getSharesData();
    } catch (error) {
      console.log(error);
    }
  }

  //works perfectly all we gotta do is get the current token balance of the pool
  async function withdrawGoddog(targetPool) {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const SudoSwapPoolContract = new Contract(
      targetPool,
      SudoSwapPoolABI,
      signer
    );
    try {
      const res = await SudoSwapPoolContract.withdrawERC20(
        goddogContract,
        ethers.BigNumber.from(goddogToWithdraw)
          .mul(ethers.BigNumber.from("10").pow(18))
          .toString()
      );
      const reciept = await res.wait();
      console.log(await reciept);
      activateLoading();
      displayPools(false);
      getSharesData();
    } catch (error) {
      console.log(error);
    }
  }
  async function withdrawSpecificShares(targetId, targetPool) {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const SudoSwapPoolContract = new Contract(
      targetPool,
      SudoSwapPoolABI,
      signer
    );
    try {
      const res = await SudoSwapPoolContract.withdrawERC1155(
        friendWrapperContract,
        [targetId],
        [sharesToWithdraw]
      );
      const reciept = await res.wait();
      console.log(await reciept);
      activateLoading();
      displayPools(false);
      getSharesData();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={
        displayPools ? `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ` : null
      }
    >
      {displayPools ? (
        <>
          {poolData.map((item) => {
            console.log(item?.poolData?.sharePoolData?.tokenBalance);
            return (
              <div
                key={item}
                className="w-[180px] md:w-[200px] card rounded-lg mx-auto p-2 border border-neutral-800 bg-gradient-to-tr from-stone-950 to-neutral-950 rounded-xl mt-3"
              >
                <div className="">
                  <div className=" text-white gap-2">
                    <figure className={`relative "w-full}`}>
                      <Link
                        to={`/friend/${item?.poolData?.shareData?.address}`}
                        className="text-white text-[10px] hover:underline  "
                      >
                        <img
                          src={item?.poolData?.shareData?.ftPfpUrl}
                          alt=""
                          className="w-full h-full rounded-lg  "
                        />
                      </Link>
                      <span
                        className={`absolute top-0 right-0 badge badge-dark rounded-sm border border-stone-700 text-[10px]`}
                      >
                        #{item?.poolData?.shareData?.id}
                      </span>
                    </figure>
                  </div>
                  <div className="flex justify-start gap-1 ms-2 md:p-2">
                    <Link
                      to={`/friend/${item?.poolData?.shareData?.address}`}
                      className="text-white font-mono font-bold whitespace-nowrap text-[10px] md:text-[12px] overflow-hidden hover:underline hover:text-stone-700"
                    >
                      {item?.poolData?.shareData?.ftName}
                    </Link>
                    <MdVerified className="text-blue-500 size-3 md:size-4" />
                  </div>
                  <div className="text-start p-2 font-mono text-[9px] card-body ">
                    <div>
                      {" "}
                      <Link
                        to={`https://sudoswap.xyz/#/manage/base/${item?.poolData?.sharePoolData?.address}`}
                        className="font-mono hover:underline hover:text-gray-300 font-bold"
                      >
                        <div className="flex gap-1 ms-0.5">
                          <FaExternalLinkAlt className="text-gray-400 mt-0.5" />
                          {item?.poolData?.sharePoolData?.address.slice(0, 4) +
                            "..." +
                            item?.poolData?.sharePoolData?.address.slice(
                              item?.poolData?.sharePoolData?.address.length - 4,
                              item?.poolData?.sharePoolData?.address.length
                            )}
                        </div>
                      </Link>{" "}
                    </div>
                    <div className="flex gap-0.5">
                      <img
                        src={item?.poolData?.sharePoolData?.IMG}
                        alt=""
                        className="size-4 rounded-full"
                      />
                      <h3 className="mt-[1px]">
                        {uintFormat(
                          item?.poolData?.sharePoolData?.spotPrice
                        ).toFixed(2)}{" "}
                      </h3>
                    </div>
                    <div className="ms-1">
                      {Number(
                        uintFormat(item?.poolData?.sharePoolData?.fee) * 100
                      ).toFixed(1)}{" "}
                      % Fee
                    </div>
                  </div>
                  <div>
                    <button
                      className=" text-[9px] font-bold p-1 w-full border bg-gray-200 text-black border-neutral-900 rounded-lg hover:bg-stone-400"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPool(item);
                        document.getElementById("my_modal_1").showModal();
                      }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box bg-neutral-900">
                    <div className="text-start">
                      <PoolsManageDialoge
                        currentPool={currentPool}
                        getActivePools={getActivePools}
                      />
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

export default Pools;
