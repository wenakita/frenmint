import React from "react";
import { uintFormat } from "../formatters/format";
function YouSend(props) {
  const {
    setPairTokenInput,
    pairTokenInput,
    setOpenTokenPairs,
    currentPairToken,
    userEthBalance,
    ethPrice,
    shouldBuy,
    recievedEth,
    setRecievedEth,
  } = props;
  console.log(currentPairToken);
  return (
    <div className="border border-slate-500 bg-stone-800 rounded-lg p-2 mt-3">
      <div className="flex justify-between">
        <h3 className="text-white text-[14px] font-mono font-bold">
          {shouldBuy ? "You Send:" : "You Recieve:"}
        </h3>
        <h3 className="text-white text-[10px] text-stone-400">
          Balance: {uintFormat(userEthBalance?.data?.value).toFixed(4)} | Max
        </h3>
      </div>
      <div className="mt-2 absolute">
        {shouldBuy ? (
          <input
            type="text"
            className="w-[350px] bg-transparent border border-transparent outline-none text-stone"
            style={{ "-moz-apperance": "textfield" }}
            placeholder="0"
            onChange={(e) => {
              setPairTokenInput(e.target.value);
            }}
            value={pairTokenInput}
          />
        ) : (
          <input
            type="text"
            disabled="true"
            className="w-[350px] bg-transparent border border-transparent outline-none text-stone"
            style={{ "-moz-apperance": "textfield" }}
            placeholder="0"
            // onChange={(e) => {
            //   setPairTokenInput(e.target.value);
            // }}
            // value={pairTokenInput}
          />
        )}
      </div>
      <div className="flex justify-between mt-10">
        <button
          className="border border-slate-500 bg-stone-900 p-1 rounded-lg"
          onClick={() => {
            setOpenTokenPairs(true);
          }}
        >
          <span className="flex justify-center gap-2">
            <img
              src={currentPairToken?.imgUrl}
              alt=""
              className={`${currentPairToken?.name === "Ethereum" ? "w-4 h-4" : "w-5 h-5"} rounded-full mt-[2px]`}
            />
            <h3 className="text-white text-[12px] mt-[2px]">
              {currentPairToken.name}
            </h3>
            <img
              src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
              alt=""
              className="w-3 h-3 mt-[6px]"
            />
          </span>
        </button>
        <div className="grid grid-rows-2 text-[10px]">
          <div className="text-white">${Number(pairTokenInput).toFixed(2)}</div>
          <div className="text-white">
            ≈{Number(pairTokenInput) * ethPrice} USD
          </div>
        </div>
      </div>
    </div>
  );
}

export default YouSend;
