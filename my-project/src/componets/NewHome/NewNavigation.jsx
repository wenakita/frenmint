import React, { useEffect, useState } from "react";
import { CiWallet } from "react-icons/ci";
import { MdOutlineCompareArrows } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { GetTrendingFriends, SearchByUser } from "../../requests/friendCalls";
function NewNavigation() {
  const navigate = useNavigate();
  const { logout, authenticated, user, ready } = usePrivy();
  const [searchInput, setSearchInput] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [trendingUsers, setTrendingUsers] = useState(null);
  const wallet = user?.wallet;
  useEffect(() => {
    if ((!authenticated && !wallet) || (!authenticated && !ready)) {
      navigate("/");
    }
  }, [authenticated, wallet]);
  useEffect(() => {
    searchUser();
  }, [searchInput]);

  useEffect(() => {
    getTrending();
  }, []);

  async function getTrending() {
    const trending = await GetTrendingFriends();
    setTrendingUsers(trending);
  }

  async function searchUser() {
    const result = await SearchByUser(searchInput);
    console.log(result);
    setSearchResults(result);
  }
  return (
    <>
      <div className="navbar bg-neutral-950 md:w-screen w-screen border border-neutral-900">
        <div className="navbar-start">
          <div className="dropdown ">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral-900 rounded-box w-52 font-bold"
            >
              <li className="">
                <Link to={"/analytics"}>Analytics</Link>
              </li>
              <li className="">
                <Link
                  to={"https://telegra.ph/GODDOG-Official-Whitepaper-06-01"}
                  target="_blank"
                >
                  Whitepaper
                </Link>
              </li>
              {/* <li className="">
                <Link to={"/my-pools"}>my pool</Link>
              </li> */}
              <li>
                <Link
                  to={"https://telegra.ph/What-is-FrenMint-06-03"}
                  target="_blank"
                >
                  Frenmint docs
                </Link>
              </li>
              {/* <li>
                <Link to={"/my-pools"}>Manage Pools</Link>
              </li> */}

              <li>
                <Link
                  to={
                    "https://interchain.axelar.dev/base/0xDDf7d080C82b8048BAAe54e376a3406572429b4e"
                  }
                  target="_blank"
                >
                  Interchain
                </Link>
              </li>
              <li>
                <Link
                  to={
                    "https://dexscreener.com/base/0x25e2dae20f0b251a4ccf5ac1ff04c9a24e7c0140"
                  }
                  target="_blank"
                >
                  Chart
                </Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
          <Link to={"/"}>
            <img
              src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
              alt=""
              className="size-6 rounded-full"
            />
          </Link>
        </div>

        <div className="navbar-end">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="btn btn-ghost btn-circle">
            <Link to={"/new"} className="btn btn-ghost btn-circle">
              <CiWallet className="text-[20px]" />
            </Link>
          </button>
          <button className="btn btn-ghost btn-circle">
            <Link to={"/newswap"} className="btn btn-ghost btn-circle">
              <FaArrowsRotate className="text-[15px]" />
            </Link>
          </button>
        </div>
      </div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-stone-900 h-[350px]">
          <h3 className="font-bold text-sm">Find shares</h3>
          <div className="relative mb-3 mt-2">
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
          <div className="mb-3 mt-3 flex gap-3">
            {trendingUsers?.map((item, index) => {
              if (index < 4) {
                return (
                  <Link
                    to={`/friend/${item?.address}`}
                    key={item}
                    className="border rounded-full bg-stone-950 border-stone-900 hover:bg-stone-800"
                    onClick={() => {
                      document.getElementById("my_modal_3").close();
                    }}
                  >
                    <div className="flex justify-start text-[8px] p-1.5 gap-1.5 whitespace-nowrap">
                      <img
                        src={item?.ftPfpUrl}
                        alt=""
                        className="size-4 rounded-full"
                      />
                      <h3 className="mt-0.5 text-[8px]">{item?.ftName}</h3>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
          <div className="overflow-y-auto h-[270px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
            {searchResults ? (
              <>
                {searchResults.map((item) => {
                  const slicedContract = `${item?.address.slice(0, 4)}...${item?.address.slice(item?.address.length - 4, item?.address.length)}`;
                  return (
                    <Link
                      to={`/friend/${item?.address}`}
                      key={item}
                      className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                      onClick={() => {
                        document.getElementById("my_modal_3").close();
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
                    </Link>
                  );
                })}
              </>
            ) : (
              <>
                {trendingUsers ? (
                  <>
                    {trendingUsers.map((item) => {
                      const slicedContract = `${item?.address.slice(0, 4)}...${item?.address.slice(item?.address.length - 4, item?.address.length)}`;
                      return (
                        <Link
                          to={`/friend/${item?.address}`}
                          key={item}
                          className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                          onClick={() =>
                            document.getElementById("my_modal_3").close()
                          }
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
                        </Link>
                      );
                    })}
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default NewNavigation;
