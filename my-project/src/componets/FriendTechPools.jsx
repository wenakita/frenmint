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

  useEffect(() => {
    getExistingPools();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }, []);

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
        <center className="mt-5 ms-5">
          <div className="flex justify-center gap-2 mb-5">
            <div className=" text-white text-center font-mono font-bold">
              Friend.Tech Share Trading Pools :
            </div>
          </div>
          <div
            className={
              displayPools
                ? `border border-slate-500 p-2 rounded-xl overflow-auto h-[500px] w-[410px] mt-10`
                : null
            }
          >
            {displayPools && poolsData ? (
              <>
                {poolsData.map((item) => {
                  return (
                    <div
                      key={item}
                      className="border border-slate-500 p-2 w-[320px] rounded-xl mt-2"
                    >
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
                            Liquidity Provided{" "}
                            {uintFormat(item?.sudoSwapData?.spotPrice).toFixed(
                              3
                            )}{" "}
                          </h3>
                          <img
                            src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                            alt=""
                            className="w-5 h-5 rounded-full mt-0.5"
                          />
                        </div>
                        <div className="flex justify-start ms-2 font-mono font-bold text-white text-[10px] mt-1 gap-1">
                          <h3 className="mt-0.5">
                            Buy Price: {item?.buyPrice}
                          </h3>
                          <img
                            src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                        </div>
                        <div className="flex justify-start ms-2 font-mono font-bold text-white text-[10px] mt-1 gap-1">
                          <h3 className="mt-0.5">
                            Sell Price: {item?.sellPrice}
                          </h3>
                          <img
                            src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                            alt=""
                            className="w-5 h-5 rounded-full"
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
                            Your Share Balance: {Number(item?.userShareBalance)}
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
                                                  setMessage(
                                                    "Invalid Buy Amount"
                                                  );
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
                                            {item?.poolData?.shareData?.ftName}{" "}
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
                                                  item?.sudoSwapData?.erc1155Id,
                                                  item?.sudoSwapData?.address,
                                                  item?.sudoSwapData?.spotPrice
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
                                            {item?.poolData?.shareData?.ftName}{" "}
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
                                                  Number(item?.userShareBalance)
                                              ) {
                                                sellShareFromPool(
                                                  item?.sudoSwapData?.erc1155Id,
                                                  item?.sudoSwapData?.address,
                                                  item?.sudoSwapData?.spotPrice
                                                );
                                              } else {
                                                e.stopPropagation();
                                                setMessage(
                                                  "Invalid Buy Amount"
                                                );
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
                  );
                })}
              </>
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
