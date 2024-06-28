import { useWallets } from "@privy-io/react-auth";
import { readContract } from "@wagmi/core";
import React, { useEffect, useState } from "react";
import { BsArrowRepeat } from "react-icons/bs";
import { CiWallet } from "react-icons/ci";
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Link } from "react-router-dom";
import { useBalance } from "wagmi";
import { base } from "wagmi/chains";
import FriendABI from "../../abi/FriendABI";
import friendTechABI from "../../abi/FriendTechABi";
import { supabase } from "../../client";
import { config } from "../../config";
import { SearchByUser } from "../../requests/friendCalls";
import { getEthPrice } from "../../requests/priceCalls";
import { postTransaction } from "../../requests/supaBaseHandler";
import { FaEthereum } from "react-icons/fa6";
import { FaCube } from "react-icons/fa";
import {
  getShareBalance,
  getShareBuyTotal,
  getShareSellTotal,
  unwrap,
  wrap,
} from "../../requests/txRequests";
import AvaliablePairs from "./AvailablePairs";
import ChartButton from "./ChartButton";
import RecentTx from "../RecentTx";
import Test from "./Test";
function Swapper(props) {
  const {
    trendingFriends,
    holdingsData,
    getUserHoldings,
    getTrending,
    currentShare,
    setCurrentShare,
    currentSharePrice,
    currentPriceHistory,
    shareTotalVolume,
  } = props;

  const { wallets } = useWallets();
  const userAddress = wallets[0]?.address;
  const [shouldMint, setShouldMint] = useState(true);
  const [shouldBurn, setShouldBurn] = useState(false);
  const [searchInput, setSearchInput] = useState(null);
  const [input, setInput] = useState(null);
  const [currentTotal, setCurrentTotal] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [currentFrenmintUser, setCurrentFrenmintUser] = useState(null);
  const [shareBalance, setShareBalance] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [getTx, setGetTx] = useState(true);

  const ethBal = useBalance({
    address: userAddress,
    chainId: base.id,
  });
  const [ethBalance, setEthBalance] = useState(null);

  console.log(Number(ethBal?.data?.formatted).toFixed(6));
  useEffect(() => {
    getprice();
    fetchFrenmintUsers();
  }, []);
  useEffect(() => {
    setEthBalance(Number(ethBal?.data?.formatted).toFixed(6));
  });
  useEffect(() => {
    console.log(searchInput);
    if (searchInput) {
      searchUser();
    }
  }, [searchInput]);

  useEffect(() => {
    getBalance();
  }, [currentShare]);

  async function getBalance() {
    const balRes = await getShareBalance(
      readContract,
      config,
      friendTechABI,
      userAddress,
      currentShare?.address
    );
    setShareBalance(balRes);
  }

  useEffect(() => {
    console.log(input);
    if (shouldMint) {
      console.log("mint");
      calculateBuyTotal();
    } else {
      console.log("burn");
      calculateSellTotal();
    }
  }, [input]);

  async function getprice() {
    const res = await getEthPrice();
    setEthPrice(res);
  }

  async function fetchFrenmintUsers() {
    const { data, error } = await supabase.from("usernames").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      for (const key in data) {
        if (data[key]?.user_address === userAddress) {
          console.log(data[key]?.username);
          setCurrentFrenmintUser(data[key]?.username);
        }
      }
    }
  }

  async function calculateBuyTotal() {
    const buyTotal = await getShareBuyTotal(
      readContract,
      config,
      FriendABI,
      currentShare?.address,
      input
    );
    setCurrentTotal(buyTotal);
  }
  async function calculateSellTotal() {
    const sellTotal = await getShareSellTotal(
      readContract,
      config,
      FriendABI,
      currentShare?.address,
      input
    );
    setCurrentTotal(sellTotal);
  }

  async function searchUser() {
    const result = await SearchByUser(searchInput);
    setSearchResults(result);
  }
  async function wrapToken() {
    const provider = await wallets[0]?.getEthersProvider();
    const signer = await provider?.getSigner();

    const txRes = await wrap(
      signer,
      input,
      currentTotal,
      currentShare?.address
    );
    finalizedModal(txRes);

    if (!txRes?.failed) {
      await postTransaction(
        supabase,
        currentShare,
        input,
        userAddress,
        true,
        currentTotal,
        currentFrenmintUser
      );
    }
    setGetTx(true);
  }

  async function unwrapToken() {
    const provider = await wallets[0]?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();

    const txRes = await unwrap(
      signer,
      input,
      currentTotal,
      currentShare?.address
    );
    finalizedModal(txRes);

    if (!txRes?.failed) {
      await postTransaction(
        supabase,
        currentShare,
        input,
        userAddress,
        false,
        currentTotal,
        currentFrenmintUser
      );
    }
    setGetTx(true);
  }

  function finalizedModal(res) {
    if (res.failed === false) {
      setModalMessage({
        message: `${res.type} successful!`,
        variant: "green",
        failed: res.failed,
        hash: res?.receipt?.transactionHash,
      });
    } else if (res.failed === true) {
      console.log("failed tx");
      setModalMessage({
        message: `${res.type} unexpectedly failed`,
        variant: "red",
        failed: res.failed,
        hash: null,
      });
    }
    document.getElementById("my_modal_25").showModal();
  }

  return (
    <>
      <div className="border border-transparent bg-stone-900 p-2 rounded-md w-[400px] mx-auto">
        <RecentTx
          getTx={getTx}
          setGetTx={setGetTx}
          modalMessage={modalMessage}
        />
        <dialog id="my_modal_25" className="modal">
          <div className="modal-box bg-neutral-900">
            <div className="mb-3">
              {modalMessage?.failed ? (
                <MdError
                  className={`text-[100px] text-${modalMessage?.variant}-500 ms-auto me-auto`}
                />
              ) : (
                <FaCheckCircle className="text-[100px] text-green-500 ms-auto me-auto " />
              )}
            </div>
            <h3 className="font-bold text-[10px] font-mono text-center">
              {modalMessage?.message}
            </h3>

            {modalMessage?.failed ? (
              <h3 className="text-[8px] text-center mt-1">
                Please make sure you have enough to cover gas and tokens as well
              </h3>
            ) : (
              <div className="text-center text-[10px] mt-2">
                <Link
                  to={`https://basescan.org/tx/${modalMessage?.hash}`}
                  target="_blank"
                  className=""
                >
                  <div className="flex justify-center gap-2">
                    <div className="flex gap-1 hover:text-stone-800">
                      <FaExternalLinkAlt className="text-[13px] mt-1" />
                      <h3 className="mt-1">Tx Hash</h3>
                    </div>
                    <Link
                      to={"/new"}
                      className="flex gap-1 mt-0.5 hover:text-stone-800"
                    >
                      <CiWallet className="text-[18px]" />
                      <h3 className="mt-0.5">wallet</h3>
                    </Link>
                  </div>
                </Link>
              </div>
            )}
            <div className="mt-2">
              <button
                onClick={() => {
                  document.getElementById("my_modal_25").close();
                }}
                className="border w-full rounded-md text-[12px] border-stone-900 bg-blue-500 text-white font-mono font-bold p-1 hover:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                if (!modalMessage?.failed) {
                  // getActivePools();
                  // getExistingPools();
                }
              }}
            >
              close
            </button>
          </form>
        </dialog>
        <div className="flex justify-between text-white text-[12px] font-bold p-2">
          <h3 className="">{shouldMint ? "Mint" : "Burn"}</h3>
          <ChartButton
            currentPriceHistory={currentPriceHistory}
            currentShare={currentShare}
            shareTotalVolume={shareTotalVolume}
          />
        </div>
        <div className="grid grid-rows-1 gap-y-1 p-1">
          <div className="border p-2 rounded-lg border-neutral-700 text-white font-mono font-bold text-[10px]">
            <div className="flex justify-between">
              <h3>{shouldMint ? "You Buy" : "You Sell"}</h3>
            </div>

            <div className="flex justify-between">
              <input
                type="text"
                className="w-[150px] bg-transparent border border-transparent outline-none text-[14px]"
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    setInput(Number(e.target.value));
                  }
                }}
                value={input || 0}
              />
              <button
                className="border w-[150px] rounded-md border-neutral-600 bg-stone-800 hover:text-stone-500"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                <div className="flex justify-between gap-1 p-0.5">
                  <div className="flex justify-start gap-1">
                    <img
                      src={currentShare?.ftPfpUrl}
                      alt=""
                      className="w-3 h-3 mt-[3px] ms-1 rounded-full"
                    />
                    <h3 className="whitespace-nowrap truncate text-[8px] mt-0.5">
                      {currentShare?.ftName}
                    </h3>
                  </div>
                  <img
                    src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                    alt=""
                    className="w-3 h-3 mt-1"
                  />
                </div>
              </button>
            </div>

            <div></div>
            <div className="flex justify-between mt-2">
              <h3 className="text-[7px]">
                {"≈ " + Number(currentTotal * ethPrice).toFixed(2) + " USD"}
              </h3>
              <h3 className="text-[8px]">
                ERC-1155 share balance:{" " + shareBalance}
              </h3>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className=" w-[40px] p-2 rounded-md flex justify-center text-[8px] text-stone-200 gap-1 hover:animate-spin"
              onClick={() => {
                if (shouldBurn) {
                  setShouldBurn(false);
                  setShouldMint(true);
                } else {
                  setShouldMint(false);

                  setShouldBurn(true);
                }
              }}
            >
              <BsArrowRepeat className="text-[12px]" />
            </div>
          </div>

          <div className="border border-neutral-700 rounded-lg text-white font-mono font-bold text-[10px] p-2">
            <div className="flex justify-between">
              <h3>{shouldMint ? "You Pay" : "You Recieve"}</h3>
            </div>
            <div className="flex justify-between">
              <input
                type="text"
                className="w-[150px] bg-transparent border border-transparent outline-none text-[14px]"
                value={currentTotal || 0}
              />
              <button className="border w-[150px] rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500">
                <div className="flex justify-between gap-1 p-0.5">
                  <div className="flex justify-start gap-1">
                    <img
                      src={AvaliablePairs[0]?.imgUrl}
                      alt=""
                      className="w-3 h-3 mt-[3px] ms-1"
                    />
                    <h3 className="text-[8px] mt-[3px]">
                      {AvaliablePairs[0]?.name}
                    </h3>
                  </div>
                  <img
                    src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                    alt=""
                    className="w-3 h-3 mt-1"
                  />
                </div>
              </button>
            </div>
            <div className="flex justify-between mt-2">
              <h3 className="text-[7px]">
                {"≈ " + Number(currentTotal * ethPrice).toFixed(2) + " USD"}
              </h3>
              <h3 className="text-[8px]">
                ETH balance:{" " + ethBalance || 0}
              </h3>
            </div>
          </div>
          <div className="">
            <div className="p-2 text-[8px] mb-2">
              <Link
                to={`https://basescan.org/address/${currentShare?.address}`}
                target="_blank"
                className="hover:underline text-gray-200 "
              >
                <div className="flex gap-1 ">
                  <FaCube className="text-[10px] text-gray-500 mt-[1px]" />
                  {currentShare?.address.slice(0, 4) +
                    "..." +
                    currentShare?.address.slice(
                      currentShare?.address.length - 4,
                      currentShare?.address.length
                    )}
                </div>
              </Link>
              <div className="flex gap-0.5 text-gray-200">
                <FaEthereum className="mt-1 text-[11px] text-gray-500" />
                <h3 className="mt-[3.5px] font-bold">
                  {currentSharePrice} / Share
                </h3>
              </div>
            </div>

            <button
              className="w-full border border-neutral-800 bg-blue-500 hover:bg-stone-800 rounded-lg text-white font-bold text-[12px] p-1"
              onClick={() => {
                if (shouldBurn) {
                  console.log("burn");
                  unwrapToken();
                } else {
                  console.log("mint");
                  wrapToken();
                }
              }}
            >
              {shouldMint ? "Mint" : "Burn"}
            </button>
          </div>
        </div>

        <dialog id="my_modal_1" className="modal modal-bottom md:modal-middle">
          <div className="modal-box bg-neutral-900 h-[400px] md:h-auto">
            <div className="flex gap-1">
              <img
                src="https://www.friend.tech/friendtechlogo.png"
                alt=""
                className="size-5"
              />
              <h3 className="font-bold text-sm mb-2">Select </h3>
            </div>
            <div className="relative">
              <input
                type="text"
                className="pl-9 pr-3 py-2 w-full text-[10px] bg-stone-800  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Search..."
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mb-3 mt-3 flex gap-3">
              {trendingFriends?.map((item, index) => {
                if (index < 4) {
                  return (
                    <button
                      key={item}
                      className="border rounded-full bg-stone-950 border-stone-900 hover:bg-stone-800"
                      onClick={() => {
                        setCurrentShare(item);
                        document.getElementById("my_modal_1").close();
                      }}
                    >
                      <div className="flex justify-start text-[8px] p-1.5 gap-1.5 whitespace-nowrap">
                        <img
                          src={item?.ftPfpUrl}
                          alt=""
                          className="size-4 rounded-full"
                        />
                        <h3 className="mt-0.5">{item?.ftName}</h3>
                      </div>
                    </button>
                  );
                }
              })}
            </div>

            <div className="overflow-y-auto  h-[270px] md:h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
              {searchResults ? (
                <>
                  {searchResults.map((item) => {
                    const slicedContract = `${item?.address.slice(0, 4)}...${item?.address.slice(item?.address.length - 4, item?.address.length)}`;
                    return (
                      <button
                        key={item}
                        className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                        onClick={() => {
                          setCurrentShare(item);
                          document.getElementById("my_modal_1").close();
                        }}
                      >
                        <div className="flex justify-start gap-2">
                          <img
                            src={item?.ftPfpUrl}
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                          <h3 className="mt-1">{item?.ftName}</h3>
                        </div>
                        <div className="flex justify-end">{slicedContract}</div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <>
                  {trendingFriends ? (
                    <>
                      {trendingFriends.map((item) => {
                        const slicedContract = `${item?.address.slice(0, 4)}...${item?.address.slice(item?.address.length - 4, item?.address.length)}`;
                        return (
                          <button
                            key={item}
                            className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                            onClick={() => {
                              setCurrentShare(item);
                              document.getElementById("my_modal_1").close();
                            }}
                          >
                            <div className="flex justify-start gap-2">
                              <img
                                src={item?.ftPfpUrl}
                                alt=""
                                className="w-5 h-5 rounded-full"
                              />
                              <h3 className="mt-1">{item?.ftName}</h3>
                            </div>
                            <div className="flex justify-end">
                              {slicedContract}
                            </div>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="flex justify-center mb-10 mt-[100px]">
                      <img
                        src="https://www.friend.tech/friendtechlogo.png"
                        alt=""
                        className="size-10 animate-bounce"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
      <Test data={currentPriceHistory} />
    </>
  );
}

export default Swapper;
