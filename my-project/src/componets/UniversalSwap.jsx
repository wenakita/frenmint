import { useBalance } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import { uintFormat } from "../formatters/format";
import { useState, useEffect } from "react";
import { getTrending, getShareChartData } from "../requests/friendCalls";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getEthPrice, getGoddogPrice } from "../requests/priceCalls";
import { readContract } from "@wagmi/core";
import { SearchByContract, SearchByUser } from "../requests/friendCalls";
import { getShareBalance } from "../requests/txRequests";
import FriendABI from "../abi/FriendABI";
import { config } from "../config";
import { getShareUri } from "../requests/txRequests";
import { getFinalWrapTotal } from "../requests/txRequests";
import FriendTechABI from "../abi/FriendTechABi";
import { findId } from "../requests/friendCalls";
import SwapChart from "./SwapChart.jsx";
import { Link } from "react-router-dom";
import { base } from "wagmi/chains";
import CreatePoolSwap from "./CreatePoolSwap.jsx";
import {
  getSingleBuyNftPrice,
  getSingleSellNftPrice,
} from "../requests/txRequests";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Quoter } from "sudo-defined-quoter";
import { wrapToken } from "../requests/txRequests";
import { Contract } from "ethers";
import { parseEther } from "viem";
import friendTechABI from "../abi/FriendTechABi";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI.js";
import YouSend from "./YouSend.jsx";
import YouRecieve from "./YouRecieve.jsx";
function UniversalSwap() {
  let [isOpen, setIsOpen] = useState(false);
  const [ethPrice, setEthPrice] = useState(null);
  const [goddogPrice, setGoddogPrice] = useState(null);
  const [openTokenPairs, setOpenTokenPairs] = useState(false);
  const [trendingShares, setTrendingShares] = useState(null);
  const [shareSearchInput, setShareSearchInput] = useState(null);
  const [pairTokenInput, setPairTokenInput] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [recievedShares, setRecievedShares] = useState(null);
  const [showSwap, setShowSwap] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [showCreatePool, setShowCreatePool] = useState(false);
  const [goddogPools, setGoddogPools] = useState(null);
  const [shareInput, setShareInput] = useState(null);
  const [txCallCompleted, setTxCallCompleted] = useState(false);
  const [currentPoolShareSelected, setCurrentPoolsShareSelected] =
    useState(null);

  const [shareSearchResults, setShareSearchResults] = useState(null);
  const [shareResultType, setShareResultType] = useState("user");
  const [shouldBuy, setShouldBuy] = useState(false);
  const [buyFromPool, setBuyFromPool] = useState(false);
  const [shareSellAmount, setShareSellAmount] = useState(null);

  const [currentPairToken, setCurrentPairToken] = useState({
    name: "Ethereum",
    address: "0x4200000000000000000000000000000000000006",
    imgUrl:
      "data:image/png;base64,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",
  });
  const [currentShare, setCurrentShare] = useState({});
  const [initiateTx, setInitiateTx] = useState(false);
  const [finalizeTx, setFinalizeTx] = useState(false);
  const [txCompleted, setTxCompleted] = useState(false);
  const [shouldWrap, setShouldWrap] = useState(true);
  const [shouldPoolSwap, setShouldPoolSwap] = useState(false);
  const [recievedEth, setRecievedEth] = useState(null);
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const userEthBalance = useBalance({
    address: w0?.address,
  });
  console.log(Number(userEthBalance?.data?.formatted));
  const goddogBalanceResult = useBalance({
    address: w0?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });
  console.log(uintFormat(goddogBalanceResult?.data?.value));
  useEffect(() => {
    getTrendingShares();
    getGoddogShareInfo();
  }, []);

  useEffect(() => {
    setChartData(null);
    getCharts();
    //here we get balance for current share how much the user has
  }, [currentShare]);

  useEffect(() => {
    console.log(currentPairToken);
    if (currentPairToken?.name === "Goddog") {
      console.log("true");
      getGoddogPools();
    }
  }, [currentPairToken]);

  async function getGoddogPools() {
    // const existingGoddogPools = await getGoddogPools(
    //   Quoter,
    //   import.meta.env.VITE_DEFINED_KEY,
    //   "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    //   8453
    // );
    const poolFormattedData = [];

    const instance = new Quoter(import.meta.env.VITE_DEFINED_KEY, 8453);
    const existingGoddogPools = await instance.getPoolsForCollection(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
    );
    console.log(existingGoddogPools);
    for (const key in existingGoddogPools) {
      const currentPool = existingGoddogPools[key];
      console.log(currentPool);
      console.log(currentPool?.erc1155Id);
      const currentPoolShareContract = await getShareUri(
        readContract,
        config,
        FriendTechABI,
        currentPool?.erc1155Id
      );
      if (currentPoolShareContract !== null) {
        const currentPoolShareData = await SearchByContract(
          currentPoolShareContract
        );
        const usersCurrentPoolShareBalance = await getShareBalance(
          readContract,
          config,
          FriendTechABI,
          w0?.address,
          currentPool?.erc1155Id
        );
        console.log(usersCurrentPoolShareBalance);
        const poolGoddogSellPrice = await getSingleBuyNftPrice(
          readContract,
          config,
          SudoSwapPoolABI,
          currentPool?.erc1155Id,
          currentPool?.address
        );
        const poolGoddogBuyPrice = await getSingleSellNftPrice(
          readContract,
          config,
          SudoSwapPoolABI,
          currentPool?.erc1155Id,
          currentPool?.address
        );
        poolFormattedData.push({
          sudoSwapData: currentPool,
          friendTehcData: currentPoolShareData,
          userShareBalance: usersCurrentPoolShareBalance,
          buyPrice: poolGoddogBuyPrice,
          sellPrice: poolGoddogSellPrice,
        });
      }
    }
    console.log(poolFormattedData);
    setGoddogPools(poolFormattedData);
  }

  async function getCharts() {
    const foundChartData = await getShareChartData(currentShare?.address);
    setChartData(foundChartData);
    console.log(chartData);
  }

  useEffect(() => {
    console.log(Number(pairTokenInput));
    console.log(
      Math.floor(
        Number(pairTokenInput) / Number(uintFormat(currentShare?.displayPrice))
      )
    );
    setRecievedShares(
      Math.floor(
        Number(pairTokenInput) / Number(uintFormat(currentShare?.displayPrice))
      )
    );
  }, [pairTokenInput]);
  console.log(uintFormat(userEthBalance?.data?.value));

  useEffect(() => {
    console.log(shareSearchInput);
    if (shareSearchInput !== null) {
      if (shareSearchInput.includes("0x")) {
        console.log("Search address");

        // fetchContract();
      } else {
        console.log("Search user");

        fetchUser();
      }
    } else if (
      shareSearchInput === null ||
      shareSearchInput.trim().length === 0 ||
      shareSearchInput === undefined
    ) {
      console.log("true");
      getTrendingShares();
    }
  }, [shareSearchInput]);

  async function fetchUser() {
    let ownedShares = await findId(w0?.address);
    for (const key in ownedShares) {
      let currentNft = ownedShares[key];

      const currentNftContract = await getShareUri(
        readContract,
        config,
        FriendTechABI,
        currentNft?.identifier
      );
      const currentNftBalance = await getShareBalance(
        readContract,
        config,
        FriendTechABI,
        w0?.address,
        currentNft?.identifier
      );

      ownedShares[key].address = currentNftContract;
      ownedShares[key].balance = currentNftBalance;
      console.log(currentNftBalance);
    }
    console.log(ownedShares);
    const results = await SearchByUser(shareSearchInput);
    console.log(results);
    if (results?.message || results === undefined) {
      console.log(false);
    } else {
      console.log(results);
      setTrendingShares(null);

      for (const key in results) {
        const currentIteration = results[key];

        for (const iteration in ownedShares) {
          const currentNft = ownedShares[iteration];
          if (currentNft.address === currentIteration?.address) {
            results[key].balance = ownedShares[iteration].balance;
          } else {
            results[key].balance = 0;
          }
        }
        console.log(results);
      }

      setShareSearchResults(results);
    }
  }

  async function getTrendingShares() {
    let ownedShares = await findId(w0?.address);
    for (const key in ownedShares) {
      let currentNft = ownedShares[key];

      const currentNftContract = await getShareUri(
        readContract,
        config,
        FriendTechABI,
        currentNft?.identifier
      );
      const currentNftBalance = await getShareBalance(
        readContract,
        config,
        FriendTechABI,
        w0?.address,
        currentNft?.identifier
      );

      ownedShares[key].address = currentNftContract;
      ownedShares[key].balance = currentNftBalance;
    }
    console.log(ownedShares);

    //owned shares contains the shares the person owns it includes the share id and contract

    let updatedTrendingShares = [];
    // const chartData = await getShareChartData(
    //   "0x62068011609b0718baefd63daf84d82d98f228b5"
    // );
    // console.log(chartData);
    const trendingResult = await getTrending();
    const trendingResponse = trendingResult?.users;
    console.log(trendingResponse);

    for (const key in trendingResponse) {
      const currentIteration = trendingResponse[key];
      console.log(currentIteration);
      for (const iteration in ownedShares) {
        const currentNft = ownedShares[iteration];
        if (currentNft.address === currentIteration?.address) {
          console.log("hello");
          console.log(currentNft?.balance);
          trendingResponse[key].balance = currentNft.balance;

          console.log(trendingResponse[key].balance);
        } else {
          trendingResponse[key].balance = 0;
        }
      }
    }
    console.log(trendingResponse);
    setTrendingShares(trendingResponse);
  }
  async function getEthTotalWrap() {
    const finalEthTotal = await getFinalWrapTotal(
      readContract,
      config,
      FriendABI,
      currentShare?.address,
      recievedShares
    );
    console.log(finalEthTotal);
    initiateWrap(finalEthTotal);
  }

  async function initiateWrap(totalToPay) {
    console.log(totalToPay);
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const shareWrapperContract = new Contract(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      FriendTechABI,
      signer
    );
    // const txResults = await wrapToken(
    //   shareWrapperContract,
    //   recievedShares,
    //   totalToPay,
    //   currentShare?.address,
    //   parseEther
    // );
    console.log(totalToPay);
    try {
      const res = await shareWrapperContract.wrap(
        currentShare?.address,
        Number(recievedShares),
        "0x",
        {
          value: parseEther(String(totalToPay)),
        }
      );
      const receipt = await res.wait();
      console.log(await receipt.transactionHash);
      setTxCallCompleted(true);
      setTimeout(() => {}, [2900]);
      setTxCallCompleted(false);

      setTxCompleted(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log(currentShare);
  }, [currentShare]);

  async function initiateUnWrap() {}
  async function getGoddogShareInfo() {
    const ethPrice = await getEthPrice();
    setEthPrice(ethPrice);
    const goddogPrice = await getGoddogPrice();
    console.log(goddogPrice);
    setGoddogPrice(goddogPrice);
    try {
      const res = await fetch(
        "https://prod-api.kosetto.com/users/0x7b202496c103da5bedfe17ac8080b49bd0a333f1"
      );
      const data = await res.json();
      data.balance = 0;
      console.log(data);
      setCurrentShare(data);
    } catch (error) {
      console.log(error);
    }
  }

  //0xe9825fd47c5d863b1aecba3707abcc7c8b49b88d
  return (
    <div className="container mt-10  w-[400px] mx-auto">
      <center className="mt-3">
        <div className="mb-2">
          <div className="flex justify-start gap-1">
            <img
              src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
              alt=""
              className="w-5 h-5"
            />
            <h3 className="text-white font-mono font-bold ">Swap shares</h3>
          </div>
          <div className="flex justify-start">
            <h3 className="text-stone-500 font-mono  text-[10px] ">
              swap your favorite frens instantly!
            </h3>
          </div>
        </div>
        <div className="border border-stone-800 bg-stone-950 rounded-md w-[400px]  text-white p-2">
          <div className="grid grid-cols-3 text-[12px]">
            <button
              className=" p-1 rounded-lg border border-transparent hover:bg-stone-800 font-bold"
              onClick={() => {
                setShowChart(false);
                setShowCreatePool(false);
                setShowSwap(true);
              }}
            >
              Swap
            </button>
            <button
              className=" p-1 rounded-lg border border-transparent hover:bg-stone-800 font-bold"
              onClick={() => {
                setShowSwap(false);
                setShowCreatePool(false);
                setShowChart(true);
              }}
            >
              Chart
            </button>
            <button
              className=" p-1 rounded-lg border border-transparent hover:bg-stone-800 font-bold"
              onClick={() => {
                setShowSwap(false);
                setShowChart(false);
                setShowCreatePool(true);
              }}
            >
              Create Pool
            </button>
          </div>
        </div>
      </center>
      {showCreatePool ? (
        <CreatePoolSwap setOpenTokenPairs={setOpenTokenPairs} />
      ) : null}
      {showSwap ? (
        <>
          <div className="flex justify-center">
            <div className="border border-stone-700 bg-stone-900 rounded-lg w-[400px] mt-3 text-white p-2">
              <div className="flex justify-start font-bold">Swap</div>
              {shouldBuy ? (
                <YouSend
                  pairTokenInput={pairTokenInput}
                  setOpenTokenPairs={setOpenTokenPairs}
                  currentPairToken={currentPairToken}
                  userEthBalance={userEthBalance}
                  ethPrice={ethPrice}
                  shouldBuy={shouldBuy}
                  recievedEth={recievedEth}
                  setRecievedEth={setRecievedEth}
                />
              ) : (
                <YouRecieve
                  currentShare={currentShare}
                  recievedShares={recievedShares}
                  setIsOpen={setIsOpen}
                  currentPoolShareSelected={currentPoolShareSelected}
                  currentPairToken={currentPairToken}
                  ethPrice={ethPrice}
                  shouldBuy={shouldBuy}
                />
              )}
              <div className="ms-[25%] absolute">
                <button
                  className="flex justify-center border p-2 gap-[2px]  border-slate-500 rounded-lg bg-stone-900 w-[40px]"
                  onClick={() => {
                    console.log("clicked");
                    if (shouldBuy) {
                      setShouldBuy(false);
                    } else {
                      setShouldBuy(true);
                    }
                  }}
                >
                  <FaArrowUp className="w-[8px]" />
                  <FaArrowDown className="w-[8px]" />
                </button>
              </div>
              {shouldBuy ? (
                <YouRecieve
                  currentShare={currentShare}
                  recievedShares={recievedShares}
                  setIsOpen={setIsOpen}
                  currentPoolShareSelected={currentPoolShareSelected}
                  currentPairToken={currentPairToken}
                  ethPrice={ethPrice}
                  shouldBuy={shouldBuy}
                />
              ) : (
                <YouSend
                  pairTokenInput={pairTokenInput}
                  setOpenTokenPairs={setOpenTokenPairs}
                  currentPairToken={currentPairToken}
                  userEthBalance={userEthBalance}
                  ethPrice={ethPrice}
                  shouldBuy={shouldBuy}
                />
              )}

              <div className="flex justify-between mt-2 p-1">
                <div>
                  <h3 className="text-stone-400 font-bold text-[10px] hover:underline">
                    {currentPairToken?.name === "Ethereum"
                      ? `Contract: ${currentShare?.address}`
                      : `Pool contract: ${currentPoolShareSelected?.sudoSwapData?.address}`}
                  </h3>
                  <h3 className="text-stone-400 text-[10px] font-bold mt-0.5">
                    {currentPairToken?.name === "Ethereum"
                      ? ` Price: ${uintFormat(currentShare?.displayPrice)} Ξ / share`
                      : ` Price: ${Number(currentPoolShareSelected?.buyPrice)} $OOOooo / share`}
                  </h3>
                  <div className="flex">
                    <h3 className="text-stone-400 mt-0.5  font-bold text-[10px]">
                      {currentPairToken?.name === "Ethereum"
                        ? `Creator fees Earned: 5%`
                        : `Pool Creator fees Earned: 7%`}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                <img
                  src="data:image/png;base64,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"
                  alt=""
                  className="w-4 h-4 rounded-full"
                />
                <div className="mt-1 flex">
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                </div>
                <div className="border rounded-lg w-[70px] h-[20px] border-stone-600 bg-stone-950 flex gap-1">
                  <div className="flex mt-[1px] gap-0.5">
                    <img
                      src={currentShare?.ftPfpUrl}
                      alt=""
                      className="w-3 h-3 rounded-full mt-0.5 ms-1"
                    />
                    <h3 className="text-white text-[6px] mt-1">0xbe...8514</h3>
                  </div>
                </div>
                <div className="mt-1 flex">
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                  <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
                </div>
                <div className="border rounded-lg w-[60px] h-[20px] border-stone-600 bg-stone-950 flex gap-1">
                  <div className="flex mt-[1px] gap-0.5">
                    <img
                      src="https://www.candlepowerforums.com/media/pepe-hype-png.1887/full"
                      alt=""
                      className="w-3 h-3 ms-0.5"
                    />
                    <h3 className="text-white text-[6px] mt-1">New Owner</h3>
                  </div>
                </div>
              </div>

              <div className="mt-3 mb-1">
                <button
                  className="border border-slate-500 bg-blue-600 hover:bg-blue-700 w-full rounded-md p-1 text-[13px]"
                  onClick={() => {
                    setInitiateTx(true);
                  }}
                >
                  {shouldBuy ? "Swap Share" : "Burn Share"}
                </button>
              </div>
            </div>
          </div>
          <Dialog
            open={openTokenPairs}
            onClose={() => setOpenTokenPairs(false)}
            className="relative z-50"
          >
            <motion.div animate={{ y: -600, x: -22 }} initial={true}>
              <div className="fixed inset-0 flex w-screen h-screen items-center justify-center p-4 mb-10 bg-gradient-to-tr from-stone-950">
                <DialogPanel className="max-w-lg  border border-slate-500 bg-stone-900 p-2 rounded-lg">
                  <DialogTitle className="font-bold text-white p-2 flex justify-between">
                    {currentPairToken?.name === "Ethereum"
                      ? `Select a share`
                      : `Select a pool`}
                    <button
                      className="text-[10px]"
                      onClick={() => setOpenTokenPairs(false)}
                    >
                      X
                    </button>
                  </DialogTitle>
                  <Description className="mt-3 flex justify-center gap-1">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-1.5"
                    >
                      <path
                        d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                        fill="white"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <input
                      type="text"
                      className="bg-stone-800 rounded-lg w-[450px] text-[12px]"
                      placeholder="Enter share name or contract..."
                    />
                  </Description>
                  <div className="overflow-y-auto h-[200px] mb-5 border border-transparent mt-3">
                    <button
                      className="border border-slate-500 mt-1 rounded-lg p-2 grid grid-cols-4"
                      onClick={() => {
                        setOpenTokenPairs(false);
                        setCurrentPairToken({
                          name: "Ethereum",
                          address: "0x4200000000000000000000000000000000000006",
                          imgUrl:
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAADxdJREFUeJztXVtzFMcVplwuP8VVeYmf7HJ+RKqSl/AQP6X8H+yqXUEIjhMnQY5jO9oVCIzA5mowdzAYG4xAGAyWLC5G3IyDL8gOASUYKrarYGZWC7qi23b6692VV6uZ7e6ZnT3di07VV6JUaLfnnG+6z+lz+vScOXUoL6SzP52/2PtlQ9p7piHlLU2k3P2JJqcjkXLO8589/OdN/tPjvx8VEP8Wv+sp/J8O/A3+Fp+Bz8JnUj/XrPjIwjT7ybxm57fJlLsy2eR2cwPe4QZksYB/Nr4D34XvxHdTP/8DJ+k0e4S/lb9Jpr2WZJNzgRtjPDaDS4DvFmPgY8GYMDZq/dStNKQzv0qmnA1c6RkqgysQIoMxYqzU+qoLWZDO/jyZdl7lir1ObdwQZLiOseMZqPVonSTS7i+4AtsTTW6O2pDR4ebEs/Bnotar8dKw2Pk1n0I76Y0W16zgdOIZqfVsnCSbvaeEB2+AkWpCBEQS/Jmp9U4u3Fl6nIdWB6gNQgb+7NABtR1qLjxcejiZdhfxKXGA3AjUswHXAXQBnVDbpSbCPeO5fAr8hlrxpgE6gW6o7ROb5N96Z3l9ePZxgUcMXEd1NxssbMk8kWxyztEr2A5AV3XjGySb3acTSLYYoFjL4EF31PYLLXwaeyiZcltnp/woEJtIrdAltT21BEkR7tnuo1dgfQC6tCbRlGh1H02k3C5qpalg/bt3WdOGDPk4lACdct1S27eiLEgPPMbDmcvkylLAgiUOc/sm2LHuITavmX48KoBun1828DNqO/tKsiX7JF+zeqmVpIqPzg2xyckc++Sfw2ImoB6POtxe6Jra3tMEb75Nxv/Hmxk2MZGbIsCpz4bZn1d45OPSIQF0Tm13IViXbJn2i+i9NcYgRQIA+zsGyMelA6Fzap8AnqktDl8RO9r7WVFKCQAs3dJHPj4tcN2TRQcizrcs1Hv+NZf1D04GEqDj/JBwDqnHqYNCiFj7fYL8Jg+9AnTQfXmYlUo5AYAtbffIx6lNAm6L2hpfbO/atcO3dGsfy+VyUgIAL66yySEE3FzNto2R2ElYtrffkHbYd7fHWbkEEeDQyUHk6cnHrQkPtonV+CKla2FWDx6+nwQRAFi5K0s+bl3ANrGmkvP5fPoH1cFfX/fYyP2cNgG6Lg6z55a55OPXJgG3UVzGn2vbug98fvW+r/FlBADePtJPPn59iKKS6lYW5ad++8q4Vu+5G2h8FQIAr663JFlUAtiqqksBZ1Uj9UPp4neLHeb0TUQmwNEzg2xemv559OE2VsX4KE2ysXoXhpOJCgGAdXttShblAZtVpayMe5Zt1A+ji5fXZdj4uL/jF4YApy4NsxdaLXQIue2iGb/Ze4r6IcLg6rejUuPrEAB47yO7kkVTJIhyAsnG41rYylUVHQIAizdZlixqyh9DC2V8HGKkHrwuELffHZiUWz4kAVBEAueS+jl1EepAqo2ndLFW64guAYBNB2xMFjmdWsbHWXbqQesC0zMMGjcBgEVv2JYs4tDpT5BvzmDAoBWBxM2tH8a0jB+FAAe77EsWwaZKxkdLE9u2fPce65dbu4oEAFp32JYscnNK7WrQ14Z+sOpAMefwiLrjVy0CdF0cYguX2rU3ANtKCWBTdS9wqWcklPGjEgDYcdiuZBEaV1U0PtqbUQ9SB6/vyoY2fjUIALy81q5kUcUWduhxRz1AVcxvdthtb2aVT60JcOT0oKg4otaHKmBjX+OLA50GN2Esx+FT8mRPLQgAIO1MrQ91ArgZ31JytDqlHpwqXlrjsbExvZg/TgKcvDTM/rjcHocQtp45/ae9FuqBqeLr/6gle2pFAAChKLVeVAFbzyRAk3OBemAq2LhfPdlTSwIA6Y12JItg62nGR9tzyq7bqljY4rK+e5WrfCgJcPzskHBOqfUkJQC39bRW9+h9Tz0oFXx8Yahqxo+DAMCGfXY4hLB5SfjnrqQekAypjRntZA8FAU5/NixK0an1JQNsXrL+m1/4ceM7/WRPJcExsas3Rtn7nQNVJ8GBj82vHppWKBLrNStVAOrzqyWjPHzEWQGEbjBW81t9bPn2LNt9tF/UE1SLBMu2Ge4QcpsL4+MyJPLBVADi68HhcMmeUrnbP8kufDUyw8ggQBHoD7Dt4D3WyX2NqASAv/L7Fnr9VYK4CAs3YlEPpBLOfxk+2QP5wRlnZy7ztTnAUKUEKGLJpj72JnfmUFoehQTbDpldPQTb8/Xfe5Z6IEHA1BxWem+N8rdd/ib7EaAUq/dkxZoelgTYtaTWYxBwJR7y/8uoB+IHnMbB26sjY+M59uU1vr5/qj6FywhQxIodWfbOh/2ioZQOAZCzMLV6CLafU7hUkXww5Wjr8j/S7Sdo+3LxyojSGx+WAFN+wtY+tp1P7V0afsIbbxtaPcRtb2T1b+Mqj90flcf8t91x1v158PoeBwGKWLy5j23kfsIxBT/h5KfDoj8RtV7LIaqFTcwBfHUt+Eg35L//G2WnqxSyhSVAKdZwP+FgV2U/Yc9R85JFIieQwH25BgymCHTt9JPxiRy7ch3xe/QQrdoEKGLlzqzICgb5CQb2Je6ZU7g0mXogAmjR5mWnJ3uwB3Dp65nxu4kEKGIZ9xN2tN9jJy5OJ6txfYm57TEDGNPwCdm0otzJTLCzX+T31uMwfJwEmNpP2NLHNu2/y453/0gEw/oSe3MK16dTD2Sqf+/N78diN3qtCDDlMG7qY2v33mWHTg6Y1ZeY294YAhw7Ozi1P19L1IIA0/yEXdxpfMeQWUAQwJAlAClUtHOrdwL8fW3GpBPGnlFOIIDp8lh3dT19EwiAJe4PprWdKziBRoWBALaB1/JpEhsothMAdYJY8w3dDhZh4HkDBuIL7J7t+qDfWgKg57BRYV85uO0xA3SQD0SCl9ZkRP9eWwjwyrqM8bUABXQYkwySpU0xhb62Lcs6z5u7E4idPpUDIn8ypeOYSAYZkg5esTPLPr0yIu2+gd1CnA3QTcvGSYA0B6IY2TpfXNLQxo5a30BDyluKI2HPUA+kCHj/qNlDDl0WKsGxevd49LAxqvGxPM2XjBV+AJpNYp/DpJ1AURBiUkkYvP9i9S9yAnjTZX+DaffoJ+H9g7CGR1j3nEKDCIS12OLGd6HGwaRoQJSEmVYU+rfVHhu+/2MR6LWbo+JMQGUmO6Lo4kSIsDFMWKfSNRRLWWnJOdrPm3aAVBSFmlgWXt7sEQc4kB+QKRBv5Pb2e7ERAIUqssbROL629eDMMSzZbFiZeLEs3NSDISjhLpeh4Umx7ssaMiD+bpMUaOgQAE6b7DYxjAkdS7ouzoxScFUdtT7LMe1giIlHw/AmORn/g6AoFlWps0OdP7p7hiUA/AuVUi74A+gU4vf5KC2XOYkkBCg9Gmbq4VBMm0gRBwkqgGX7B1A+PO+ggpKgsO4vK+VhHXwBVAAFkQuhqqk3kE07HGry8XDU5FcStIWHl40Zo9LnwH9AXZ6MAHBCZUe8EaLiFLBsL2LVbjOrgWccDze5QQTeQpX27zj6tV3hJM4r6zPsg5Lpemr7lv9eRiIA5V4dCruR+wxuLz+jQYTpLWIwHQ8MqZ0P/Pb7MdYiuQMYpMLOI87vIcRU2ZrFUnPwhNp+A7arTb5xzLdFjOlNorCTpio4+o0zhSBOpc+EZy+LKJDD33lYLyNpYPXvNPg2ibKhTRzqA3QE9wUiHAzTtgXx/po9+jUJpreTD2wTlw8HzW4UCY/e7wpYmSCc1NmDRxQQpioJOQzTbxgLbBSZXwbMbxWLmDtsj8B/3RiteA8gMnr7QtYlItEjW3JMQMVWsflZwL1OPUgZEM6FFWwrI2dQWp+H4o3NB/S2kMuBo+zUepFB2ixaEMCSdvFf/Lvy+UGZIKpAW5hiNBDF+Cae+/MlgEq7eFsujMAWbdSegdXoEoZNKFmewAwoXhhRWAasuDIGTRuitI57kNrFK18ZA7Hp0qgPz4RvHhmVACZV90ihc2lUfhYwr3GEHxrS4XsIRiEAchQmVfdUgva1cRCbLo58sayKKG4CIOdvWnVPxZckzMWRYhYwsFAkCDpXxkYlgHHVPRUQ+upYQQDLLo/W7SkYhgAoOaN+Ti0CRLk8GpJIOQeoH0IVSOfeCagiqgYBUH1sYnVPILjtIhkf0pDOPM6diAHyh1EEpufxClVEYQmA4o9Gi66Mhc1gu8gEgCTT7iLqB9KBrIooDAGM7fUXRABus6oYH5JOs4e5M/EN9UNpsF+0gq8WAd4zuLrH9/m5rWCzqhEAkkw7c23YIi4CmTl0EI1KAFHdY9UVsW4Otqqq8UtIsJz+AdWBJhNRCYD0M/Vz6AA2isX4kPxS4JyjfkgdVKoikhHgrfctC/m4bao+9ZfLwpbMEwlDGkupoFIVUSUCtJ80v7qnDB5sE6vxi5Jsdp+2yR9AFdCoTxVREAEwaxjTy08JfN3nNqmJ8adIkHJb6R9cHbt9qoiCCIBOJNTj1QFsUVPjQ/ha8xCPNfdRP7wOcFmUjAC7j9hR3TNlfG4D2KLmBCiQ4JFEyu2iVoIqyquIyglgT3VPAVz3gSXetZJEq/tossm9TK4MRbSWVBGVEwDtXqjHpwqhc657UuMXZUF64DHuiPRSK0UVOLJdTgCcPKIelzrcXuic2u7TJNmSfdIWEhSriIoEsKm6BzqGrqnt7StgpS3LAc7to+MIqntMvM/HD9CtcW9+uWBdssUxxDk+dPGiHocSoFNT1nyZiIOmloWIJqMQ6tF6+7oi9gnEZpE9O4bmwc1Bh2RxfjUkv21sT+7AIHg1396NS5CksC2LSAnoqmaJnVqJSCWLeoLZJSEYophjeewpXUpBtYpN5WW1AnQSWyWPaQKGc7Y32lRtHJvhhQ7cxrp+64NElJw3OW3URqB76522qpVu2yw4vWLTMbTohne7I5/YqUfBIUZbTiWHMjx/ttAHNR8kwVn2fJOKeogYxGZOu/b5/FnJt6vJ9yyyI8tYZvhejF25LcusVBa0N0OPO5ObWWJsGKO0FdushBckRdDqFP1u0fSYsss5vluMgY8FY7IuYVMPgrbn6H2PCxBEJBHn9Tf8s4UHz78L3zmj5fqsmCG4DAk3YiWbvGfFvYgpdz888EJL/J7Chdkerk8XEP8Wv+vJzyo8EsHf8L/FZ+Czpi5YqjP5P2ey0rAsl+yGAAAAAElFTkSuQmCC",
                        });
                      }}
                    >
                      <div className="flex justify-start gap-2">
                        <img
                          src={
                            "data:image/png;base64,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"
                          }
                          alt=""
                          className="w-7 h-7 rounded-full"
                        />
                        <div className="grid grid-rows-2 text-white text-[10px]">
                          <div className="flex justify-start">
                            <h3>Ethereum</h3>
                          </div>
                          <div>
                            <h3>0x4200000000000000000000000000000000000006</h3>
                          </div>
                        </div>
                      </div>
                      <div></div>
                      <div className="grid grid-rows-2  text-[9px] text-white flex justify-end w-[220px]">
                        <div>
                          {Number(userEthBalance?.data?.formatted).toFixed(3)}
                        </div>
                        <div>
                          USD $
                          {Number(
                            Number(userEthBalance?.data?.formatted) * ethPrice
                          ).toFixed(2)}
                        </div>
                      </div>
                    </button>
                    <button
                      className="border border-slate-500 mt-1 rounded-lg p-2 grid grid-cols-4"
                      onClick={() => {
                        setOpenTokenPairs(false);
                        setCurrentPairToken({
                          name: "Goddog",
                          address: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
                          imgUrl:
                            "https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46",
                        });
                      }}
                    >
                      <div className="flex justify-start gap-2">
                        <img
                          src={
                            "https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                          }
                          alt=""
                          className="w-7 h-7 rounded-full"
                        />
                        <div className="grid grid-rows-2 text-white text-[10px]">
                          <div className="flex justify-start">
                            <h3>Goddog</h3>
                          </div>
                          <div>
                            <h3>0xDDf7d080C82b8048BAAe54e376a3406572429b4e</h3>
                          </div>
                        </div>
                      </div>
                      <div></div>
                      <div className="grid grid-rows-2  text-[9px] text-white flex justify-end w-[220px]">
                        <div>
                          {uintFormat(goddogBalanceResult?.data?.value).toFixed(
                            2
                          )}
                        </div>
                        <div>
                          USD $
                          {Number(
                            uintFormat(goddogBalanceResult?.data?.value) *
                              goddogPrice
                          ).toFixed(2)}
                        </div>
                      </div>
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </motion.div>
          </Dialog>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <motion.div animate={{ y: -600, x: -22 }} initial={true}>
              <div className="fixed inset-0 flex w-screen h-screen items-center justify-center p-4 mb-10 bg-gradient-to-tr from-stone-950">
                <DialogPanel className="max-w-lg  border border-slate-500 bg-stone-900 p-2 rounded-lg">
                  <DialogTitle className="font-bold text-white p-2 flex justify-between">
                    Select a share
                    <button
                      className="text-[10px]"
                      onClick={() => setIsOpen(false)}
                    >
                      X
                    </button>
                  </DialogTitle>
                  <Description className="mt-3 flex justify-center gap-1">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-1.5"
                    >
                      <path
                        d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                        fill="white"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <input
                      type="text"
                      className="bg-stone-800 rounded-lg w-[450px] text-[12px] text-white"
                      placeholder="Enter share name or contract..."
                      onChange={(e) => {
                        console.log(e.target.value);
                        setShareSearchInput(e.target.value);
                      }}
                    />
                  </Description>
                  <div className="overflow-y-auto h-[200px] mb-5 border border-transparent mt-3">
                    {currentPairToken.name === "Ethereum" ? (
                      <>
                        {trendingShares !== null || trendingShares ? (
                          <>
                            {trendingShares.map((item) => {
                              return (
                                <button
                                  key={item}
                                  className="border border-slate-500 mt-1 rounded-lg p-2 grid grid-cols-4 "
                                  onClick={() => {
                                    setCurrentShare(item);
                                    setIsOpen(false);
                                  }}
                                >
                                  <div className="flex justify-start gap-2">
                                    <img
                                      src={item?.ftPfpUrl}
                                      alt=""
                                      className="w-7 h-7 rounded-full"
                                    />
                                    <div className="grid grid-rows-2 text-white text-[9px]">
                                      <div className=" w-[300px] flex justify-start">
                                        <h3 className="break-keep">
                                          {item?.ftName}
                                        </h3>
                                      </div>
                                      <div className=" flex justify-start">
                                        <h3>
                                          {item?.address.slice(0, 4)}...
                                          {item?.address.slice(
                                            item?.address.length - 3,
                                            item?.address.length
                                          )}
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                  <div></div>
                                  <div className="grid grid-rows-2  text-[9px] text-white flex justify-end w-[220px]">
                                    <div className="flex justify-start">
                                      {item?.balance}
                                    </div>
                                    <div>
                                      USD $
                                      {Number(
                                        item?.balance *
                                          uintFormat(
                                            item?.displayPrice * ethPrice
                                          )
                                      ).toFixed(2)}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {shareSearchResults !== null ||
                            shareSearchResults ? (
                              <>
                                {shareSearchResults.map((item) => {
                                  return (
                                    <button
                                      key={item}
                                      className="border border-slate-500 mt-1 rounded-lg p-2 grid grid-cols-4"
                                      onClick={() => {
                                        setCurrentShare(item);
                                        setIsOpen(false);
                                      }}
                                    >
                                      <div className="flex justify-start gap-2">
                                        <img
                                          src={item?.ftPfpUrl}
                                          alt=""
                                          className="w-7 h-7 rounded-full"
                                        />
                                        <div className="grid grid-rows-2 text-white text-[10px]">
                                          <div className=" w-[300px] flex justify-start">
                                            <h3 className="break-keep">
                                              {item?.ftName}
                                            </h3>
                                          </div>
                                          <div className=" flex justify-start">
                                            <h3>
                                              {item?.address.slice(0, 4)}...
                                              {item?.address.slice(
                                                item?.address.length - 3,
                                                item?.address.length
                                              )}
                                            </h3>
                                          </div>
                                        </div>
                                      </div>
                                      <div></div>
                                      <div className="grid grid-rows-2  text-[9px] text-white flex justify-end w-[220px]">
                                        <div className="flex justify-start">
                                          {item?.balance}
                                        </div>
                                        <div>
                                          USD $
                                          {Number(
                                            item?.balance *
                                              uintFormat(
                                                item?.displayPrice * ethPrice
                                              )
                                          ).toFixed(2)}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </>
                            ) : (
                              <div className="flex justify-center mb-10 mt-[300px]">
                                <img
                                  src="https://www.friend.tech/friendtechlogo.png"
                                  alt=""
                                  className="w-20 h-20 animate-bounce"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {currentPairToken.name === "Goddog" ? (
                          <>
                            {goddogPools ? (
                              <>
                                {goddogPools.map((item) => {
                                  return (
                                    <button
                                      key={item}
                                      className="border border-slate-500 mt-1 rounded-lg p-2 grid grid-cols-4"
                                      onClick={() => {
                                        setCurrentPoolsShareSelected(item);
                                        setCurrentShare(item?.friendTehcData);
                                        setIsOpen(false);
                                      }}
                                    >
                                      <div className="flex justify-start gap-2">
                                        <img
                                          src={item?.friendTehcData?.ftPfpUrl}
                                          alt=""
                                          className="w-7 h-7 rounded-full"
                                        />
                                        <div className="grid grid-rows-2 text-white text-[10px]">
                                          <div className=" w-[300px] flex justify-start">
                                            <h3 className="break-keep">
                                              {item?.friendTehcData?.ftName}
                                            </h3>
                                          </div>
                                          <div className=" flex justify-start">
                                            <h3>
                                              {" "}
                                              {item?.sudoSwapData?.address.slice(
                                                0,
                                                4
                                              )}
                                              ...
                                              {item?.sudoSwapData?.address.slice(
                                                item?.sudoSwapData?.address
                                                  .length - 3,
                                                item?.sudoSwapData?.address
                                                  .length
                                              )}
                                            </h3>
                                          </div>
                                        </div>
                                      </div>
                                      <div></div>
                                      <div className="grid grid-rows-2  text-[9px] text-white flex justify-end w-[220px]">
                                        <div className="flex justify-start">
                                          {item?.userShareBalance}
                                        </div>
                                        <div>
                                          USD $
                                          {Number(
                                            uintFormat(
                                              item?.friendTehcData?.displayPrice
                                            ) *
                                              ethPrice *
                                              item?.userShareBalance
                                          ).toFixed(2)}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </>
                            ) : (
                              <div className="flex justify-center mb-10 mt-[300px]">
                                <img
                                  src="https://www.friend.tech/friendtechlogo.png"
                                  alt=""
                                  className="w-20 h-20 animate-bounce"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex justify-center mb-10 mt-[300px]">
                            <img
                              src="https://www.friend.tech/friendtechlogo.png"
                              alt=""
                              className="w-20 h-20 animate-bounce"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </DialogPanel>
              </div>
            </motion.div>
          </Dialog>
          <Dialog
            open={initiateTx}
            onClose={() => setInitiateTx(false)}
            className="relative z-50"
          >
            <motion.div
              animate={{ y: -600, x: -20 }}
              initial={true}
              className="flex justify-center"
            >
              <div className="fixed inset-0 flex w-screen h-screen items-center justify-center p-4 mb-10 bg-gradient-to-tr from-stone-950">
                {shouldWrap ? (
                  <>
                    <DialogPanel className="max-w-lg  border border-slate-500 bg-stone-900 p-3 rounded-lg w-[350px]">
                      <DialogTitle className="font-bold text-[12px] text-white flex justify-between mb-4">
                        Review Swap
                        <button
                          className="text-[12px] me-2"
                          onClick={() => setInitiateTx(false)}
                        >
                          X
                        </button>
                      </DialogTitle>
                      <Description>
                        <div className="flex justify-start text-[8px]">
                          <h3 className="text-white">Sell</h3>
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="grid grid-rows-2">
                            <div>
                              <h3 className="text-white text-[20px]">
                                {pairTokenInput}
                              </h3>
                            </div>
                            <div>
                              <h3 className="text-white text-[10px]">
                                $
                                {isNaN(
                                  Number(pairTokenInput) || !!pairTokenInput
                                )
                                  ? "0"
                                  : Number(pairTokenInput) * ethPrice}
                              </h3>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <img
                              src={currentPairToken?.imgUrl}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <h3 className="text-white text-[8px] mt-[6px]">
                              {currentPairToken?.name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex justify-start text-[8px] mt-3">
                          <h3 className="text-white">Recieve</h3>
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="grid grid-rows-2">
                            <div>
                              <h3 className="text-white text-[20px]">
                                {recievedShares}
                              </h3>
                            </div>
                            <div>
                              <h3 className="text-white text-[10px]">
                                $
                                {isNaN(recievedShares)
                                  ? "0"
                                  : Number(
                                      Number(recievedShares) *
                                        (uintFormat(
                                          currentShare?.displayPrice
                                        ) *
                                          ethPrice)
                                    ).toFixed(2)}
                              </h3>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <img
                              src={currentShare?.ftPfpUrl}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <h3 className="text-white text-[8px] mt-[6px]">
                              {currentShare?.ftName}
                            </h3>
                          </div>
                        </div>
                        <div className="border border-stone-700 border-b-0 border-l-0 border-r-0 w-[320px] mb-4">
                          <div className="flex justify-start text-[9px] text-stone-500 mt-2">
                            Creator earnings: 5%
                          </div>
                          <div className="flex justify-start text-[9px] text-stone-500 mt-1">
                            Network Total: $0.00
                          </div>
                        </div>
                        <div>
                          <button
                            className="border border-slate-500 bg-blue-600 hover:bg-blue-800 w-full text-white p-1 text-[12px] rounded-md"
                            onClick={() => {
                              setInitiateTx(false);
                              setFinalizeTx(true);
                              setTimeout(() => {
                                getEthTotalWrap();
                              }, [2000]);
                            }}
                          >
                            Confirm Transaction
                          </button>
                        </div>
                      </Description>
                    </DialogPanel>
                  </>
                ) : null}
              </div>
            </motion.div>
          </Dialog>
          <Dialog
            open={finalizeTx}
            onClose={() => setFinalizeTx(false)}
            className="relative z-50"
          >
            <motion.div
              animate={{ y: -650, x: -20 }}
              initial={true}
              className="flex justify-center"
            >
              <div className="fixed inset-0 flex w-screen h-screen items-center justify-center p-4 mb-10 bg-gradient-to-tr from-stone-950">
                {shouldWrap ? (
                  <>
                    <DialogPanel className="max-w-lg  border border-slate-500 bg-stone-900 p-3 rounded-lg w-[350px]">
                      <DialogTitle className="font-bold text-[12px] text-white flex justify-between mb-4">
                        Initializing Transaction
                        <button
                          className="text-[12px] me-2"
                          onClick={() => setFinalizeTx(false)}
                        >
                          X
                        </button>
                      </DialogTitle>
                      <Description>
                        <div className="grid grid-rows-2 p-1">
                          {/* <div>
                        <div className="flex gap-2">
                          <AiOutlineLoading3Quarters className="animate-spin text-white text-[12px]" />
                          <h3 className="text-white text-[10px]">
                            Approving Ethereum
                          </h3>
                          <img
                            src={currentPairToken?.imgUrl}
                            alt=""
                            className="w-4 h-4 rounded-full"
                          />
                        </div>
                      </div> */}
                          <div>
                            <div className="flex gap-2 mt-2">
                              {txCallCompleted ? (
                                <>
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                  >
                                    <img
                                      src="https://static.vecteezy.com/system/resources/previews/017/350/120/non_2x/green-check-mark-png.png"
                                      alt=""
                                      className="w-4 h-4"
                                    />
                                  </motion.div>
                                </>
                              ) : (
                                <AiOutlineLoading3Quarters className="animate-spin text-white text-[12px]" />
                              )}
                              <h3 className="text-white text-[10px]">
                                Purchasing {currentShare?.ftName}
                              </h3>
                              <img
                                src={currentShare?.ftPfpUrl}
                                alt=""
                                className="w-4 h-4 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </Description>
                    </DialogPanel>
                  </>
                ) : null}
              </div>
            </motion.div>
          </Dialog>
          <Dialog
            open={txCompleted}
            onClose={() => setTxCompleted(false)}
            className="relative z-50"
          >
            <motion.div
              animate={{ y: -650, x: -20 }}
              initial={true}
              className="flex justify-center"
            >
              <div className="fixed inset-0 flex w-screen h-screen items-center justify-center p-4 mb-10 bg-gradient-to-tr from-stone-950">
                {shouldWrap ? (
                  <>
                    <DialogPanel className="max-w-lg  border border-slate-500 bg-stone-900 p-3 rounded-lg w-[350px]">
                      <DialogTitle className="font-bold text-[12px] text-white flex justify-between mb-4">
                        Transaction Completed
                        <button
                          className="text-[12px] me-2"
                          onClick={() => setTxCompleted(false)}
                        >
                          X
                        </button>
                      </DialogTitle>
                      <Description>
                        <div className="grid grid-rows-1 p-1 mt-10">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                          >
                            <div className=" flex justify-center">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/800px-Eo_circle_green_checkmark.svg.png"
                                alt=""
                                className=" w-[70px] h-[70px]   "
                              />
                            </div>
                            <div className="flex justify-center mt-4 ">
                              <h3 className="text-white text-[12px] font-bold">
                                Wrap Sucessfully Completed
                              </h3>
                            </div>
                            <div className="flex justify-center mb-5 mt-2">
                              <Link
                                to={"/balances"}
                                className="text-white text-[9px] hover:underline"
                              >
                                View Balances
                              </Link>
                            </div>
                          </motion.div>
                        </div>
                      </Description>
                    </DialogPanel>
                  </>
                ) : null}
              </div>
            </motion.div>
          </Dialog>
        </>
      ) : (
        <>
          {showChart ? (
            <SwapChart chartData={chartData} currentShare={currentShare} />
          ) : null}
        </>
      )}
    </div>
  );
}

export default UniversalSwap;
