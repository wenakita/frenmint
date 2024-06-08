import React, { useState, useEffect } from "react";
import { Quoter } from "sudo-defined-quoter";
import { Contract, ethers } from "ethers";
import { readContract } from "@wagmi/core";
import friendTechABI from "../abi/FriendTechABi";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI";
import { config } from "../config";
import { uintFormat } from "../formatters/format";
import GodDogABI from "../abi/GodDogABI";
import SudoSwapABI from "../abi/SudoSwapABI";
import { Link } from "react-router-dom";
import { useWallets } from "@privy-io/react-auth";
import SudoSwapPoolTXABI from "../abi/SudoSwapPoolTXABI";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const API_KEY = import.meta.env.VITE_DEFINED_KEY;
const friendWrapperContract = "0xbeea45F16D512a01f7E2a3785458D4a7089c8514";
function FriendTechPools() {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [poolsData, setPoolsData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [displayPools, setDisplayPools] = useState(false);
  const [input, setInput] = useState(null);
  const [message, setMessage] = useState(null);
  const [singleBuyQuote, setSingleBuyQuote] = useState(null);
  const [singleSellQuote, setSingleSellQuote] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    getExistingPools();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }, []);

  useEffect(() => {
    if (selectedPool) {
      setDisplayModal(true);
      console.log(selectedPool);
    }
  }, [selectedPool]);

  async function acitvateLoading() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }

  async function getExistingPools() {
    const poolFormattedData = [];
    let q = new Quoter(API_KEY, 8453);
    let a = await q.getPoolsForCollection(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
    );

    for (const key in a) {
      const currentId = a[key]?.erc1155Id;
      const currentShareContract = await getShareUri(currentId);
      const currentPoolAddress = a[key].address;
      if (currentShareContract !== null) {
        const currentShareData = await getShareData(currentShareContract);
        if (currentShareData !== null) {
          const userShareBalance = await getUserShareBalance(currentId);
          const buyPrice = await getSingleBuyNftPrice(
            currentId,
            currentPoolAddress
          );
          const sellPrice = await getSingleSellNftPrice(
            currentId,
            currentPoolAddress
          );
          poolFormattedData.push({
            sudoSwapData: a[key],
            friendTechData: currentShareData,
            userShareBalance: userShareBalance,
            buyPrice: sellPrice,
            sellPrice: buyPrice,
          });
          setDisplayPools(true);
        }
      }
    }
    setPoolsData(poolFormattedData);
  }

  async function getSingleSellNftPrice(targetid, targetPool) {
    try {
      const buyQuoteResult = await readContract(config, {
        address: targetPool,
        abi: SudoSwapPoolABI,
        functionName: "getBuyNFTQuote",
        args: [targetid, "1"],
      });
      const output = Number(buyQuoteResult[3]) / 10 ** 18;

      //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
      return output.toFixed(2);
    } catch (error) {
      console.log(error);
    }
  }

  async function getSingleBuyNftPrice(targetId, TargetPool) {
    try {
      const buyQuoteResult = await readContract(config, {
        address: TargetPool,
        abi: SudoSwapPoolABI,
        functionName: "getSellNFTQuote",
        args: [targetId, "1"],
      });
      //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
      const output = Number(buyQuoteResult[3]) / 10 ** 18;
      return Number(output.toFixed(2));
    } catch (error) {
      console.log(error);
    }
  }

  async function getButNftQuote(targetid, targetPool) {
    try {
      const buyQuoteResult = await readContract(config, {
        address: targetPool,
        abi: SudoSwapPoolABI,
        functionName: "getBuyNFTQuote",
        args: [targetid, input],
      });
      //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero

      return buyQuoteResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getSellNftQuote(targetId, TargetPool) {
    try {
      const buyQuoteResult = await readContract(config, {
        address: TargetPool,
        abi: SudoSwapPoolABI,
        functionName: "getSellNFTQuote",
        args: [targetId, input],
      });
      //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero

      return buyQuoteResult;
    } catch (error) {
      console.log(error);
    }
  }

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
      setMessage("Transaction Reverted");
    }
  }

  async function approveShareSpending() {
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
      setMessage("Transaction Reverted");
    }
  }

  //when u sell a share to the pool the pool automatically deposits the shares to the pool
  async function sellShareFromPool(targetPoolId, TargetPoolAddress, spotPrice) {
    const nftBuyQuote = await getSellNftQuote(targetPoolId, TargetPoolAddress);
    await approveShareSpending();

    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const sudoSwapContract = new Contract(
      "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
      SudoSwapPoolTXABI,
      signer
    );
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero

    try {
      const parameters = [
        [],
        [
          [
            TargetPoolAddress,
            false,
            false,
            [input], // Note: Ensure "1" is a string if required, otherwise use [1] for numbers
            false,
            "0x",
            ethers.BigNumber.from(String(nftBuyQuote[3])),
            ethers.BigNumber.from(String(spotPrice)),
            [ethers.BigNumber.from(String(nftBuyQuote[3]))],
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

      acitvateLoading();
      setDisplayPools(false);
      getExistingPools();
    } catch (error) {
      console.log(error);
      setMessage("Transaction Reverted");
    }
  }

  async function purchaseShareFromPool(
    targetPoolId,
    TargetPoolAddress,
    spotPrice
  ) {
    await approveGoddog();
    const nftBuyQuote = await getButNftQuote(targetPoolId, TargetPoolAddress);
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
            TargetPoolAddress,
            false,
            [input], // Note: Ensure "1" is a string if required, otherwise use [1] for numbers
            ethers.BigNumber.from(String(nftBuyQuote[3])),
            "0",
            ethers.BigNumber.from(String(spotPrice)),
            [ethers.BigNumber.from(String(nftBuyQuote[3]))],
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
      acitvateLoading();
      setDisplayPools(false);
      getExistingPools();
    } catch (error) {
      console.log(error);
      setMessage("Transaction Reverted");
    }
  }

  async function getShareUri(targetId) {
    try {
      const uriResult = await readContract(config, {
        address: friendWrapperContract,
        abi: friendTechABI,
        functionName: "uri",
        args: [targetId],
      });
      const outputContract = uriResult.slice(28, uriResult.length);
      return outputContract;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUserShareBalance(targetId) {
    try {
      const userBalanceResult = await readContract(config, {
        address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
        abi: friendTechABI,
        functionName: "balanceOf",
        args: [w0?.address, targetId],
      });
      console.log(userBalanceResult);
      if (Number(userBalanceResult) > 0) {
        return Number(userBalanceResult);
      }
      return 0;
    } catch (error) {
      console.log(error);
    }
  }

  async function getShareData(targetContract) {
    try {
      const res = await fetch(
        `https://prod-api.kosetto.com/users/${targetContract}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  return (
    <center className="mb-20">
      <div className="text-[30px] text-center p-5  flex justify-center">
        <img
          src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmNfe9547vPVgd8qqdCFeH81yHos1n1CoQZu1D9n5Nrjvp?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
          alt=""
          style={{ maxWidth: "80%" }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-10">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <center className="mt-5 ms-5 ">
          <div className="flex justify-center gap-2 mb-5">
            <div className=" text-white text-center font-mono font-bold">
              Friend.Tech Share Trading Pools :
            </div>
          </div>
          <div
            className={
              displayPools
                ? `border border-stone-800 p-2 rounded-md overflow-auto overflow-x-auto h-[300px] w-[400px] md:w-[800px] mt-10 me-auto`
                : null
            }
          >
            {displayPools && poolsData ? (
              <table className="table table-zebra-zebra text-white ">
                <thead className=" text-[9px]">
                  <th>Pool</th>
                  <th>LP Provided</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                  <th>Fee</th>
                  <th>Pool Balance</th>
                </thead>
                <tbody>
                  {poolsData.map((item) => {
                    return (
                      <>
                        <tr
                          key={item}
                          type="button"
                          className="text-[8px] hover:bg-stone-800 "
                          onClick={() => {
                            setSelectedPool(item);
                            console.log(item);

                            document.getElementById("my_modal_1").showModal();
                          }}
                        >
                          <td className="whitespace-nowrap">
                            <div className="flex gap-0.5">
                              <img
                                src={item?.friendTechData?.ftPfpUrl}
                                alt=""
                                className="rounded-full w-5 h-5"
                              />
                              <img
                                src="https://d3egfmvgqzu76k.cloudfront.net/pfp-images/0x7b202496c103da5bedfe17ac8080b49bd0a333f1/35134801v4w26w52w8?Expires=1817779549&Key-Pair-Id=K11ON08J8XW8N0&Signature=TBygi2LdmQalX3oHMzNRwwPD95zgKt~m-1elyX6DXIMMNSop1uZ6xv5-Oln4xLEoE57tbpfuqRTkpGkdlurRsashTjRfVJPY9MvxdHgJaMtKD1QDFp8Z8XJvDrUg31jbAC8WnZTmEfAd4IIxSkqCu3~idH1U8JtruSR6b2MJaOsoYOBWi~6ZN5B0p1gWRbYouryG-SzgfFIpUbc3xqXq3J8tW7cuf-rXHsPNG1087uZdQxFIJrBAXAkS2oB8qCpN3RnWgdt9Ghv2xg2dxM3zXe2BOt6Y4DC2fcliHPu9bYFVlqMAXINTu~EPCk-7hP0H-OeLtCyHncivrI8uKouMOw__"
                                alt=""
                                className="w-5 h-5 rounded-full"
                              />
                              <h3 className="ms-1">
                                {item?.friendTechData?.ftName}-oooOOO
                              </h3>
                            </div>
                          </td>

                          <td className="whitespace-nowrap">
                            {uintFormat(item?.sudoSwapData?.spotPrice).toFixed(
                              3
                            )}{" "}
                            $OOOooo
                          </td>
                          <td className="whitespace-nowrap">
                            {item?.buyPrice} $OOOooo
                          </td>
                          <td className="whitespace-nowrap">
                            {item?.sellPrice} $OOOooo
                          </td>
                          <td className="whitespace-nowrap">
                            {" "}
                            {Number(
                              uintFormat(item?.sudoSwapData?.fee) * 100
                            ).toFixed(1)}
                            %
                          </td>
                          <td className="whitespace-nowrap flex justify-center ">
                            {Number(item?.userShareBalance)}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center gap-2">
                <img
                  src="https://forums.frontier.co.uk/attachments/1000012145-png.391294/"
                  alt=""
                  className="w-7 h-7"
                />
                <h3 className="text-white font-mono font-bold text-[10px] mt-2">
                  No Pools Available Right Now
                </h3>
              </div>
            )}
          </div>
          <dialog id="my_modal_1" className="modal">
            {selectedPool !== null || selectedPool ? (
              <div className="p-10 w-[410px] rounded-lg bg-stone-900 ">
                <button
                  className="text-white"
                  onClick={() => {
                    document.getElementById("my_modal_1").close();
                  }}
                >
                  X
                </button>
                <div className="flex gap-0.5 ">
                  <img
                    src={selectedPool?.friendTechData?.ftPfpUrl}
                    alt=""
                    className="rounded-full w-5 h-5"
                  />
                  <img
                    src="https://d3egfmvgqzu76k.cloudfront.net/pfp-images/0x7b202496c103da5bedfe17ac8080b49bd0a333f1/35134801v4w26w52w8?Expires=1817779549&Key-Pair-Id=K11ON08J8XW8N0&Signature=TBygi2LdmQalX3oHMzNRwwPD95zgKt~m-1elyX6DXIMMNSop1uZ6xv5-Oln4xLEoE57tbpfuqRTkpGkdlurRsashTjRfVJPY9MvxdHgJaMtKD1QDFp8Z8XJvDrUg31jbAC8WnZTmEfAd4IIxSkqCu3~idH1U8JtruSR6b2MJaOsoYOBWi~6ZN5B0p1gWRbYouryG-SzgfFIpUbc3xqXq3J8tW7cuf-rXHsPNG1087uZdQxFIJrBAXAkS2oB8qCpN3RnWgdt9Ghv2xg2dxM3zXe2BOt6Y4DC2fcliHPu9bYFVlqMAXINTu~EPCk-7hP0H-OeLtCyHncivrI8uKouMOw__"
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                  <h3 className="ms-1">
                    w{selectedPool?.friendTechData?.ftName}-oooOOO
                  </h3>
                </div>

                <div className="p-2 mt-2 flex justify-start gap-20 border border-stone-700 rounded-lg bg-stone-800">
                  <div className="grid grid-cols-3 gap-10">
                    <div className="grid grid-rows-1">
                      <div>
                        <h3 className="text-[8px] text-stone-300">Buy Price</h3>
                      </div>
                      <h3 className="text-[8px] text-green-500 whitespace-nobreak">
                        {selectedPool?.buyPrice} $OOOooo
                      </h3>
                    </div>
                    <div className="grid grid-rows-1 whitespace-nobreak">
                      <div>
                        <h3 className="text-[8px] text-stone-300 ">
                          Sell Price
                        </h3>
                      </div>
                      <h3 className="text-[8px] text-red-500 whitespace-nobreak">
                        {selectedPool?.buyPrice} $OOOooo
                      </h3>
                    </div>
                    <div className="grid grid-rows-1 whitespace-nobreak">
                      <div>
                        <h3 className="text-[8px] text-stone-300 whitespace-nobreak">
                          Pool Creator Fees
                        </h3>
                      </div>
                      <h3 className="text-[8px] text-stone-300 ">
                        {Number(
                          uintFormat(selectedPool?.sudoSwapData?.fee) * 100
                        ).toFixed()}
                        %
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  {selectedPool?.userShareBalance > 0 ? (
                    <>
                      {Number(selectedPool?.sudoSwapData?.nftBalance) > 0 ? (
                        <>
                          <div className="">
                            <p className="flex justify-start text-[12px]">
                              Purchase
                            </p>
                            <input
                              type="text"
                              className="flex justify-start w-full rounded-lg text-[12px]"
                              onChange={(e) => {
                                setInput(e.target.value);
                              }}
                            />
                            <div className="flex justify-end ">
                              <h3 className="text-white text-[7px] me-1">
                                {" "}
                                Pool Share Balance:{" "}
                                {Number(
                                  selectedPool?.sudoSwapData?.nftBalance
                                )}{" "}
                              </h3>
                            </div>
                            <div>
                              <button
                                className=" p-1 border w-full mt-2 bg-blue-600 text-white rounded-md border-stone-800 text-[12px] font-bold"
                                onClick={(e) => {
                                  if (
                                    Number(input) > 0 &&
                                    Number(input) <=
                                      Number(
                                        selectedPool?.sudoSwapData?.nftBalance
                                      )
                                  ) {
                                    purchaseShareFromPool(
                                      selectedPool?.sudoSwapData?.erc1155Id,
                                      selectedPool?.sudoSwapData?.address,
                                      selectedPool?.sudoSwapData?.spotPrice
                                    );
                                    document
                                      .getElementById("my_modal_1")
                                      .close();
                                  } else {
                                    e.stopPropagation();
                                    setMessage("Invalid Buy Amount");
                                  }
                                }}
                              >
                                Purchase Shares
                              </button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="flex justify-start text-[12px]">
                              Sell
                            </p>
                            <input
                              type="text"
                              className="flex justify-start w-full rounded-lg text-[12px]"
                              onChange={(e) => {
                                setInput(e.target.value);
                              }}
                            />
                            <div className="flex justify-end ">
                              <h3 className="text-white text-[7px] me-1">
                                {" "}
                                Share Balance:{" "}
                                {Number(
                                  selectedPool?.sudoSwapData?.nftBalance
                                )}{" "}
                              </h3>
                            </div>
                            <button
                              className=" p-1 border w-full mt-2 bg-blue-600 text-white rounded-md border-stone-800 text-[12px] font-bold"
                              onClick={(e) => {
                                if (
                                  Number(input) > 0 &&
                                  Number(input) <=
                                    Number(selectedPool?.userShareBalance)
                                ) {
                                  sellShareFromPool(
                                    selectedPool?.sudoSwapData?.erc1155Id,
                                    selectedPool?.sudoSwapData?.address,
                                    selectedPool?.sudoSwapData?.spotPrice
                                  );
                                  document.getElementById("my_modal_1").close();
                                } else {
                                  e.stopPropagation();
                                  setMessage("Invalid Buy Amount");
                                }
                              }}
                            >
                              Sell Shares
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="">Purchase</p>
                      )}
                    </>
                  ) : (
                    <p className="text-center mt-4 font-bold">
                      Trading is unavailable
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </dialog>
        </center>
      )}
    </center>
  );
}

//in order to be able to purchase from pool the pool share balance should be greater than zero
//for purchase and sell share we must check what the pools current nft balance is before adding which buttons we can use (buy or sell)
//conditional rendering
export default FriendTechPools;
//ok so basically users who do ot own the pool can purchase shares only from the looks of it

//those who own the shares can deposit shares deposit goddog and withdraw both etc

//so how the pool works is when we make a pool we add the initial goddog liquidity and on each buy the initial goddog token balance in the pool increases on sell i asume the token amount in th epool decreases just like any other pool
