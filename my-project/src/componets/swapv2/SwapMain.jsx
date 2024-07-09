import React, { useCallback, useEffect, useState } from "react";
import { useShareFinder } from "../hooks/useShareFinder";
import { useShareInfo } from "../hooks/useShareInfo";
import { usePoolBalance } from "../hooks/usePoolBalance";
import { useWalletInfo } from "../hooks/useWalletInfo";
import AvaliablePairs from "../swap/AvailablePairs";
import SwapTemplate from "./SwapTemplate";
import { detectTxType } from "./contract_calls/contractReads";
import StatusModal from "./subcomponets/StatusModal";
import CreatePool from "./CreatePool";
import { usePoolFinder } from "../hooks/usePoolsFinder";
import { useUserHoldings } from "../hooks/useUserHoldings";
import ShareChart from "./subcomponets/ShareChart";
function SwapMain() {
  const [searchInput, setSearchInput] = useState(null);
  const [currentShare, setCurrentShare] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [showPairs, setShowPairs] = useState(false);
  const [swapInput, setSwapInput] = useState(null);
  const [quote, setQuote] = useState(null);
  const [currentShareNum, setCurrentShareNum] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [type, setType] = useState(["Mint", "Burn"]);
  const [pair2, setPair2] = useState(AvaliablePairs[0]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [currentERC20, setCurrentERC20] = useState(AvaliablePairs[1]);
  const walletData = useWalletInfo(currentERC20);
  const holdings = useUserHoldings(walletData?.address);
  const [disableButton, setDisabledButton] = useState(false);
  //returns the current sharesdata including chart data volume
  const shareData = useShareInfo(currentShare, walletData?.address);
  //returns trending friends if no search input or returns search results
  const foundShares = useShareFinder(
    searchInput,
    walletData?.address,
    type,
    currentERC20
  );
  const foundPools = usePoolFinder(currentERC20, walletData?.address, type);
  const poolGoddogBalance = usePoolBalance(currentShare);

  //it is complete now all we need is to fix the bugs when u search it goes black if not results found
  //in add liquidity make it show the current holding fast FAST_REFRESH
  //prevent screen from going black we might have to add more useStates

  useEffect(() => {
    console.log(type);
    setSwapInput("");
  }, [type, currentShare]);

  useEffect(() => {
    setModalMessage(null);
    if (foundShares?.results) {
      setCurrentShare(foundShares.results[0]);
    }
  }, []);
  useEffect(() => {
    console.log(foundShares);
    if (foundShares?.results) {
      setCurrentShare(foundShares.results[0]);
      setDisabled(false);
    }
  }, [foundShares]);

  useEffect(() => {
    console.log(foundPools);
    if (foundPools && type[0] === "Buy") {
      setDisabled(false);
      setCurrentShare(foundPools?.results[0]);
    }
  }, [foundPools]);
  useEffect(() => {
    console.log(type);
    if (holdings && type[0] === `Pool`) {
      console.log(holdings);
      setDisabled(false);
      setCurrentShare(holdings[0]);
    }
  }, [holdings]);

  useEffect(() => {
    setDisabled(true);
    setCurrentShare({
      ftPfpUrl:
        "https://p7.hiclipart.com/preview/226/603/627/pepe-the-frog-internet-meme-image-frog.jpg",
      ftName: "Loading frens share ",
    });
  }, [type]);

  useEffect(() => {
    console.log(type);
    if (type[0] === "Buy") {
      setDisabled(true);
      setCurrentShare({
        ftPfpUrl:
          "https://p7.hiclipart.com/preview/226/603/627/pepe-the-frog-internet-meme-image-frog.jpg",
        ftName: "Loading frens share ",
      });
    }
  }, [currentERC20]);

  useEffect(() => {
    console.log(poolGoddogBalance);
  }, [poolGoddogBalance]);

  useEffect(() => {
    const getQuotes = async () => {
      const res = await detectTxType(
        transactionType,
        currentShare,
        swapInput,
        currentERC20
      );
      setQuote(res);
      setDisabledButton(false);
    };
    if (swapInput) {
      setDisabledButton(true);
      getQuotes();
    } else {
      setQuote(null);
    }
  }, [swapInput]);

  const handleMintClick = useCallback(() => {
    setType(["Mint", "Burn"]);
    setPair2(AvaliablePairs[0]);
    setTransactionType("Mint");
  }, []);

  const handleSwapClick = useCallback(() => {
    setType(["Buy", "Sell"]);
    setPair2(AvaliablePairs[1]);
    setTransactionType("Buy");
  }, []);

  const handlePoolClick = useCallback(() => {
    setType(["Pool"]);
    setPair2(AvaliablePairs[1]);
    setTransactionType("Pool");
  }, []);

  return (
    <div className="mt-4 w-screen ">
      <div className="flex justify-start  p-3 text-white font-bold text-[10px] gap-2 mx-auto w-[420px]">
        <button className=" hover:text-gray-500" onClick={handleMintClick}>
          Mint
        </button>
        <button className=" hover:text-gray-500" onClick={handlePoolClick}>
          Add liquidity
        </button>
        <button className=" hover:text-gray-500" onClick={handleSwapClick}>
          Swap
        </button>
      </div>

      {loading ? (
        <>
          <div className="flex justify-center mb-10 mt-[200px]">
            <img
              src="https://www.friend.tech/friendtechlogo.png"
              alt=""
              className="size-14 animate-bounce"
            />
          </div>
        </>
      ) : (
        <>
          {type[0] === "Mint" ? (
            <SwapTemplate
              pairs={foundShares}
              pair1={currentShare}
              pair2={pair2}
              pair1Set={setCurrentShare}
              type={type}
              setTxType={setTransactionType}
              txType={transactionType}
              setShowPairs={setShowPairs}
              showPairs={showPairs}
              setCurrentShare={setCurrentShare}
              setSwapInput={setSwapInput}
              quote={quote}
              currentShareNum={currentShareNum}
              setSearchInput={setSearchInput}
              swapInput={swapInput}
              setModalMessage={setModalMessage}
              balance={walletData?.ethBal}
              signer={walletData?.signer}
              poolGoddogBalance={poolGoddogBalance || 0}
              disabled={disabled}
              wallet={walletData}
              holdings={holdings}
              disableButton={disableButton}
            />
          ) : (
            <>
              {type[0] === "Buy" ? (
                <SwapTemplate
                  pairs={foundPools}
                  pair1={currentShare}
                  pair2={currentERC20}
                  pair1Set={setCurrentShare}
                  type={type}
                  setTxType={setTransactionType}
                  txType={transactionType}
                  setShowPairs={setShowPairs}
                  showPairs={showPairs}
                  setCurrentShare={setCurrentShare}
                  setSwapInput={setSwapInput}
                  quote={quote}
                  currentShareNum={currentShareNum}
                  setSearchInput={setSearchInput}
                  swapInput={swapInput}
                  setModalMessage={setModalMessage}
                  balance={walletData?.goddogbalance}
                  signer={walletData?.signer}
                  owner={walletData?.address}
                  poolGoddogBalance={poolGoddogBalance || 0}
                  disabled={disabled}
                  setCurrentERC20={setCurrentERC20}
                  currentERC20={currentERC20}
                  wallet={walletData}
                  holdings={holdings}
                  disableButton={disableButton}
                />
              ) : (
                <CreatePool
                  holdings={holdings}
                  pairs={AvaliablePairs}
                  showPairs={showPairs}
                  setShowPairs={setShowPairs}
                  setCurrentShare={setCurrentShare}
                  setSearchInput={setSearchInput}
                  currentShare={currentShare}
                  setCurrentERC20={setCurrentERC20}
                  currentERC20={currentERC20}
                  setSwapInput={setSwapInput}
                  quote={quote}
                  swapInput={swapInput}
                  signer={walletData?.signer}
                  type={transactionType}
                  owner={walletData?.address}
                  setModalMessage={setModalMessage}
                  balance={walletData}
                  disableButton={disableButton}
                />
              )}
            </>
          )}
        </>
      )}

      <StatusModal message={modalMessage} setModalMessage={setModalMessage} />
    </div>
  );
}

export default SwapMain;
