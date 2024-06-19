import React from "react";

function SwapTabs(props) {
  const {
    viewSwap,
    viewChart,
    viewPoolCreator,
    setViewChart,
    setViewPoolCreator,
    setViewSwap,
    viewPools,
    setViewPools,
    viewSend,
    setViewSend,
  } = props;
  console.log(viewSwap);
  return (
    <div className="">
      <div className=" flex justify-start gap-2 whitespace-nowrap text-stone-500 text-[11px] font-semibold p-1">
        <button
          className={`${viewSwap && `bg-stone-800 border border-transparent rounded-full text-center text-stone-300 `}hover:text-stone-600 p-1`}
          onClick={() => {
            setViewPoolCreator(false);
            setViewChart(false);
            setViewPools(false);
            setViewSend(false);
            setViewSwap(true);
          }}
        >
          Mint
        </button>

        <button
          className={`${viewChart && `bg-stone-800 border border-transparent rounded-full text-center text-stone-300`} hover:text-stone-600 p-1`}
          onClick={() => {
            setViewSwap(false);
            setViewPoolCreator(false);
            setViewPools(false);
            setViewSend(false);

            setViewChart(true);
          }}
        >
          Chart
        </button>
        <button
          className={`${viewSend && `bg-stone-800 border border-transparent rounded-full text-center text-stone-300`} hover:text-stone-600 p-1`}
          onClick={() => {
            setViewSwap(false);
            setViewPoolCreator(false);
            setViewPools(false);
            setViewChart(false);

            setViewSend(true);
          }}
        >
          Transfer
        </button>

        <button
          className={`${viewPoolCreator && `bg-stone-800 border border-transparent rounded-full text-center text-stone-300 `} hover:text-stone-600 p-1`}
          onClick={() => {
            setViewChart(false);
            setViewSwap(false);
            setViewPools(false);
            setViewSend(false);

            setViewPoolCreator(true);
          }}
        >
          Add Liquidity
        </button>
        <button
          className={`${viewPools && `bg-stone-800 border border-transparent rounded-full text-center text-stone-300`} hover:text-stone-600 p-1`}
          onClick={() => {
            setViewSwap(false);
            setViewPoolCreator(false);
            setViewChart(false);
            setViewSend(false);

            setViewPools(true);
          }}
        >
          Swap
        </button>
        {/* <button
          className={`${viewPoolCreator && `bg-stone-800 border border-transparent rounded-full text-center text-stone-300 `} hover:text-stone-600 p-1`}
          onClick={() => {
            setViewChart(false);
            setViewSwap(false);
            setViewPools(false);
            setViewSend(false);

            setViewPoolCreator(true);
          }}
        >
          Pods
        </button> */}
      </div>
    </div>
  );
}

export default SwapTabs;
