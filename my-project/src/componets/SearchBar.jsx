import { useEffect, useState } from "react";
import { SearchByContract, SearchByUser } from "../requests/friendCalls";
import { uintFormat } from "../formatters/format";
import { readContract } from "@wagmi/core";
import { config } from "../config";
import { Link } from "react-router-dom";
import { Quoter } from "sudo-defined-quoter";
import friendTechABI from "../abi/FriendTechABi";
const API_KEY = import.meta.env.VITE_DEFINED_KEY;
const friendWrapperContract = "0xbeea45F16D512a01f7E2a3785458D4a7089c8514";

function SearchBar() {
  const [input, setInput] = useState("");
  const [activateResults, setActivateResults] = useState(false);
  const [caResults, setCaResults] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [searchPools, setSearchPools] = useState(false);
  const [searchUsers, setSearchUsers] = useState(false);
  const [poolsData, setPoolsData] = useState(null);
  const [matchingPools, setMatchingPools] = useState(null);

  const [resultType, setResultType] = useState("user");
  useEffect(() => {
    getActivePools();
  }, [searchPools, activateResults]);
  useEffect(() => {
    if (searchUsers) {
      if (input.includes("0x")) {
        console.log("Search address");
        setResultType("contract");
        fetchContract();
      } else {
        console.log("Search user");
        setResultType("user");
        fetchUser();
      }
    }
    if (searchPools) {
      if (input.length > 0) {
        console.log("hello");
        searchPoolsData();
      } else {
        setMatchingPools(null);
      }
    }
  }, [input]);

  async function searchPoolsData() {
    const matchingResults = [];
    if (poolsData !== null) {
      for (const key in poolsData) {
        const currentPoolData = poolsData[key];
        const currentName =
          poolsData[key]?.friendTechData?.ftName.toLowerCase();
        console.log(poolsData[key]?.friendTechData?.ftName);
        console.log(currentPoolData);
        if (currentName.includes(input)) {
          matchingResults.push(poolsData[key]);
        }
      }
    }
    setMatchingPools(matchingResults);
  }

  async function fetchContract() {
    const results = await SearchByContract(input);
    console.log(results);
    if (results?.message) {
      setCaResults(null);
    } else {
      setCaResults(results);
    }
  }

  async function getActivePools() {
    let formattedPoolsData = [];
    console.log("running");
    let q = new Quoter(API_KEY, 8453);
    const a = await q.getPoolsForCollection(friendWrapperContract);
    console.log(a);
    for (const key in a) {
      const currentId = a[key].erc1155Id;
      const currentShareContract = await getShareUri(currentId);
      const shareData = await getPoolShareData(currentShareContract);
      if (shareData !== null && !!shareData) {
        console.log("true");
        formattedPoolsData.push({
          sudoSwapData: a[key],
          friendTechData: shareData,
        });
      }
    }
    setPoolsData(formattedPoolsData);
  }
  async function getShareUri(targetId) {
    console.log(targetId);
    try {
      const uriResult = await readContract(config, {
        address: friendWrapperContract,
        abi: friendTechABI,
        functionName: "uri",
        args: [targetId],
      });
      const contractResponse = uriResult.slice(28, uriResult.length);
      console.log(contractResponse);
      return contractResponse;
    } catch (error) {
      console.log(error);
    }
  }
  async function getPoolShareData(targetContract) {
    console.log(targetContract);
    try {
      const res = await fetch(
        `https://prod-api.kosetto.com/users/${targetContract}`
      );

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchUser() {
    const results = await SearchByUser(input);
    console.log(results);
    if (results?.message || results === undefined) {
      setUserResults(null);
    } else {
      setUserResults(results);
    }
  }
  return (
    <div className="flex justify-center gap-2">
      <svg
        width="12"
        height="12"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-1.5"
      >
        <path
          d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
          fill="white"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
      <input
        type="text"
        className="text-white border border-stone-800 bg-stone-900 rounded-xl w-[300px] text-[10px] h-[70%] mt-0.5"
        value={input}
        onChange={(e) => {
          console.log(e.target.value);
          setInput(e.target.value);
        }}
        onClick={() => {
          setActivateResults(true);
        }}
      />

      {activateResults ? (
        <div className="border absolute mt-7 w-[300px] bg-black border-slate-500 ms-5">
          <div className="flex justify-between">
            <div className="flex justify-start gap-2 text-[12px] p-2">
              <button
                className="text-white  hover:underline"
                onClick={() => {
                  console.log("henlo");
                  setSearchUsers(true);

                  setSearchPools(false);
                  setMatchingPools(null);
                }}
              >
                Users
              </button>
              <button
                className="text-white hover:underline"
                onClick={() => {
                  console.log("henlo");
                  setSearchUsers(false);

                  setSearchPools(true);
                }}
              >
                Pools
              </button>
            </div>
            <div className=" flex justify-end text-white me-3">
              <button
                onClick={() => {
                  setActivateResults(false);
                  setCaResults(null);
                  setUserResults(null);
                }}
              >
                X
              </button>
            </div>
          </div>
          {searchUsers ? (
            <>
              {resultType === "contract" ? (
                <>
                  {caResults !== null ? (
                    <div className="border border-slate-500  text-white text-center">
                      <Link
                        to={`/friend/${caResults?.address}`}
                        className="border border-slate-500 p-3 grid grid-cols-3"
                        onClick={() => {
                          setActivateResults(false);
                        }}
                      >
                        <div>
                          <div className="flex justify-start gap-2">
                            <img
                              src={caResults?.ftPfpUrl}
                              alt=""
                              className="w-5 h-5 rounded-full"
                            />
                            <h3 className="text-whit text-[10px]">
                              {caResults?.ftName}
                            </h3>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-white text-[10px]">
                            {uintFormat(caResults?.displayPrice)}
                          </h3>
                        </div>
                        <div>
                          <h3 className="text-white text-[10px]">
                            Holders: {Number(caResults?.holderCount)}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="border border-slate-500  text-white text-center">
                      No contracts found
                    </div>
                  )}
                </>
              ) : (
                <div className="overflow-auto h-[200px]">
                  {userResults !== null ? (
                    <div className="border border-slate-500 text-white text-center">
                      {userResults.map((item) => {
                        return (
                          <Link
                            to={`friend/${item?.address}`}
                            className="border border-slate-500 p-3 grid grid-cols-3 text-white"
                            key={item}
                            onClick={() => {
                              setInput("");
                              setActivateResults(false);
                            }}
                          >
                            <div>
                              <div className="flex justify-start gap-2">
                                <img
                                  src={item?.ftPfpUrl}
                                  alt=""
                                  className="w-5 h-5 rounded-full"
                                />
                                <h3 className="text-[10px]">{item?.ftName}</h3>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-[10px] text-white">
                                {uintFormat(item?.displayPrice)}
                              </h3>
                            </div>
                            <div>
                              <div className="flex justify-end">
                                <h3 className="text-white text-[10px]">
                                  Holders: {item?.holderCount}
                                </h3>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border border-slate-500 text-white text-center">
                      no users found
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="overflow-auto h-[200px]">
              {searchPools && matchingPools !== null ? (
                <>
                  <div className="border border-slate-500 text-white text-center">
                    {matchingPools.map((item) => {
                      return (
                        <Link
                          key={item}
                          to={`/pool/${item?.sudoSwapData?.erc1155Id}`}
                          className="border border-slate-500 p-3 grid grid-cols-3 text-white text-[10px]"
                          onClick={() => {
                            setInput("");
                            setActivateResults(false);
                          }}
                        >
                          <div className="flex justify-start gap-2">
                            <img
                              src={item?.friendTechData?.ftPfpUrl}
                              alt=""
                              className="w-5 h-5 rounded-full"
                            />
                            <h3 className="text-[10px]">
                              {item?.friendTechData?.ftName}
                            </h3>
                          </div>
                          <div className="flex justify-center text-white gap-1 text-[8px]">
                            <h3 className="mt-0.5">
                              LP:{" "}
                              {uintFormat(
                                item?.sudoSwapData?.spotPrice
                              ).toFixed(2)}
                            </h3>
                            <img
                              src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                              alt=""
                              className="w-4 h-4 rounded-full"
                            />
                          </div>
                          <div className="flex justify-end">
                            Pool Fee: %{" "}
                            {Number(
                              uintFormat(item?.sudoSwapData?.fee) * 100
                            ).toFixed(2)}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="border border-slate-500 text-white text-center">
                  no pools found
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
