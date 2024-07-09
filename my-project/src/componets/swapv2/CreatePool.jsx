import React from "react";
import { CiSettings } from "react-icons/ci";
import { FaBoltLightning, FaReceipt } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import PairsModal from "./subcomponets/PairsModal";
import PoolPairsModal from "./subcomponets/PoolPairsModal";
import AvaliablePairs from "../swap/AvailablePairs";
import { uintFormat } from "../../requests/friendCalls";
import { detectTxType } from "./contract_calls/contractWrites";

function CreatePool({
  holdings,
  pairs,
  owner,
  setModalMessage,
  showPairs,
  setShowPairs,
  setCurrentShare,
  setSearchInput,
  currentShare,
  setCurrentERC20,
  currentERC20,
  setSwapInput,
  quote,
  swapInput,
  signer,
  type,
  balance,
  disableButton,
}) {
  console.log(holdings);
  return (
    <div
      className="border border-stone-900  w-[420px] mx-auto p-1 rounded-md"
      style={{ backgroundColor: "#212121" }}
    >
      <PoolPairsModal
        pairs={[AvaliablePairs[1], AvaliablePairs[2]]}
        id={"390"}
        setter={setCurrentERC20}
      />
      <PoolPairsModal pairs={holdings} id={"400"} setter={setCurrentShare} />

      <div className="text-start text-white  font-semibold p-2 flex justify-between">
        <div className="flex gap-1">
          <img
            src="https://avatars.githubusercontent.com/u/94413972?s=280&v=4"
            alt=""
            className="size-6"
          />
          <h3 className="text-[14px] mt-0.5 ">Create a pool</h3>
        </div>
        <button>
          <CiSettings />
        </button>
      </div>
      <div className="mt-2">
        <div className="grid grid-cols-[1fr_auto] ">
          <div
            role="button"
            className="border border-stone-800 p-1 bg-neutral-900 rounded-md"
            onClick={() => {
              document.getElementById("my_modal_400").showModal();
            }}
          >
            <div className="flex justify-between">
              <div className="flex gap-1 p-1">
                <img
                  src={
                    currentShare?.ftPfpUrl ||
                    "https://banner2.cleanpng.com/20240405/lge/transparent-pepe-the-frog-batman-arkham-knight-character-with-green-mask660fa354133704.28201621.webp"
                  }
                  alt=""
                  className="size-9 rounded-full"
                />
                <div className="grid grid-rows-2 ">
                  <div>
                    <h3 className="text-[10px]  font-light">Share</h3>
                  </div>
                  <div className=" w-[100%]">
                    <h3 className="text-white font-bold text-[11px] truncate">
                      {currentShare?.ftName || "No shares available"}
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
        <div>
          <h3 className="p-2 text-center font-bold text-white text-[20px]">
            +
          </h3>
        </div>
        <div className="grid grid-cols-[1fr_auto] ">
          <div
            role="button"
            className="border border-stone-800 p-1 bg-neutral-900 rounded-md"
            onClick={() => {
              document.getElementById("my_modal_390").showModal();
            }}
          >
            <div className="flex justify-between  gap-1 p-1">
              <div className="flex gap-2">
                <img
                  src={currentERC20?.imgUrl}
                  alt=""
                  className="size-9 rounded-full"
                />
                <div className="grid grid-rows-2">
                  <div>
                    <h3 className="text-[10px]  font-light">Token</h3>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[11px] truncate">
                      {currentERC20?.name}
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
              <h3 className="text-white text-[10px]">You Provide</h3>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="text"
              className="border border-stone-800 p-1 bg-neutral-900 rounded-md w-[290px] outline-none text-white font-mono text-[12px]"
              onChange={(e) => {
                setSwapInput(e.target.value);
              }}
            />
            <div className="text-end font-light text-[9px]">
              <button className="hover:underline" onClick={() => {}}>
                <>ERC-1155 balance: {currentShare?.balance}</>
              </button>
            </div>
          </div>
        </div>
        <div className="mb-2 mt-2 grid grid-cols-2 gap-2 p-3">
          <div className="border bg-neutral-900 border-stone-900 rounded-md p-2 ">
            <div className="flex justify-between text-[10px] ">
              <h3 className=" font-thin">Pool Fee:</h3>
              <h3>
                <FaBoltLightning className="text-emerald-600 mt-0.5" />
              </h3>
            </div>
            <div className="font-mono text-[8px]">
              <h3>{"6.9%"}</h3>
            </div>
          </div>
          <div className="border bg-neutral-900 border-stone-900 rounded-md p-2">
            <div className="flex justify-between text-[10px] ">
              <h3 className="font-thin">LP Provided:</h3>
              <h3>
                <FaReceipt className="text-emerald-600 mt-0.5" />
              </h3>
            </div>
            <div>
              <h3 className="font-mono text-[10px]">{quote?.LP || "-"}</h3>
              <h3 className="font-mono text-[8px]">
                {" "}
                {quote &&
                  "≈" +
                    (Number(quote?.LP) * Number(quote.ERC20Price)).toFixed(2) +
                    " USD"}
              </h3>
            </div>
          </div>
          <div className="border bg-neutral-900 border-stone-900 rounded-md p-2 w-[385px]">
            <div className="flex justify-between text-[10px] ">
              <h3 className="font-thin">Shares Deposited:</h3>
              <h3>
                <FaReceipt className="text-emerald-600 mt-0.5" />
              </h3>
            </div>
            <div>
              <h3 className="font-mono text-[10px]">{swapInput || "-"}</h3>
              <h3 className="font-mono text-[8px]">
                {" "}
                {quote &&
                  "≈" +
                    (
                      uintFormat(currentShare?.displayPrice) *
                      Number(quote.ethPrice)
                    ).toFixed(2) +
                    " USD"}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-1 relative mx-auto w-[80%] mb-2">
          <button
            className="w-full border border-stone-900 rounded-lg bg-white text-black font-semibold text-[12px] p-1 hover:bg-stone-800 hover:text-white"
            disabled={disableButton}
            onClick={async () => {
              let res;
              // console.log(poolGoddogBalance);
              // res = await detectTxType(
              //   signer,
              //   txType,
              //   [pair1, swapInput, quote?.quote],
              //   owner,
              //   balance,
              //   poolGoddogBalance
              // );
              // console.log(res);
              // setModalMessage({ message: res?.message, icon: "o" });
              console.log(balance);
              console.log(quote);
              res = await detectTxType(
                signer,
                type,
                quote,
                owner,
                currentShare?.balance,
                0,
                balance,
                currentShare
              );
              setModalMessage({ message: res?.message, icon: "o" });
              document.getElementById("my_modal_99").showModal();
            }}
          >
            {"Provide Liquidity"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePool;
