import { useEffect, useState } from "react";
import { findId } from "../requests/friendCalls";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { readContract } from "@wagmi/core";
import { config } from "../config";
import FriendTechABi from "../abi/FriendTechABi";
import { uintFormat } from "../formatters/format";
import { Link } from "react-router-dom";
import { useBalance } from "wagmi";
import { useLocation } from "react-router-dom";
import {
  getShareUri,
  getShareBalance,
  getSingleBuyNftPrice,
  getSingleSellNftPrice,
  isPoolWrapped,
} from "../requests/txRequests";
import { SearchByContract } from "../requests/friendCalls";
import { getEthPrice } from "../requests/priceCalls";
import { supabase } from "../client";
import { Quoter } from "sudo-defined-quoter";
import CardBuilder from "./NewHome/CardBuilder";
import { base } from "wagmi/chains";

import Pools from "./Pools";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI";
import friendTechABI from "../abi/FriendTechABi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import {
  getExistingPools,
  getStakedWrappedPools,
} from "../requests/SudoSwapRequests";
import {
  getStakerInfo,
  withdrawStakedWrappedPool,
} from "../requests/stakingRequests";
function NewBalances() {
  const API_KEY = import.meta.env.VITE_DEFINED_KEY;

  const [balanceData, setBalanceData] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const { wallets } = useWallets();
  const userAddress = wallets[0]?.address;
  const [hasUserName, setHasUserName] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [userPools, setUserPools] = useState(null);
  const [viewShareHoldings, setViewShareHoldings] = useState(true);
  const [viewWrappedPools, setViewWrappedPools] = useState(false);
  const [viewPools, setViewPools] = useState(false);
  const [viewStakedPools, setViewStakedPools] = useState(false);

  const [transferShares, setTransferShares] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [existingPools, setExistingPools] = useState(null);
  const [stakedPools, setStakedPools] = useState(null);
  const [stakingStats, setStakingStats] = useState(null);

  const wrappedPoolsBalance = useBalance({
    address: userAddress,
    token: "0x8D3C4a673Dd2fAC51d4fde7A42a0dfc5E4DCb228",
    chainId: base.id,
  });
  useEffect(() => {
    console.log(wrappedPoolsBalance);
    getStakingInfo();
    getExistingPoolsHolding();
    getShareHoldings();
    getExistingPoolsHolding();

    fetchUsers();
    getStaked();
    getEthereumPrice();
    getActivePools();
  }, []);

  useEffect(() => {
    if (viewStakedPools) {
      getStaked();
    }
  }, [viewStakedPools]);

  async function getActivePools() {
    setUserPools(null);

    let usersFoundPools = [];
    let q = new Quoter(API_KEY, 8453);
    let a = await q.getPoolsForCollection(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
    );
    for (const key in a) {
      const currentOwner = a[key].owner;
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
      console.log(ERC20IMG);
      if (currentOwner.localeCompare(userAddress.trim().toLowerCase()) === 0) {
        const currentPool = a[key];
        currentPool.IMG = ERC20IMG;
        usersFoundPools.push(currentPool);
      }
    }
    console.log(usersFoundPools);
    setUserPools(usersFoundPools);
  }

  function handleView() {
    if (viewShareHoldings) {
      setViewShareHoldings(false);
    } else {
      setViewShareHoldings(true);
    }
  }

  async function getEthereumPrice() {
    const ethereumPrice = await getEthPrice();
    setEthPrice(ethereumPrice);
  }

  async function getShareHoldings() {
    const userHoldingsFormatted = [];
    const userSharesHoldings = await findId(userAddress);
    for (const key in userSharesHoldings) {
      const currentShare = userSharesHoldings[key];
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
      userHoldingsFormatted.push({
        nftID: currentShare?.identifier,
        contract: currentShareCA,
        balance: shareBalance,
        FTData: currentShareFTData,
      });
    }
    setBalanceData(userHoldingsFormatted);
  }

  async function fetchUsers() {
    try {
      const { data, error } = await supabase.from("usernames").select();
      if (error) {
        console.error("Error fetching usernames:", error.message);
        return;
      }

      if (data) {
        console.log("Fetched usernames:", data);
        for (const key in data) {
          if (data[key]?.user_address === userAddress) {
            setCurrentUserName(data[key]);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  }

  async function getExistingPoolsHolding() {
    const poolFormattedData = await getExistingPools(userAddress);
    console.log(poolFormattedData);

    setExistingPools(poolFormattedData);
  }

  async function getStakingInfo() {
    const userStakingInfo = await getStakerInfo(userAddress);
    setStakingStats(userStakingInfo);
  }

  async function getStaked() {
    const res = await getStakedWrappedPools(userAddress, stakingStats);
    console.log(res);
    setStakedPools(res);
  }

  async function withdraw(nftID) {
    const provider = await wallets[0]?.getEthersProvider();
    const network = await provider.getNetwork();

    const signer = await provider?.getSigner();
    const res = await withdrawStakedWrappedPool(signer, nftID);
    if (!res?.failed) {
      getStakerInfo();
      getStaked();
    }
  }
  async function claim() {}

  return (
    <div className="mt-1 ">
      <div
        className={`border border-t-0 border-r-0 border-l-0 w-screen  border-stone-800 `}
      >
        <div className="text-[10px] mt-5">
          <div className="mb-2 p-2 flex gap-2 size-[50px] text-[15px] font-bold">
            <img
              src={currentUserName?.img_url}
              alt=""
              className=" rounded-full"
            />
            {currentUserName && (
              <h3 className="text-white mt-2">{currentUserName?.username}</h3>
            )}
          </div>
          <div className="flex justify-start gap-2 ">
            <button
              onClick={() => {
                setViewShareHoldings(true);
                setViewPools(false);
                setViewStakedPools(false);
                setViewWrappedPools(false);
              }}
              className={`hover:border hover:border-t-0 hover:border-r-0 p-1 hover:border-l-0  font-bold ${
                viewShareHoldings === true &&
                `border border-t-0 border-r-0 border-l-0 text-white font-bold`
              }`}
            >
              Shares
            </button>
            <button
              onClick={() => {
                setViewShareHoldings(false);
                setViewWrappedPools(false);
                setViewStakedPools(false);

                setViewPools(true);
              }}
              className={` hover:border hover:border-t-0 hover:border-r-0 hover:border-l-0  p-1  font-bold ${
                viewPools === true &&
                `border  border-t-0 border-r-0 border-l-0 text-white font-bold`
              }`}
            >
              Pools
            </button>
            {/* <button
              onClick={() => {
                setViewShareHoldings(false);
                setViewPools(false);
                setViewStakedPools(false);

                setViewWrappedPools(true);
              }}
              className={` hover:border hover:border-t-0 hover:border-r-0 hover:border-l-0  p-1  font-bold ${
                viewWrappedPools === true &&
                `border  border-t-0 border-r-0 border-l-0 text-white font-bold`
              }`}
            >
              Wrapped Pools
            </button>
            <button
              onClick={() => {
                setViewShareHoldings(false);
                setViewPools(false);

                setViewWrappedPools(false);
                setViewStakedPools(true);
              }}
              className={` hover:border hover:border-t-0 hover:border-r-0 hover:border-l-0  p-1  font-bold ${
                viewStakedPools === true &&
                `border  border-t-0 border-r-0 border-l-0 text-white font-bold`
              }`}
            >
              Staked Pools
            </button> */}
          </div>
        </div>
        {/* <img
          src="https://cdn.pfps.gg/banners/5980-pepe.png"
          alt=""
          className=" rounded-lg  w-full h-full"
        /> */}
      </div>

      {viewShareHoldings ? (
        <>
          {balanceData ? (
            <div className="mt-2 border border-transparent grid grid-cols-2 md:grid-cols-3  w-[375px] h-[400px] md:w-[560px]  gap-x-5 gap-y-4 p-2">
              {balanceData.map((item, index) => {
                return (
                  <CardBuilder
                    key={index}
                    data={item?.FTData}
                    isHero={false}
                    isBalance={true}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    getShareHoldings={getShareHoldings}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center mb-10 mt-[200px]  w-screen">
              <img
                src="https://www.friend.tech/friendtechlogo.png"
                alt=""
                className="w-14 h-14 animate-bounce"
              />
            </div>
          )}
        </>
      ) : (
        <>
          {viewPools ? (
            <div>
              {userPools ? (
                <Pools userPools={userPools} getActivePools={getActivePools} />
              ) : (
                <div className="flex justify-center mb-10 mt-[200px]  w-screen">
                  <img
                    src="https://www.friend.tech/friendtechlogo.png"
                    alt=""
                    className="w-14 h-14 animate-bounce"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {viewWrappedPools ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                  {existingPools ? (
                    <>
                      {existingPools?.map((item) => {
                        if (
                          item?.isWrapped &&
                          item?.wrappedPoolOwner === userAddress
                        ) {
                          return (
                            <div
                              key={item}
                              className="w-[180px] md:w-[200px] card rounded-lg mx-auto p-2 border border-neutral-800 bg-gradient-to-tr from-stone-950 to-neutral-950 rounded-xl mt-3"
                            >
                              <figure
                                className={`relative "w-full  rounded-none`}
                              >
                                <Link
                                  to={`/friend/${item?.friendTechData?.address}`}
                                  className="text-white text-[10px] hover:underline  "
                                >
                                  <img
                                    src={item?.friendTechData?.ftPfpUrl}
                                    alt=""
                                    className="w-full h-full  "
                                  />
                                </Link>
                                <span
                                  className={`absolute top-0 right-0 badge badge-dark rounded-sm border border-stone-700 text-[10px]`}
                                >
                                  #{item?.friendTechData?.id}
                                </span>
                              </figure>
                              <div className="flex justify-start gap-1 ms-2 md:p-2">
                                <Link
                                  to={`/friend/${item?.friendTechData.address}`}
                                  className="text-white font-mono font-bold whitespace-nowrap text-[10px] md:text-[12px] overflow-hidden hover:underline hover:text-stone-700"
                                >
                                  {item?.friendTechData?.ftName}
                                </Link>
                                <MdVerified className="text-blue-500 size-3 md:size-4" />
                              </div>
                              <div className="text-start p-2 font-mono text-[9px] card-body ">
                                <div>
                                  {" "}
                                  <Link
                                    to={`https://sudoswap.xyz/#/manage/base/${item?.poolData?.address}`}
                                    className="font-mono hover:underline hover:text-gray-300 font-bold"
                                  >
                                    <div className="flex gap-1 ms-0.5">
                                      <FaExternalLinkAlt className="text-gray-400 mt-0.5" />
                                      {item?.sudoSwapData?.address.slice(0, 4) +
                                        "..." +
                                        item?.sudoSwapData?.address.slice(
                                          item?.sudoSwapData?.address.length -
                                            4,
                                          item?.sudoSwapData?.address.length
                                        )}
                                    </div>
                                  </Link>{" "}
                                </div>
                                <div className="flex gap-0.5">
                                  <img
                                    src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                                    alt=""
                                    className="size-4"
                                  />
                                  <h3 className="mt-[1px]">
                                    {uintFormat(
                                      item?.sudoSwapData.spotPrice
                                    ).toFixed(2)}{" "}
                                  </h3>
                                </div>
                                <div className="ms-1">
                                  {Number(
                                    uintFormat(item?.sudoSwapData?.fee) * 100
                                  ).toFixed(1)}{" "}
                                  % Fee
                                </div>
                              </div>
                              <div>
                                <button className=" text-[9px] font-bold p-1 w-full border bg-gray-200 text-black border-neutral-900 rounded-lg hover:bg-stone-400">
                                  Unwrap Pool
                                </button>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </>
                  ) : (
                    <div className="flex justify-center mb-10 mt-[200px]  w-screen">
                      <img
                        src="https://www.friend.tech/friendtechlogo.png"
                        alt=""
                        className="w-14 h-14 animate-bounce"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {viewStakedPools ? (
                    <>
                      {viewStakedPools ? (
                        <>
                          {stakedPools ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                              {stakedPools?.map((item) => {
                                return (
                                  <div
                                    key={item}
                                    className="w-[180px] md:w-[200px] card rounded-lg mx-auto p-2 border border-neutral-800 bg-gradient-to-tr from-stone-950 to-neutral-950 rounded-xl mt-3"
                                  >
                                    <figure
                                      className={`relative "w-full  rounded-none`}
                                    >
                                      <Link
                                        to={`/friend/${item?.friendTechData?.address}`}
                                        className="text-white text-[10px] hover:underline  "
                                      >
                                        <img
                                          src={item?.friendTechData?.ftPfpUrl}
                                          alt=""
                                          className="w-full h-full  "
                                        />
                                      </Link>
                                      <span
                                        className={`absolute top-0 right-0 badge badge-dark rounded-sm border border-stone-700 text-[10px]`}
                                      >
                                        #{item?.friendTechData?.id}
                                      </span>
                                    </figure>
                                    <div className="flex justify-start gap-1 ms-2 md:p-2">
                                      <Link
                                        to={`/friend/${item?.friendTechData.address}`}
                                        className="text-white font-mono font-bold whitespace-nowrap text-[10px] md:text-[12px] overflow-hidden hover:underline hover:text-stone-700"
                                      >
                                        {item?.friendTechData?.ftName}
                                      </Link>
                                      <MdVerified className="text-blue-500 size-3 md:size-4" />
                                    </div>
                                    <div className="text-start p-2 font-mono text-[9px] card-body ">
                                      <div>
                                        {" "}
                                        <Link
                                          to={`https://sudoswap.xyz/#/manage/base/${item?.poolData?.address}`}
                                          className="font-mono hover:underline hover:text-gray-300 font-bold"
                                        >
                                          <div className="flex gap-1 ms-0.5">
                                            <FaExternalLinkAlt className="text-gray-400 mt-0.5" />
                                            {item?.sudoSwapData?.address.slice(
                                              0,
                                              4
                                            ) +
                                              "..." +
                                              item?.sudoSwapData?.address.slice(
                                                item?.sudoSwapData?.address
                                                  .length - 4,
                                                item?.sudoSwapData?.address
                                                  .length
                                              )}
                                          </div>
                                        </Link>{" "}
                                      </div>
                                      <div className="flex gap-0.5">
                                        <img
                                          src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                                          alt=""
                                          className="size-4"
                                        />
                                        <h3 className="mt-[1px]">
                                          {uintFormat(
                                            item?.totalRewards
                                          ).toFixed(2)}
                                          {" Earned"}
                                        </h3>
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <button
                                        className=" text-[9px] font-bold p-1 w-full border bg-gray-200 text-black border-neutral-900 rounded-lg hover:bg-stone-400"
                                        onClick={() => {
                                          withdraw(item?.wrappedPoolID);
                                        }}
                                      >
                                        Unstake
                                      </button>
                                      <button className=" text-[9px] font-bold p-1 w-full border bg-gray-200 text-black border-neutral-900 rounded-lg hover:bg-stone-400">
                                        Claim
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex justify-center mb-10 mt-[200px]">
                              <img
                                src="https://www.friend.tech/friendtechlogo.png"
                                alt=""
                                className="w-20 h-20 animate-bounce"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex justify-center mb-10 mt-[200px]">
                          <img
                            src="https://www.friend.tech/friendtechlogo.png"
                            alt=""
                            className="w-20 h-20 animate-bounce"
                          />
                        </div>
                      )}
                    </>
                  ) : null}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default NewBalances;
