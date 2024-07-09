import React, { useEffect } from "react";
import { uintFormat } from "../../../requests/friendCalls";
import { ethers } from "ethers";

function PairsModal({
  showPairs,
  setShowPairs,
  pairs,
  setCurrentShare,
  setSearchInput,
  type,
  currentERC20,
  holdings,
}) {
  console.log(type);
  console.log(pairs?.balances);

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-neutral-900">
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
        <div className="overflow-y-auto  h-[270px] md:h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
          {holdings &&
            type !== "Buy" &&
            (type !== "Sell" ? (
              <>
                {holdings.map((item) => {
                  console.log("here");
                  let slicedContract = `${item?.address.slice(0, 4)}...${item?.address.slice(item?.address.length - 4, item?.address.length)}`;

                  return (
                    <button
                      key={item}
                      className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                      onClick={() => {
                        setCurrentShare(item);
                        document.getElementById("my_modal_5").close();
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
                      <div className="flex justify-end gap-1">
                        {" " + item?.balance}
                        <h3 className="text-[7.5px] mt-[2.7px]">
                          {" ≈ " +
                            Number(
                              uintFormat(item?.displayPrice) *
                                3500 *
                                item?.balance
                            ).toFixed(2) +
                            "USD"}
                        </h3>
                      </div>
                    </button>
                  );
                })}
              </>
            ) : null)}
          {pairs?.results ? (
            <>
              {pairs?.results.map((item) => {
                const slicedContract = `${item?.address.slice(0, 4)}...${item?.address.slice(item?.address.length - 4, item?.address.length)}`;

                return (
                  <button
                    key={item}
                    className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                    onClick={() => {
                      setCurrentShare(item);
                      document.getElementById("my_modal_5").close();
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
            "hello"
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          onClick={() => {
            setShowPairs(false);
          }}
        >
          close
        </button>
      </form>
    </dialog>
  );
}

export default PairsModal;
