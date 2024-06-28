import { useWallets } from "@privy-io/react-auth";
import { readContract } from "@wagmi/core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { BsArrowRepeat } from "react-icons/bs";
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Link } from "react-router-dom";
import { Quoter } from "sudo-defined-quoter";
import { useBalance } from "wagmi";
import { base } from "wagmi/chains";
import friendTechABI from "../../abi/FriendTechABi";
import SudoSwapPoolABI from "../../abi/SudoSwapPoolABI";
import SudoSwapPoolTXABI from "../../abi/SudoSwapPoolTXABI";
import { config } from "../../config";
import { uintFormat } from "../../formatters/format";
import { SearchByContract } from "../../requests/friendCalls";
import { getEthPrice, getGoddogPrice } from "../../requests/priceCalls";
import {
  buyPool,
  getShareBalance,
  getShareUri,
  getSingleBuyNftPrice,
  getSingleSellNftPrice,
  sellPool,
} from "../../requests/txRequests";
import AvaliablePairs from "./AvailablePairs";
import ChartButton from "./ChartButton";

function PoolSwap(props) {
  const {
    setCurrentShare,
    currentShare,
    currentPriceHistory,
    shareTotalVolume,
  } = props;
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const goddogBalanceResult = useBalance({
    address: w0?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });
  const [goddogBalance, setGoddogBalance] = useState(null);
  const [availablePools, setAvailablePools] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [buyFromPool, setBuyFromPool] = useState(true);
  const [uintTotal, setUintTotal] = useState(null);
  const [goddogPrice, setGoddogPrice] = useState(null);
  const [shareBalance, setShareBalance] = useState(null);
  const [input, setInput] = useState(null);
  const [total, setTotal] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    getPrice();
    getExistingPools();
  }, []);
  useEffect(() => {
    setGoddogBalance(uintFormat(goddogBalanceResult?.data?.value).toFixed(2));
  });

  useEffect(() => {
    getBalance();
  }, [currentShare]);
  console.log(selectedPool);
  useEffect(() => {
    console.log(input);
    if (buyFromPool) {
      console.log("buy");
      getBuyNftQuote();
    } else {
      console.log("sell");
      getSellNftQuote();
    }
  }, [input]);

  async function getBalance() {
    const balRes = await getShareBalance(
      readContract,
      config,
      friendTechABI,
      w0?.address,
      currentShare?.address
    );
    setShareBalance(balRes);
  }

  async function getPrice() {
    const res = await getGoddogPrice();
    const ethRes = await getEthPrice();
    console.log(ethRes);
    console.log(res);
    setEthPrice(ethRes);
    setGoddogPrice(res);
  }

  async function buyInPool(nftId, poolAddress, spotPrice) {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const buyPrice = await getSingleBuyNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      nftId,
      poolAddress,
      String(input)
    );

    const parameters = [
      [
        [
          poolAddress,
          false,
          [String(input)],
          ethers.BigNumber.from(String(buyPrice)),
          "0",
          ethers.BigNumber.from(String(spotPrice)),
          [ethers.BigNumber.from(String(buyPrice))],
        ],
      ],
      [],
      String(w0?.address),
      String(w0?.address),
      false,
    ];

    const txRes = await buyPool(
      signer,
      SudoSwapPoolTXABI,
      parameters,
      w0?.address
    );
    if (!txRes?.failed) {
      getBalance();
    }
    finalizedModal(txRes);
  }

  async function sellInPool(nftId, poolAddress, spotPrice) {
    const provider = await w0?.getEthersProvider();

    const signer = await provider?.getSigner();
    const sellPrice = await getSingleSellNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      nftId,
      poolAddress,
      String(input)
    );

    const parameters = [
      [],
      [
        [
          poolAddress,
          false,
          false,
          [String(input)],
          false,
          "0x",
          ethers.BigNumber.from(String(sellPrice)),
          ethers.BigNumber.from(String(spotPrice)),
          [ethers.BigNumber.from(String(sellPrice))],
        ],
      ],
      String(w0?.address),
      String(w0?.address),
      false,
    ];
    const txRes = await sellPool(
      signer,
      SudoSwapPoolTXABI,
      parameters,
      w0?.address
    );
    if (!txRes?.failed) {
      getBalance();
    }
    finalizedModal(txRes);
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
    document.getElementById("my_modal_23").showModal();
  }

  async function getSellNftQuote() {
    console.log(input);
    const sellPrice = await getSingleSellNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      selectedPool?.sudoSwapData?.erc1155Id,
      selectedPool?.sudoSwapData?.address,
      String(input)
    );

    setUintTotal(sellPrice);
    setTotal(Number(sellPrice) / 10 ** 18);
  }
  async function getBuyNftQuote() {
    console.log(input);
    const buyPrice = await getSingleBuyNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      selectedPool?.sudoSwapData?.erc1155Id,
      selectedPool?.sudoSwapData?.address,
      String(input)
    );
    console.log(buyPrice);
    setTotal(Number(buyPrice) / 10 ** 18);
  }

  async function getExistingPools() {
    let q = new Quoter(import.meta.env.VITE_DEFINED_KEY, 8453);
    let a = await q.getPoolsForCollection(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
    );
    const poolFormattedData = [];
    console.log(a);
    for (const key in a) {
      const currentId = a[key]?.erc1155Id;
      const currentShareContract = await getShareUri(
        readContract,
        config,
        friendTechABI,
        currentId
      );
      console.log(currentShareContract);
      const currentPoolAddress = a[key].address;
      if (currentShareContract !== null) {
        const currentShareData = await SearchByContract(currentShareContract);
        console.log(currentShareData);
        if (currentShareData !== null) {
          const userShareBalance = await getShareBalance(
            readContract,
            config,
            friendTechABI,
            w0?.address,
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
          console.log(buyPrice);
          const sellPrice = await getSingleSellNftPrice(
            readContract,
            config,
            SudoSwapPoolABI,
            currentId,
            currentPoolAddress,
            "1"
          );
          console.log(sellPrice);
          poolFormattedData.push({
            sudoSwapData: a[key],
            friendTechData: currentShareData,
            userShareBalance: userShareBalance,
            buyPrice: Number(sellPrice),
            sellPrice: buyPrice,
            address: currentShareData?.address,
          });
        }
      }
    }
    console.log(poolFormattedData);
    setSelectedPool(poolFormattedData[0]);
    setAvailablePools(poolFormattedData);
  }
  return (
    <div className="border border-transparent bg-stone-900 p-2 rounded-md w-[400px] mx-auto">
      {/*  */}
      <dialog id="my_modal_23" className="modal">
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
                <div className="flex justify-center gap-1">
                  <FaExternalLinkAlt className="text-[13px] mt-1" />
                  <h3 className="mt-1">Tx Hash</h3>
                </div>
              </Link>
            </div>
          )}
          <div className="mt-2">
            <button
              onClick={() => {
                document.getElementById("my_modal_23").close();
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
                getExistingPools();
              }
            }}
          >
            close
          </button>
        </form>
      </dialog>
      {/*  */}
      <div className="flex justify-between text-white text-[12px] font-bold p-2">
        <div className="flex gap-1">
          <img
            src="https://avatars.githubusercontent.com/u/94413972?s=280&v=4"
            alt=""
            className="size-5 "
          />
          <h3 className="">{buyFromPool ? "Buy" : "Sell"}</h3>
        </div>
        <div>
          <ChartButton
            shareTotalVolume={shareTotalVolume}
            currentPriceHistory={currentPriceHistory}
            currentShare={currentShare}
          />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-y-1 p-1">
        <div className="border p-2 rounded-lg border-neutral-700 text-white font-mono font-bold text-[12px]">
          <div className="flex justify-between">
            <h3>{buyFromPool ? "You buy" : "You sell"}</h3>
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
              className="border w-[150px] rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500"
              onClick={() => document.getElementById("my_modal_1").showModal()}
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
          <div className="flex justify-between mt-2">
            <h3 className="text-[7px]">
              {"≈ " +
                Number(
                  uintFormat(currentShare?.displayPrice) * ethPrice * input
                ).toFixed(2) +
                " USD"}
            </h3>
            <h3 className="text-[8px]">
              ERC-1155 share balance:{" " + shareBalance || 0}
            </h3>
          </div>
        </div>
        <div className=" ms-[170px]">
          <div
            className="border border-transparent w-[40px]  p-2 rounded-md flex justify-center text-[8px] text-stone-200 gap-1 hover:animate-spin"
            onClick={() => {
              if (buyFromPool) {
                setBuyFromPool(false);
              } else {
                setBuyFromPool(true);
              }
            }}
          >
            <BsArrowRepeat className="text-[12px]" />
          </div>
        </div>

        <div className="border border-neutral-700 rounded-lg text-white font-mono font-bold text-[12px] p-2">
          <div className="flex justify-between">
            <h3>{buyFromPool ? "You pay" : "You recieve"}</h3>
          </div>
          <div className="flex justify-between">
            <input
              type="text"
              disabled="true"
              className="w-[150px] bg-transparent border border-transparent outline-none text-[14px]"
              value={total ? total.toFixed(2) : 0}
            />
            <button className="border w-[150px] rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500">
              <div className="flex justify-between gap-1 p-0.5">
                <div className="flex justify-start gap-1">
                  <img
                    src={AvaliablePairs[1]?.imgUrl}
                    alt=""
                    className="w-3 h-3 mt-[3px] ms-1"
                  />
                  <h3 className="text-[8px] mt-[3px]">
                    {AvaliablePairs[1]?.name}
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
              {"≈ " +
                Number(total?.toFixed(2) * goddogPrice).toFixed(2) +
                " USD"}
            </h3>
            <h3 className="text-[8px]">
              $oooOOO balance:{" " + goddogBalance || 0}
            </h3>
          </div>
        </div>
        <div className="">
          <div className="p-2 text-[8px] mb-2">
            <h3>Pool Ca: {selectedPool?.sudoSwapData?.address}</h3>

            <h3>{uintFormat(currentShare?.displayPrice)} Ξ / Share</h3>
          </div>

          <button
            className="w-full border border-neutral-800 bg-blue-500 rounded-lg text-white font-bold text-[12px] p-1"
            onClick={() => {
              if (buyFromPool) {
                console.log("buy");
                console.log(uintFormat(selectedPool?.sudoSwapData?.spotPrice));
                buyInPool(
                  selectedPool?.sudoSwapData?.erc1155Id,
                  selectedPool?.sudoSwapData?.address,
                  selectedPool?.sudoSwapData?.spotPrice
                );
              } else {
                console.log("sell");
                sellInPool(
                  selectedPool?.sudoSwapData?.erc1155Id,
                  selectedPool?.sudoSwapData?.address,
                  selectedPool?.sudoSwapData?.spotPrice
                );
              }
            }}
          >
            {buyFromPool ? "Purchase Shares" : "Sell Shares"}
          </button>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal modal-bottom md:modal-middle">
        <div className="modal-box bg-neutral-900  h-[400px] md:h-auto">
          <div className="flex gap-1">
            <img
              src="https://www.friend.tech/friendtechlogo.png"
              alt=""
              className="size-5"
            />
            <h3 className="font-bold text-sm mb-2">Select </h3>
          </div>
          <div className="relative mb-2">
            <input
              type="text"
              className="pl-9 pr-3 py-2 w-full text-[10px] bg-stone-800  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Search..."
              onChange={(e) => {
                // setSearchInput(e.target.value);
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
          <div className="overflow-y-auto h-[270px] md:h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
            {availablePools ? (
              <>
                {availablePools.map((item) => {
                  const slicedContract = `${item?.sudoSwapData?.address.slice(0, 4)}...${item?.sudoSwapData?.address.slice(item?.sudoSwapData?.address.length - 4, item?.sudoSwapData?.address.length)}`;

                  return (
                    <button
                      key={item}
                      className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                      onClick={() => {
                        setCurrentShare(item?.friendTechData);
                        setSelectedPool(item);
                        document.getElementById("my_modal_1").close();
                      }}
                    >
                      <div className="flex justify-start gap-2">
                        <img
                          src={item?.friendTechData?.ftPfpUrl}
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                        <h3 className="mt-1">{item?.friendTechData?.ftName}</h3>
                      </div>
                      <div className="flex justify-end">{slicedContract}</div>
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
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default PoolSwap;
