import React, { useEffect, useState } from "react";
import { Quoter } from "sudo-defined-quoter";
import AvaliablePairs from "./AvailablePairs";
import { Contract, ethers } from "ethers";
import { readContract } from "@wagmi/core";
import friendTechABI from "../../abi/FriendTechABi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import SudoSwapPoolABI from "../../abi/SudoSwapPoolABI";
import {
  getShareBalance,
  getShareUri,
  getSingleBuyNftPrice,
  getSingleSellNftPrice,
} from "../../requests/txRequests";
import { config } from "../../config";
import { SearchByContract } from "../../requests/friendCalls";
import { useWallets } from "@privy-io/react-auth";
import GodDogABI from "../../abi/GodDogABI";
import SudoSwapPoolTXABI from "../../abi/SudoSwapPoolTXABI";
import { uintFormat } from "../../formatters/format";

function PoolSwap(props) {
  const { setCurrentShare, currentShare } = props;
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [availablePools, setAvailablePools] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [buyFromPool, setBuyFromPool] = useState(true);
  const [uintTotal, setUintTotal] = useState(null);
  const [input, setInput] = useState(null);
  const [total, setTotal] = useState(null);
  useEffect(() => {
    getExistingPools();
  }, []);
  console.log(selectedPool);
  useEffect(() => {
    console.log(input);
    if (buyFromPool) {
      console.log("buy");
      getBuyNftQuote();
    } else {
      console.log("sell");
      getSellNftQuote();
    }
  }, [input]);

  async function approveGoddog() {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const godDogContract = new Contract(
      "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
      GodDogABI,
      signer
    );
    try {
      const res = await godDogContract.approve(
        "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
        "99999999999999999999999999999999"
      );
      const reciept = await res;
      console.log(await reciept);
    } catch (error) {
      console.log(error);
    }
  }
  async function approveShare() {
    try {
      const provider = await w0?.getEthersProvider();
      const network = await provider.getNetwork();
      const signer = await provider?.getSigner();

      const godDogContract = new Contract(
        "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
        friendTechABI,
        signer
      );
      const res = await godDogContract.setApprovalForAll(
        "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
        true
      );
      const reciept = await res;
      console.log(await reciept);
    } catch (error) {
      console.log(error);
    }
  }

  //format for buy in pool
  // purchaseShareFromPool(
  //   selectedPool?.sudoSwapData?.erc1155Id,
  //   selectedPool?.sudoSwapData?.address,
  //   selectedPool?.sudoSwapData?.spotPrice
  // );

  async function buyInPool(nftId, poolAddress, spotPrice) {
    const buyPrice = await getSingleBuyNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      nftId,
      poolAddress,
      String(input)
    );
    console.log(input, buyPrice, spotPrice);

    await approveGoddog();

    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const sudoSwapContract = new Contract(
      "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
      SudoSwapPoolTXABI,
      signer
    );

    try {
      const parameters = [
        [
          [
            poolAddress,
            false,
            [String(input)], // Note: Ensure "1" is a string if required, otherwise use [1] for numbers
            ethers.BigNumber.from(String(buyPrice)),
            "0",
            ethers.BigNumber.from(String(spotPrice)),
            [ethers.BigNumber.from(String(buyPrice))],
          ],
        ],
        [],
        String(w0?.address),
        String(w0?.address),
        false,
      ];
      const res = await sudoSwapContract.swap(parameters, {
        gasLimit: 200000,
      });
      const reciept = await res.wait();
      console.log(await reciept);
      // acitvateLoading();
      // setDisplayPools(false);
      getExistingPools();
    } catch (error) {
      console.log(error);
    }
  }

  //ex format for sell in pool
  // sellInPool(
  //   selectedPool?.sudoSwapData?.erc1155Id,
  //   selectedPool?.sudoSwapData?.address,
  //   selectedPool?.sudoSwapData?.spotPrice
  // );
  async function sellInPool(nftId, poolAddress, spotPrice) {
    const sellPrice = await getSingleSellNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      nftId,
      poolAddress,
      String(input)
    );
    console.log(sellPrice, spotPrice, input);

    await approveShare();

    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const sudoSwapContract = new Contract(
      "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
      SudoSwapPoolTXABI,
      signer
    );
    // format for params
    // '1'
    // nftBuyQuote[3]:
    //  49386666666666666666n
    // spotPrice:
    //  320000000000000000000n
    try {
      const parameters = [
        [],
        [
          [
            poolAddress,
            false,
            false,
            [String(input)], // Note: Ensure "1" is a string if required, otherwise use [1] for numbers
            false,
            "0x",
            ethers.BigNumber.from(String(sellPrice)),
            ethers.BigNumber.from(String(spotPrice)),
            [ethers.BigNumber.from(String(sellPrice))],
          ],
        ],
        String(w0?.address),
        String(w0?.address),
        false,
      ];
      const res = await sudoSwapContract.swap(parameters, {
        gasLimit: 250000,
      });
      const reciept = await res.wait();
      console.log(await reciept);

      // acitvateLoading();
      // setDisplayPools(false);
      getExistingPools();
    } catch (error) {
      console.log(error);
      // setMessage("Transaction Reverted");
    }
  }

  async function getSellNftQuote() {
    console.log(input);
    const sellPrice = await getSingleSellNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      selectedPool?.sudoSwapData?.erc1155Id,
      selectedPool?.sudoSwapData?.address,
      String(input)
    );
    console.log(sellPrice);
    setUintTotal(sellPrice);

    console.log(Number(sellPrice) / 10 ** 18);

    setTotal(Number(sellPrice) / 10 ** 18);
  }
  async function getBuyNftQuote() {
    console.log(input);
    const buyPrice = await getSingleBuyNftPrice(
      readContract,
      config,
      SudoSwapPoolABI,
      selectedPool?.sudoSwapData?.erc1155Id,
      selectedPool?.sudoSwapData?.address,
      String(input)
    );
    console.log(buyPrice);
    setTotal(Number(buyPrice) / 10 ** 18);
  }

  async function getExistingPools() {
    let q = new Quoter(import.meta.env.VITE_DEFINED_KEY, 8453);
    let a = await q.getPoolsForCollection(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
    );
    const poolFormattedData = [];
    console.log(a);
    for (const key in a) {
      const currentId = a[key]?.erc1155Id;
      const currentShareContract = await getShareUri(
        readContract,
        config,
        friendTechABI,
        currentId
      );
      console.log(currentShareContract);
      const currentPoolAddress = a[key].address;
      if (currentShareContract !== null) {
        const currentShareData = await SearchByContract(currentShareContract);
        console.log(currentShareData);
        if (currentShareData !== null) {
          const userShareBalance = await getShareBalance(
            readContract,
            config,
            friendTechABI,
            w0?.address,
            currentId
          );
          const buyPrice = await getSingleBuyNftPrice(
            readContract,
            config,
            SudoSwapPoolABI,
            currentId,
            currentPoolAddress,
            "1"
          );
          console.log(buyPrice);
          const sellPrice = await getSingleSellNftPrice(
            readContract,
            config,
            SudoSwapPoolABI,
            currentId,
            currentPoolAddress,
            "1"
          );
          console.log(sellPrice);
          poolFormattedData.push({
            sudoSwapData: a[key],
            friendTechData: currentShareData,
            userShareBalance: userShareBalance,
            buyPrice: Number(sellPrice),
            sellPrice: buyPrice,
            address: currentShareData?.address,
          });
        }
      }
    }
    console.log(poolFormattedData);
    setSelectedPool(poolFormattedData[0]);
    setAvailablePools(poolFormattedData);
  }
  return (
    <div className="border border-transparent bg-stone-900 p-2 rounded-md w-[400px] mx-auto">
      <h3 className="text-white text-[12px] font-bold p-2">
        {buyFromPool ? "Buy" : "Sell"}
      </h3>
      <div className="grid grid-rows-2 gap-y-4 p-1">
        <div className="border p-2 rounded-lg border-neutral-700 text-white font-mono font-bold text-[12px]">
          <h3>{buyFromPool ? "You buy" : "You Sell"}</h3>
          <input
            type="text"
            className="w-[350px] bg-transparent border border-transparent outline-none"
            onChange={(e) => {
              if (!isNaN(Number(e.target.value))) {
                setInput(Number(e.target.value));
              }
            }}
            value={input || 0}
          />
          <button
            className="border w-[200px] rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <div className="flex justify-between gap-1 p-0.5">
              <div className="flex justify-start gap-1">
                <img
                  src={currentShare?.ftPfpUrl}
                  alt=""
                  className="w-3 h-3 mt-[3px] ms-1 rounded-full"
                />
                <h3 className="whitespace-nowrap truncate text-[8px] mt-0.5">
                  {currentShare?.ftName}
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
        <div className="fixed mt-20 ms-[170px]  ">
          <div
            className="border w-[40px] border-neutral-700 bg-stone-900 p-2 rounded-md flex justify-center text-[8px] text-stone-200 gap-1 hover:text-stone-800"
            onClick={() => {
              if (buyFromPool) {
                setBuyFromPool(false);
              } else {
                setBuyFromPool(true);
              }
            }}
          >
            <FaArrowUp />
          </div>
        </div>

        <div className="border border-neutral-700 rounded-lg text-white font-mono font-bold text-[12px] p-2">
          <h3>{buyFromPool ? "You pay" : "You recieve"}</h3>

          <input
            type="text"
            className="w-[350px] bg-transparent border border-transparent outline-none"
            value={total ? total.toFixed(2) : 0}
          />
          <button className="border w-[200px] rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500">
            <div className="flex justify-between gap-1 p-0.5">
              <div className="flex justify-start gap-1">
                <img
                  src={AvaliablePairs[1]?.imgUrl}
                  alt=""
                  className="w-3 h-3 mt-[3px] ms-1"
                />
                <h3 className="text-[8px] mt-[3px]">
                  {AvaliablePairs[1]?.name}
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
        <div className="">
          <div className="p-2 text-[8px] mb-2">
            <h3>Pool Ca: {selectedPool?.sudoSwapData?.address}</h3>

            <h3>{uintFormat(currentShare?.displayPrice)} Ξ / Share</h3>
          </div>

          <button
            className="w-full border border-neutral-800 bg-blue-500 rounded-lg text-white font-bold text-[12px] p-1"
            onClick={() => {
              if (buyFromPool) {
                console.log("buy");
                console.log(uintFormat(selectedPool?.sudoSwapData?.spotPrice));
                buyInPool(
                  selectedPool?.sudoSwapData?.erc1155Id,
                  selectedPool?.sudoSwapData?.address,
                  selectedPool?.sudoSwapData?.spotPrice
                );
              } else {
                console.log("sell");
                sellInPool(
                  selectedPool?.sudoSwapData?.erc1155Id,
                  selectedPool?.sudoSwapData?.address,
                  selectedPool?.sudoSwapData?.spotPrice
                );
              }
            }}
          >
            {buyFromPool ? "Purchase Shares" : "Sell Shares"}
          </button>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-neutral-900">
          <h3 className="font-bold text-lg mb-2">Select a share</h3>
          <div className="flex justify-center mt-5">
            <input
              type="text"
              className="w-[80%] border rounded-lg border-transparent outline-none text-[10px] mb-4"
              onChange={(e) => {
                // setSearchInput(e.target.value);
              }}
            />
          </div>
          <div className="overflow-y-auto h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
            {availablePools ? (
              <>
                {availablePools.map((item) => {
                  const slicedContract = `${item?.sudoSwapData?.address.slice(0, 4)}...${item?.sudoSwapData?.address.slice(item?.sudoSwapData?.address.length - 4, item?.sudoSwapData?.address.length)}`;

                  return (
                    <button
                      key={item}
                      className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                      onClick={() => {
                        setCurrentShare(item?.friendTechData);
                        setSelectedPool(item);
                        document.getElementById("my_modal_1").close();
                      }}
                    >
                      <div className="flex justify-start gap-2">
                        <img
                          src={item?.friendTechData?.ftPfpUrl}
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                        <h3 className="mt-1">{item?.friendTechData?.ftName}</h3>
                      </div>
                      <div className="flex justify-end">{slicedContract}</div>
                    </button>
                  );
                })}
              </>
            ) : (
              <>Loading</>
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
  );
}

export default PoolSwap;
