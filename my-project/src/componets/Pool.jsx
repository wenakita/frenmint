import React, { useState, useEffect } from "react";
import { Quoter } from "sudo-defined-quoter";
import { readContract } from "@wagmi/core";
import friendTechABI from "../abi/FriendTechABi";
import { Link, useParams } from "react-router-dom";
import { config } from "../config";
import { uintFormat } from "../formatters/format";
import { useWallets } from "@privy-io/react-auth";
import GodDogABI from "../abi/GodDogABI";
import { Contract } from "ethers";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI";
import SudoSwapPoolTXABI from "../abi/SudoSwapPoolTXABI";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ethers } from "ethers";
const API_KEY = import.meta.env.VITE_DEFINED_KEY;
const friendWrapperContract = "0xbeea45F16D512a01f7E2a3785458D4a7089c8514";
function Pool() {
  const [poolsFound, setPoolsFound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayPools, setDisplayPools] = useState(false);
  const params = useParams();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const { id: targetShareId } = params;
  console.log(targetShareId);
  const [input, setInput] = useState(null);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    getPoolData();
    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }, [targetShareId]);
  async function getPoolData() {
    const q = new Quoter(API_KEY, 8453);
    const a = await q.getPoolsForCollection(friendWrapperContract);
    console.log(a);
    dissectPoolData(a);
  }

  async function acitvateLoading() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }

  async function dissectPoolData(data) {
    const friendTechData = await getShareData();
    const userShareBalance = await getShareBalance();

    let targetSharesPools = [];
    console.log(data);
    for (const key in data) {
      const currentPool = data[key];
      const currentId = currentPool?.erc1155Id;
      console.log(currentId);
      console.log(currentPool);
      if (currentId === targetShareId) {
        console.log("true");
        targetSharesPools.push({
          sudoSwapData: currentPool,
          friendTechData: friendTechData,
          userShareBalance: Number(userShareBalance),
        });
        setDisplayPools(true);
      }
    }
    console.log(targetSharesPools);
    setPoolsFound(targetSharesPools);
  }

  async function getShareBalance() {
    console.log("running");
    try {
      console.log("running");
      const balanceResult = await readContract(config, {
        address: friendWrapperContract,
        abi: friendTechABI,
        functionName: "balanceOf",
        args: [w0?.address, targetShareId],
      });
      console.log(balanceResult);
      return balanceResult;
    } catch (error) {
      console.log(error);
    }
  }

  async function getShareData() {
    console.log("Running");
    const shareContract = await getShareUri();
    console.log(shareContract);

    try {
      const res = await fetch(
        `https://prod-api.kosetto.com/users/${shareContract}`
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async function getShareUri() {
    try {
      console.log("Henlo");
      const uriResult = await readContract(config, {
        address: friendWrapperContract,
        abi: friendTechABI,
        functionName: "uri",
        args: [targetShareId],
      });
      const result = uriResult.slice(28, uriResult.length);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async function getButNftQuote(targetid, targetPool) {
    console.log(targetid);
    console.log(targetPool);
    try {
      const buyQuoteResult = await readContract(config, {
        address: targetPool,
        abi: SudoSwapPoolABI,
        functionName: "getBuyNFTQuote",
        args: [targetid, "1"],
      });
      //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
      console.log(buyQuoteResult);
      return buyQuoteResult;
    } catch (error) {
      console.log(error);
    }
  }
  async function getSellNftQuote(targetId, TargetPool) {
    console.log(targetId);
    console.log(TargetPool);
    try {
      const buyQuoteResult = await readContract(config, {
        address: TargetPool,
        abi: SudoSwapPoolABI,
        functionName: "getSellNFTQuote",
        args: [targetId, "1"],
      });
      //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
      console.log(buyQuoteResult);
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
    }
  }
  async function approveShare() {
    console.log("Approving");
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
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero

    try {
      console.log("running");
      console.log(String(nftBuyQuote[3]));
      console.log(TargetPoolAddress);
      console.log(spotPrice);

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
      getPoolData();
    } catch (error) {
      console.log(error);
    }
  }

  async function sellShareFromPool(targetPoolId, TargetPoolAddress, spotPrice) {
    console.log(targetPoolId, TargetPoolAddress);
    console.log(spotPrice);
    const nftBuyQuote = await getSellNftQuote(targetPoolId, TargetPoolAddress);
    await approveShare();

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
      console.log("running");
      console.log(String(nftBuyQuote[3]));
      console.log(TargetPoolAddress);
      console.log(spotPrice);

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
      getPoolData();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <center className="mt-20 mb-20">
      {loading ? (
        <div className="flex justify-center mt-[250px] mb-10">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <>
          {displayPools ? (
            <>
              <h3 className="text-center text-white font-mono font-bold mt-5 text-[20px]">
                Pools For {poolsFound[0]?.friendTechData?.ftName}:
              </h3>
              <div
                className={
                  displayPools
                    ? `border border-slate-500 p-2 rounded-xl overflow-auto h-[500px] w-[410px] mt-10`
                    : null
                }
              >
                {poolsFound.map((item) => {
                  return (
                    <div key={item} className=" flex justify-center mt-3">
                      <div className="border border-slate-500 p-2 w-[320px] rounded-xl bg-black">
                        <div className="p-2">
                          <div>
                            <div className="flex justify-start text-white gap-2">
                              <img
                                src={item?.friendTechData?.ftPfpUrl}
                                alt=""
                                className="w-8 h-8 rounded-full"
                              />
                              <Link
                                to={`/friend/${item?.friendTechData?.address}`}
                                className="text-white text-[10px] mt-2 hover:underline"
                              >
                                {item?.friendTechData?.ftName}
                              </Link>
                            </div>
                          </div>
                          <div className="text-white text-[8px] mt-4 flex justify-start ms-2">
                            <Link
                              to={`https://sudoswap.xyz/#/manage/base/${item?.sudoSwapData?.address}`}
                              className="font-mono font-bold hover:underline hover:text-gray-300"
                            >
                              Pool Ca {item?.sudoSwapData?.address}
                            </Link>
                          </div>
                          <div className="text-white text-[10px] font-mono font-bold mt-2 flex justify-start ms-2">
                            <h3>
                              Share Price:{" "}
                              {uintFormat(item?.friendTechData?.displayPrice)} /
                              Share
                            </h3>
                          </div>
                          <div className="flex justify-start ms-2 gap-2 mt-1">
                            <h3 className="text-white font-mono text-[10px] font-bold mt-1">
                              Pool Spot Price{" "}
                              {uintFormat(
                                item?.sudoSwapData?.spotPrice
                              ).toFixed(3)}{" "}
                            </h3>
                            <img
                              src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                              alt=""
                              className="w-5 h-5 rounded-full mt-0.5"
                            />
                          </div>
                          <div className="flex justify-start ms-2 font-mono font-bold text-white text-[10px] mt-1">
                            <h3>
                              Swap Fee: %{" "}
                              {Number(
                                uintFormat(item?.sudoSwapData?.fee) * 100
                              ).toFixed(2)}
                            </h3>
                          </div>
                          <div className="flex justify-start ms-2 font-mono font-bold text-white text-[10px] mt-1">
                            <h3>
                              Your Share Balance:{" "}
                              {Number(item?.userShareBalance)}
                            </h3>
                          </div>
                          <div className="flex justify-start ms-2 font-mono font-bold text-white text-[10px] mt-1">
                            <h3>
                              Pool Share Balance:{" "}
                              {Number(item?.sudoSwapData?.nftBalance)}
                            </h3>
                          </div>
                          <div className="flex justify-center text-[12px] text-white mt-3 gap-2">
                            {Number(item?.sudoSwapData?.nftBalance > 0) ? (
                              <>
                                {item?.userShareBalance > 0 ? (
                                  <>
                                    {/* <button
                                    className="border text-center p-1 bg-black rounded-xl border-slate-500 "
                                    onClick={() => {
                                      purchaseShareFromPool(
                                        item?.sudoSwapData?.erc1155Id,
                                        item?.sudoSwapData?.address,
                                        item?.sudoSwapData?.spotPrice
                                      );
                                    }}
                                  >
                                    Purchase Shares
                                  </button> */}
                                    <Menu>
                                      <MenuButton className="border text-center p-1 bg-black rounded-xl border-slate-500 ">
                                        Purchase Shares
                                      </MenuButton>
                                      <MenuItems
                                        anchor="top"
                                        className={"w-[170px]"}
                                      >
                                        <MenuItem className=" border border-slate-500 text-white bg-black rounded-lg ">
                                          <div>
                                            <div className="flex justify-start">
                                              <h3 className="text-[8px] text-white p-2">
                                                Purchase{" "}
                                                {
                                                  item?.poolData?.shareData
                                                    ?.ftName
                                                }{" "}
                                                shares
                                              </h3>
                                            </div>
                                            {message ? (
                                              <div className="flex justify-center text-red-500 text-[8px]">
                                                {message}
                                              </div>
                                            ) : null}
                                            <div className="p-4">
                                              <input
                                                type="text"
                                                className="bg-stone-800 rounded-lg w-[135px] text-white text-[10px] p-0.5"
                                                onClick={(e) => {
                                                  //this prevents from th emenu closing automatically when the user clicks th einput element
                                                  e.stopPropagation();
                                                }}
                                                onChange={(e) => {
                                                  console.log(e.target.value);
                                                  setInput(e.target.value);
                                                }}
                                              />
                                              <div className="flex justify-end">
                                                <h3 className="text-white text-[7px]">
                                                  Pool Share Balance:{" "}
                                                  {Number(
                                                    item?.sudoSwapData
                                                      ?.nftBalance
                                                  )}
                                                </h3>
                                              </div>
                                            </div>
                                            <div className="mt-3 flex justify-center mb-3">
                                              <button
                                                className="border text-center p-1 bg-black rounded-lg border-slate-500 text-[10px]"
                                                onClick={(e) => {
                                                  if (
                                                    Number(input) > 0 &&
                                                    Number(input) <=
                                                      Number(
                                                        item?.sudoSwapData
                                                          ?.nftBalance
                                                      )
                                                  ) {
                                                    purchaseShareFromPool(
                                                      item?.sudoSwapData
                                                        ?.erc1155Id,
                                                      item?.sudoSwapData
                                                        ?.address,
                                                      item?.sudoSwapData
                                                        ?.spotPrice
                                                    );
                                                  } else {
                                                    e.stopPropagation();
                                                    setMessage(
                                                      "Invalid Buy Amount"
                                                    );
                                                  }
                                                }}
                                              >
                                                Purchase Shares
                                              </button>
                                            </div>
                                          </div>
                                        </MenuItem>
                                      </MenuItems>
                                    </Menu>

                                    <Menu>
                                      <MenuButton className="border text-center p-1 bg-black rounded-xl border-slate-500 ">
                                        Sell Shares
                                      </MenuButton>
                                      <MenuItems
                                        anchor="top"
                                        className={"w-[170px]"}
                                      >
                                        <MenuItem className=" border border-slate-500 text-white bg-black rounded-lg ">
                                          <div>
                                            <div className="flex justify-start">
                                              <h3 className="text-[8px] text-white p-2">
                                                Sell{" "}
                                                {
                                                  item?.poolData?.shareData
                                                    ?.ftName
                                                }{" "}
                                                shares
                                              </h3>
                                            </div>
                                            {message ? (
                                              <div className="flex justify-center text-red-500 text-[8px]">
                                                {message}
                                              </div>
                                            ) : null}
                                            <div className="p-4">
                                              <input
                                                type="text"
                                                className="bg-stone-800 rounded-lg w-[135px] text-white text-[10px] p-0.5"
                                                onClick={(e) => {
                                                  //this prevents from th emenu closing automatically when the user clicks th einput element
                                                  e.stopPropagation();
                                                }}
                                                onChange={(e) => {
                                                  console.log(e.target.value);
                                                  setInput(e.target.value);
                                                }}
                                              />
                                              <div className="flex justify-end">
                                                <h3 className="text-white text-[7px]">
                                                  Your Share Balance:{" "}
                                                  {Number(
                                                    item?.userShareBalance
                                                  )}
                                                </h3>
                                              </div>
                                            </div>
                                            <div className="mt-3 flex justify-center mb-3">
                                              <button
                                                className="border text-center p-1 bg-black rounded-lg border-slate-500 text-[10px]"
                                                onClick={(e) => {
                                                  if (
                                                    Number(input) > 0 &&
                                                    Number(input) <=
                                                      Number(
                                                        item?.userShareBalance
                                                      )
                                                  ) {
                                                    sellShareFromPool(
                                                      item?.sudoSwapData
                                                        ?.erc1155Id,
                                                      item?.sudoSwapData
                                                        ?.address,
                                                      item?.sudoSwapData
                                                        ?.spotPrice
                                                    );
                                                  } else {
                                                    e.stopPropagation();
                                                    setMessage("Invalid Input");
                                                  }
                                                }}
                                              >
                                                Sell Shares
                                              </button>
                                            </div>
                                          </div>
                                        </MenuItem>
                                      </MenuItems>
                                    </Menu>
                                    {/* <button
                                    className="border text-center p-1 bg-black rounded-xl border-slate-500 "
                                    onClick={() => {
                                      sellShareFromPool(
                                        item?.sudoSwapData?.erc1155Id,
                                        item?.sudoSwapData?.address,
                                        item?.sudoSwapData?.spotPrice
                                      );
                                    }}
                                  >
                                    Sell Shares
                                  </button> */}
                                  </>
                                ) : (
                                  <Menu>
                                    <MenuButton className="border text-center p-1 bg-black rounded-xl border-slate-500 ">
                                      Purchase Shares
                                    </MenuButton>
                                    <MenuItems
                                      anchor="top"
                                      className={"w-[170px]"}
                                    >
                                      <MenuItem className=" border border-slate-500 text-white bg-black rounded-lg ">
                                        <div>
                                          <div className="flex justify-start">
                                            <h3 className="text-[8px] text-white p-2">
                                              Purchase{" "}
                                              {
                                                item?.poolData?.shareData
                                                  ?.ftName
                                              }{" "}
                                              shares
                                            </h3>
                                          </div>
                                          {message ? (
                                            <div className="flex justify-center text-red-500 text-[8px]">
                                              {message}
                                            </div>
                                          ) : null}
                                          <div className="p-4">
                                            <input
                                              type="text"
                                              className="bg-stone-800 rounded-lg w-[135px] text-white text-[10px] p-0.5"
                                              onClick={(e) => {
                                                //this prevents from th emenu closing automatically when the user clicks th einput element
                                                e.stopPropagation();
                                              }}
                                              onChange={(e) => {
                                                console.log(e.target.value);
                                                setInput(e.target.value);
                                              }}
                                            />
                                            <div className="flex justify-end">
                                              <h3 className="text-white text-[7px]">
                                                Pool Share Balance:{" "}
                                                {Number(
                                                  item?.sudoSwapData?.nftBalance
                                                )}
                                              </h3>
                                            </div>
                                          </div>
                                          <div className="mt-3 flex justify-center mb-3">
                                            <button
                                              className="border text-center p-1 bg-black rounded-lg border-slate-500 text-[10px]"
                                              onClick={(e) => {
                                                if (
                                                  Number(input) > 0 &&
                                                  Number(input) <=
                                                    Number(
                                                      item?.sudoSwapData
                                                        ?.nftBalance
                                                    )
                                                ) {
                                                  purchaseShareFromPool(
                                                    item?.sudoSwapData
                                                      ?.erc1155Id,
                                                    item?.sudoSwapData?.address,
                                                    item?.sudoSwapData
                                                      ?.spotPrice
                                                  );
                                                } else {
                                                  e.stopPropagation();
                                                  setMessage("Invalid Input");
                                                }
                                              }}
                                            >
                                              Purchase Shares
                                            </button>
                                          </div>
                                        </div>
                                      </MenuItem>
                                    </MenuItems>
                                  </Menu>
                                )}
                              </>
                            ) : (
                              <>
                                {item?.userShareBalance > 0 ? (
                                  <Menu>
                                    <MenuButton className="border text-center p-1 bg-black rounded-xl border-slate-500 ">
                                      Sell Shares
                                    </MenuButton>
                                    <MenuItems
                                      anchor="top"
                                      className={"w-[170px]"}
                                    >
                                      <MenuItem className=" border border-slate-500 text-white bg-black rounded-lg ">
                                        <div>
                                          <div className="flex justify-start">
                                            <h3 className="text-[8px] text-white p-2">
                                              Sell{" "}
                                              {
                                                item?.poolData?.shareData
                                                  ?.ftName
                                              }{" "}
                                              shares
                                            </h3>
                                          </div>
                                          {message ? (
                                            <div className="flex justify-center text-red-500 text-[8px]">
                                              {message}
                                            </div>
                                          ) : null}
                                          <div className="p-4">
                                            <input
                                              type="text"
                                              className="bg-stone-800 rounded-lg w-[135px] text-white text-[10px] p-0.5"
                                              onClick={(e) => {
                                                //this prevents from th emenu closing automatically when the user clicks th einput element
                                                e.stopPropagation();
                                              }}
                                              onChange={(e) => {
                                                console.log(e.target.value);
                                                setInput(e.target.value);
                                              }}
                                            />
                                            <div className="flex justify-end">
                                              <h3 className="text-white text-[7px]">
                                                Your Share Balance:{" "}
                                                {Number(item?.userShareBalance)}
                                              </h3>
                                            </div>
                                          </div>
                                          <div className="mt-3 flex justify-center mb-3">
                                            <button
                                              className="border text-center p-1 bg-black rounded-lg border-slate-500 text-[10px]"
                                              onClick={(e) => {
                                                if (
                                                  Number(input) > 0 &&
                                                  Number(input) <=
                                                    Number(
                                                      item?.userShareBalance
                                                    )
                                                ) {
                                                  sellShareFromPool(
                                                    item?.sudoSwapData
                                                      ?.erc1155Id,
                                                    item?.sudoSwapData?.address,
                                                    item?.sudoSwapData
                                                      ?.spotPrice
                                                  );
                                                } else {
                                                  e.stopPropagation();
                                                  setMessage("Invalid Input");
                                                }
                                              }}
                                            >
                                              Sell Shares
                                            </button>
                                          </div>
                                        </div>
                                      </MenuItem>
                                    </MenuItems>
                                  </Menu>
                                ) : (
                                  <button className="border text-center p-1 bg-black rounded-xl border-slate-500 ">
                                    Trading not available
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex justify-center gap-2 mt-[180px]">
              <img
                src="https://forums.frontier.co.uk/attachments/1000012145-png.391294/"
                alt=""
                className="w-7 h-7"
              />
              <h3 className="text-white font-mono font-bold text-[10px] mt-2">
                There are currently no pools for this share
              </h3>
            </div>
          )}
        </>
      )}
    </center>
  );
}

export default Pool;
