import React from "react";

import { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "../../index.css";
import { getPoolFees } from "../../requests/txRequests";
function Pods() {
  const [tokenInput, setTokenInput] = useState(null);
  const [poolFees, setPoolFees] = useState(null);

  useEffect(() => {
    getPoolInfo();
  }, []);

  async function getPoolInfo() {
    const url = await fetch();
    const fees = await getPoolFees();
    console.log(fees);
    setPoolFees(fees);
    //divide by 100
  }
  return (
    <div className="border border-stone-800 rounded-lg w-[410px] bg-stone-900 mx-auto me-auto mt-2 p-3">
      <div className="border border-stone-800 rounded-lg p-2">
        <div className="flex justify-start">
          <h3 className="text-white font-mono text-[10px]">From</h3>
        </div>
        <div className="flex justify-between mt-1">
          <input
            type="text"
            className="bg-transparent outline-none"
            onChange={(e) => {
              setTokenInput(e.target.value);
            }}
          />
          <div className="flex">
            <img
              src="https://peapods.finance/assets/coins/oooooo.webp"
              alt=""
              className="assetLogo"
            />
            <h3 className="text-white text-[10px]  ms-1 mt-0.5">oooOOO</h3>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-2">
        <FaArrowDown className="text-gray-200" />
      </div>
      <div className="border border-stone-800 rounded-lg p-2">
        <div className="flex justify-start">
          <h3 className="text-white font-mono text-[10px]">To</h3>
        </div>
        <div className="flex justify-between mt-1">
          <input
            type="text"
            className="bg-transparent outline-none"
            disabled={true}
          />
          <div className="flex">
            <div className="indicator assetLogo">
              <span className="indicator-item indicator-bottom ">
                <img
                  src="https://peapods.finance/assets/coins/peas.png"
                  alt=""
                  className="size-2 mb-2"
                />
              </span>
              <img
                src="https://peapods.finance/assets/coins/oooooo.webp"
                alt=""
                className="assetLogo"
              />
            </div>
            <h3 className="text-white text-[10px] ms-1 mt-0.5">poooOOO</h3>
          </div>
        </div>
      </div>
      <div className="mt-2">
        {poolFees ? (
          <div className="text-[10px]">
            <h3>Burned {poolFees[0] / 100}%</h3>
            <h3>Wrap fee {poolFees[1] / 100}%</h3>
            <h3>Unwrap fee {poolFees[2] / 100}%</h3>
            <h3>Buy fee {poolFees[3] / 100}%</h3>
            <h3>Sell fee {poolFees[4] / 100}%</h3>
          </div>
        ) : null}
      </div>
      <div className="mt-2 text-white">
        <button
          className="bg-blue-500 text-center w-full rounded-md p-1 text-[10px]"
          disabled={!tokenInput}
        >
          Wrap
        </button>
      </div>
    </div>
  );
}

export default Pods;

{
  /* <div className="indicator assetLogo">
<span className="indicator-item indicator-bottom ">
  <img
    src="https://peapods.finance/assets/coins/peas.png"
    alt=""
    className="size-2 mb-2"
  />
</span>
<img
  src="https://peapods.finance/assets/coins/oooooo.webp"
  alt=""
  className="assetLogo"
/>
</div> */
}
