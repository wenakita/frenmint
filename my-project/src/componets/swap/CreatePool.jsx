import React, { useState, useEffect } from "react";

function CreatePool(props) {
  const [selectedShare, setSelectedShare] = useState(null);

  const { holdingsData, setCurrentShare } = props;
  useEffect(() => {
    if (holdingsData) {
      setSelectedShare(holdingsData[0]);
    }
  }, []);
  useEffect(() => {
    console.log(selectedShare);
  }, [selectedShare]);

  console.log(holdingsData);
  //to add, goddog pair amount (liquidity tokens added), spot price , and how many shares to add
  //abstracct(do not add): fee: set to 6.9 defualt,
  // Abstract Parameters for Users:
  //   - XYK Curve = 10
  //   - Fees = 6.9%
  //   - Make it so that adding 1 NFT requires the same amount of $oooOOO to be added to the LP
  //   - Allow users to only just the number of shares they would like to provide as liquidity.
  //   - Basically make it so users simply 1. Enter the number of NFT's they wana provide and then 2. Click "Create Pool"
  return (
    <div className="border border-transparent bg-stone-900 p-2 rounded-md w-[400px] mx-auto">
      <div className="flex justify-start gap-1">
        <img
          src="https://avatars.githubusercontent.com/u/94413972?s=280&v=4"
          alt=""
          className="w-5 h-5 rounded-full"
        />
        <h3 className="text-white font-bold text-[10px] mt-0.5">
          Add liquidity
        </h3>
      </div>
      <div className=" mt-4">
        <div className="">
          <div className="flex justify-start">
            <h3 className="text-white text-[10px]">Paired token</h3>
          </div>
          <button
            className="border w-full rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500"
            // onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <div className="flex justify-between gap-1 p-0.5">
              <div className="flex justify-start gap-1">
                <img
                  src={
                    "https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                  }
                  alt=""
                  className="w-3 h-3 mt-[3px] ms-1 rounded-full"
                />
                <h3 className="whitespace-nowrap truncate text-[8px] mt-0.5">
                  GodDog
                </h3>
              </div>
              {/* <img
                src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                alt=""
                className="w-3 h-3 mt-1"
              /> */}
            </div>
          </button>
        </div>
        <div>
          <h3 className="text-stone-300 text-center mt-1 font-bold">+</h3>
        </div>
        <div className="">
          <div className="flex justify-start">
            <h3 className="text-white text-[10px]">Paired share</h3>
          </div>
          <button
            className="border w-full rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <div className="flex justify-between gap-1 p-0.5">
              <div className="flex justify-start gap-1">
                <img
                  src={selectedShare?.FTData?.ftPfpUrl}
                  alt=""
                  className="w-3 h-3 mt-[3px] ms-1 rounded-full"
                />
                <h3 className="whitespace-nowrap truncate text-[8px] mt-0.5">
                  {selectedShare?.FTData?.ftName}
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
        <div className="mt-3 grid grid-flow-col p-2">
          <div>
            <div className="grid grid-rows-1">
              <h3 className="text-white text-[8px] font-bold">
                Shares deposited
              </h3>
              <div>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-[75%] bg-stone-800 rounded-lg text-[12px]"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="grid grid-rows-1">
              <h3 className="text-white text-[8px] font-bold">Spot price</h3>
              <div>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-[75%] bg-stone-800 rounded-lg text-[12px]"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="w-full border text-[10px] border-neutral-700 p-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold">
            Create Pool
          </button>
        </div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-neutral-900">
            <h3 className="font-bold text-lg mb-2">Select a share</h3>
            {/* <div className="flex justify-center mt-5">
              <input
                type="text"
                className="w-[80%] border rounded-lg border-transparent outline-none text-[10px] mb-4"
                onChange={(e) => {
                  // setSearchInput(e.target.value);
                }}
              />
            </div> */}
            <div className="overflow-y-auto h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
              {holdingsData ? (
                <>
                  {holdingsData?.map((item) => {
                    const slicedContract = `${item?.FTData?.address.slice(0, 4)}...${item?.FTData?.address.slice(item?.FTData?.address.length - 4, item?.FTData?.address.length)}`;

                    return (
                      <button
                        key={item}
                        className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                        onClick={() => {
                          setCurrentShare(item?.FTData);
                          setSelectedShare(item);
                          document.getElementById("my_modal_1").close();
                        }}
                      >
                        <div className="flex justify-start gap-2">
                          <img
                            src={item?.FTData?.ftPfpUrl}
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                          <h3 className="mt-1">{item?.FTData?.ftName}</h3>
                        </div>
                        <div className="flex justify-end">{slicedContract}</div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <>No Data no holdings</>
              )}
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}

export default CreatePool;

{
  /* <button
key={item}
className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
onClick={() => {
  setCurrentShare(item);
  document.getElementById("my_modal_1").close();
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
<div className="flex justify-end">
  {slicedContract}
</div>
</button> */
}
