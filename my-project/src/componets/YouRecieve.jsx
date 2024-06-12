import React from "react";
import { uintFormat } from "../formatters/format";
function YouRecieve(props) {
  const {
    currentShare,
    recievedShares,
    setIsOpen,
    currentPoolShareSelected,
    currentPairToken,
    ethPrice,
    shouldBuy,
  } = props;
  console.log(shouldBuy);
  return (
    <div className="border border-slate-500 bg-stone-800 rounded-lg p-2 mt-5">
      <div className="flex justify-between">
        <h3 className="text-white text-[14px] font-mono font-bold">
          {shouldBuy ? "You Recieve:" : "You Sell"}
        </h3>
        <h3 className="text-white text-[10px] text-stone-400">
          Balance: {currentShare?.balance} | Max
        </h3>
      </div>
      <div className="mt-2 absolute">
        {shouldBuy ? (
          <>
            {isNaN(recievedShares) ? (
              <input
                type="text"
                disabled="true"
                className="w-[350px] bg-transparent border border-transparent outline-none"
                placeholder="0"
              />
            ) : (
              <input
                type="text"
                disabled="true"
                className="w-[350px] bg-transparent border border-transparent outline-none"
                placeholder="0"
                value={recievedShares}
              />
            )}
          </>
        ) : (
          <input
            type="text"
            className="w-[350px] bg-transparent border border-transparent outline-none"
            placeholder="0"
          />
        )}
      </div>
      <div className="flex justify-between mt-10">
        <button
          className="border border-slate-500 bg-stone-900 p-1 rounded-lg"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <span className="flex justify-center gap-2">
            <img
              src={
                currentPairToken?.name === "Ethereum"
                  ? currentShare?.ftPfpUrl
                  : currentPoolShareSelected?.friendTehcData?.ftPfpUrl
              }
              alt=""
              className="w-4 h-4 rounded-full mt-1"
            />
            <h3 className="text-white text-[12px] mt-[3px]">
              {currentShare.ftName}
            </h3>
            <img
              src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
              alt=""
              className="w-3 h-3 mt-2"
            />
          </span>
        </button>
        <div className="grid grid-rows-2 text-[10px]">
          <div className="text-white">
            {isNaN(recievedShares) ? (
              "0"
            ) : (
              <>
                {Number(
                  Number(recievedShares) *
                    uintFormat(currentShare?.displayPrice)
                ).toFixed(2)}
              </>
            )}{" "}
            Ξ
          </div>
          <div className="text-white">
            ≈
            {Number(
              Number(recievedShares) *
                (uintFormat(currentShare?.displayPrice) * ethPrice)
            ).toFixed(2)}
            USD
          </div>
        </div>
      </div>
    </div>
  );
}

export default YouRecieve;
