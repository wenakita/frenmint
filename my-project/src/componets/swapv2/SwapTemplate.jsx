import React, { useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { FaReceipt } from "react-icons/fa";
import { FaArrowsRotate, FaBoltLightning } from "react-icons/fa6";
import { MdError, MdKeyboardArrowDown } from "react-icons/md";
import PairsModal from "./subcomponets/PairsModal";
import { detectTxType } from "./contract_calls/contractWrites";
import PoolPairsModal from "./subcomponets/PoolPairsModal";
import AvaliablePairs from "../swap/AvailablePairs";
import ChartButton from "../swap/ChartButton";

function SwapTemplate({
  pairs,
  type,
  pair1,
  pair2,
  pair1Set,
  setTxType,
  txType,
  showPairs,
  setShowPairs,
  setCurrentShare,
  setSwapInput,
  quote,
  setSearchInput,
  swapInput,
  setModalMessage,
  balance,
  signer,
  owner,
  poolGoddogBalance,
  disabled,
  currentERC20,
  setCurrentERC20,
  wallet,
  holdings,
  disableButton,
  shareData,
  currentShare,
}) {
  useEffect(() => {
    setTxType(type[0]);
  }, []);
  const handleTypeChange = () => {
    if (txType === type[0]) {
      setTxType(type[1]);
    } else if (txType === type[1]) {
      setTxType(type[0]);
    } else {
      setTxType(type[0]);
    }
  };
  console.log(type);
  console.log(currentERC20?.name);
  return (
    <div
      className="border border-stone-900  w-[420px] mx-auto p-1 rounded-md"
      style={{ backgroundColor: "#212121" }}
    >
      <PairsModal
        showPairs={showPairs}
        setShowPairs={setShowPairs}
        pairs={pairs}
        setCurrentShare={setCurrentShare}
        setSearchInput={setSearchInput}
        type={type[0]}
        currentERC20={currentERC20}
        holdings={holdings}
      />
      {type[0] === "Buy" && (
        <PoolPairsModal
          pairs={[AvaliablePairs[1], AvaliablePairs[2]]}
          id={"390"}
          setter={setCurrentERC20}
        />
      )}
      <div className="text-start text-white  font-semibold p-2 flex justify-between">
        <h3 className=" ">{txType}</h3>
        {shareData?.chart && currentShare?.address ? (
          <ChartButton
            currentPriceHistory={shareData?.chart}
            currentShare={currentShare}
            shareTotalVolume={shareData?.volume}
          />
        ) : null}
      </div>
      <div className="mt-1 p-2">
        <div className="grid grid-cols-[1fr_auto] ">
          <div
            role="button"
            style={disabled ? { pointerEvents: "none" } : {}}
            className="border border-stone-800 p-1 bg-neutral-900 rounded-md"
            onClick={() => {
              document.getElementById("my_modal_5").showModal();
            }}
          >
            <div className="flex justify-between">
              <div className="flex gap-1 p-1">
                <img
                  src={pair1?.ftPfpUrl}
                  alt=""
                  className="size-9 rounded-full"
                />
                <div className="grid grid-rows-2 ">
                  <div>
                    <h3 className="text-[10px]  font-light">Share</h3>
                  </div>
                  <div className=" w-[90%]">
                    <h3 className="text-white font-bold text-[11px] truncate">
                      {pair1?.ftName}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <MdKeyboardArrowDown />
              </div>
            </div>
          </div>
          <div className="border border-stone-800 p-1 bg-neutral-900 rounded-md w-[120px]">
            <div className="flex justify-start gap-1">
              <div className="grid grid-rows-2 p-1">
                <div>
                  <h3 className="text-[10px]  font-light">Token Standard</h3>
                </div>
                <div>
                  <h3 className="text-white font-bold text-[11px]">ERC-1155</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" p-2 text-white hover:animate-spin">
          <button
            className="w-full"
            onClick={() => {
              handleTypeChange();
            }}
          >
            <FaArrowsRotate className="mx-auto text-[14px]" />
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto] ">
          <div
            className="border border-stone-800 p-1 bg-neutral-900 rounded-md"
            role="button"
            onClick={() => {
              document.getElementById("my_modal_390").showModal();
            }}
          >
            <div className="flex  gap-1 p-1">
              <img
                src={type[0] === "Mint" ? pair2?.imgUrl : currentERC20?.imgUrl}
                alt=""
                className="size-9 rounded-full"
              />
              <div className="grid grid-rows-2">
                <div>
                  <h3 className="text-[10px]  font-light">Token</h3>
                </div>
                <div>
                  <h3 className="text-white font-bold text-[11px] truncate">
                    {type[0] === "Mint" ? pair2?.name : currentERC20?.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-stone-800 p-1 bg-neutral-900 rounded-md w-[120px]">
            <div className="flex justify-start gap-1">
              <div className="grid grid-rows-2 p-1">
                <div>
                  <h3 className="text-[10px] font-light ">Token Standard</h3>
                </div>
                <div>
                  <h3 className="text-white font-bold text-[11px]">ERC-20</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] ">
          <div className="mt-2">
            <div
              type="text"
              className="border border-stone-800 p-1 bg-neutral-900 rounded-md w-[120px] p-[5.5px]"
            >
              <h3 className="text-white text-[10px]">You {txType}</h3>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="text"
              className="border border-stone-800 p-1 bg-neutral-900 rounded-md w-[275px] outline-none text-white font-mono text-[12px]"
              value={swapInput}
              disabled={disabled}
              onChange={(e) => {
                setSwapInput(e.target.value);
              }}
            />
            <div className="text-end font-light text-[9px]">
              <button
                className="hover:underline"
                onClick={() => {
                  setSwapInput(pair1?.balance || 0);
                }}
              >
                {txType === type[0] ? (
                  <>
                    {pair2?.name} balance:{" "}
                    {currentERC20?.name === "oooOOO"
                      ? wallet?.goddogbalance
                      : type[0] === "Buy"
                        ? wallet?.friendBalance
                        : wallet?.ethBal}
                  </>
                ) : (
                  <>ERC-1155 balance: {pair1?.balance ? pair1?.balance : 0}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-2 mt-2 grid grid-cols-2 gap-2 p-3">
        <div className="border bg-neutral-900 border-stone-900 rounded-md p-2 ">
          <div className="flex justify-between text-[10px] ">
            <h3 className=" font-thin">Fees Paid:</h3>
            <h3>
              <FaBoltLightning className="text-emerald-600 mt-0.5" />
            </h3>
          </div>
          <div className="font-mono text-[8px]">
            <h3>{quote?.fees || "-"}</h3>
            <h3 className="font-mono text-[8px]">
              {quote && "≈" + quote?.feesUsd + " USD"}
            </h3>
          </div>
        </div>
        <div className="border bg-neutral-900 border-stone-900 rounded-md p-2">
          <div className="flex justify-between text-[10px] ">
            <h3 className="font-thin">You Pay:</h3>
            <h3>
              <FaReceipt className="text-emerald-600 mt-0.5" />
            </h3>
          </div>
          <div>
            <h3 className="font-mono text-[10px]">{quote?.quote || "-"}</h3>
            <h3 className="font-mono text-[8px]">
              {quote && "≈" + quote?.usd + " USD"}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-1 relative mx-auto w-[80%] mb-2">
        <button
          className={`w-full border border-stone-900 rounded-lg ${disableButton ? `bg-neutral-900 text-white` : `bg-white text-black`} font-semibold text-[12px] p-1 hover:bg-stone-800 hover:text-white`}
          disabled={disableButton}
          onClick={async () => {
            let res;
            console.log(poolGoddogBalance);
            res = await detectTxType(
              signer,
              txType,
              [pair1, swapInput, quote?.quote],
              owner,
              balance,
              poolGoddogBalance,
              wallet,
              pair1
            );
            console.log(res);
            setModalMessage({ message: res?.message, icon: res?.icon });

            document.getElementById("my_modal_99").showModal();
          }}
        >
          {txType}
        </button>
      </div>
    </div>
  );
}

export default SwapTemplate;
