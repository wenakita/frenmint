import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  SearchByUser,
  SearchByContract,
  GetTrendingFriends,
} from "../requests/friendCalls";
function NavBar() {
  const [oooPrice, setOooPrice] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [trendingUsers, setTrendingUsers] = useState(null);
  const navigate = useNavigate();
  const { logout, authenticated, user, ready } = usePrivy();
  const wallet = user?.wallet;
  const address = wallet?.address;
  useEffect(() => {
    if ((!authenticated && !wallet) || (!authenticated && !ready)) {
      navigate("/");
    }
  }, [authenticated, wallet]);
  useEffect(() => {
    fetch(
      "https://api.dexscreener.com/latest/dex/pairs/base/0x25E2DAe20f0b251a4cCF5AC1ff04C9A24E7c0140"
    )
      .then(async function (results) {
        const response = await results.json();
        return response;
      })
      .then(function (data) {
        console.log(data);
        setOooPrice(data.pairs[0].priceUsd);
      })
      .catch(function (error) {
        console.log(error);
      });
    getTrending();
  });

  useEffect(() => {
    searchUser();
  }, [searchInput]);

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
    <div
      className={`mt-1 w-[440px] border border-stone-800 p-2 rounded-xl text-[8px] ${authenticated && wallet ? "flex justify-between" : null}`}
    >
      {(authenticated && wallet) || (ready && authenticated) ? (
        <>
          <Link
            to={
              "https://app.uniswap.org/swap?outputCurrency=0xDDf7d080C82b8048BAAe54e376a3406572429b4e&chain=base"
            }
            target="_blank"
            className="flex justify-center p-5 gap-2"
          >
            <img
              src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
              alt=""
              className="w-8 h-8"
            />
            {/* <h3 className="text-white mt-2 text-[10px]">{oooPrice}</h3> */}
          </Link>
          <button
            className="text-white text-center  p-5 font-bold "
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className=""
            >
              <path
                d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                fill="white"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <Link
            to="/home"
            className="text-white text-center p-5 mt-2 font-bold"
          >
            Home
          </Link>

          <Link
            to="/pools"
            className="text-white text-center p-5 mt-2 font-bold "
          >
            Pools
          </Link>

          {/* <Link
            to="/swap"
            className="text-white text-center p-5 mt-2 font-bold "
          >
            Swap
          </Link> */}
          <Link
            to={"/newswap"}
            className="text-white text-center p-5 mt-2 font-bold text-[8px]"
          >
            Swap
          </Link>

          <Menu>
            <MenuButton>
              <img
                src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                alt=""
                className="w-3 h-3 me-2"
              />
            </MenuButton>
            <MenuItems
              anchor="bottom"
              className={`border border-stone-800 rounded-lg p-2 bg-black grid grid-flow-row hover:${console.log("hoveed")}`}
            >
              <MenuItem className="text-white text-center p-1 mt-1 font-bold text-[8px]">
                {/* <Link
                  to={"/balances"}
                  className="text-white text-center p-1 mt-2 font-bold"
                >
                  Balance
                </Link> */}
                <Link
                  to="/new"
                  className="text-white text-center mt-2 font-bold"
                >
                  Wallet
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to={"/my-pools"}
                  className="text-white text-center p-1 mt-2 font-bold text-[8px]"
                >
                  My Pools
                </Link>
              </MenuItem>

              <MenuItem>
                <Link
                  to={"/icnu"}
                  className="text-white text-center p-1 mt-2 font-bold text-[8px]"
                >
                  Incubator
                </Link>
              </MenuItem>
            </MenuItems>
          </Menu>

          <div className="grid grid-flow-row me-3">
            <button
              className="text-white p-2 h-[30px]  mt-[19.5px] border border-stone-700 rounded-xl"
              onClick={logout}
            >
              <div>Logout</div>
            </button>
            <div className="text-white text-center">
              {address.slice(0, 3) +
                "..." +
                address.slice(address.length - 3, address.length)}
            </div>
          </div>

          {/* Open the modal using document.getElementById('ID').showModal() method */}

          <dialog id="my_modal_3" className="modal">
            <div className="modal-box bg-stone-900">
              <h3 className="font-bold text-lg">Search users</h3>
              <div>
                <input
                  type="text"
                  className="w-full rounded-lg p-1"
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                />
              </div>
              <div className="overflow-y-auto h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
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
                          <div className="flex justify-end">
                            {slicedContract}
                          </div>
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
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      ) : null}
    </div>
  );
}

export default NavBar;
