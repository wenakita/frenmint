import React, { useState } from "react";
import { uintFormat } from "../../formatters/format";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { FaEthereum } from "react-icons/fa6";
import { getSharePrice } from "../../requests/txRequests";
import { readContract } from "@wagmi/core";
import { config } from "../../config";
import FriendABI from "../../abi/FriendABI";
function FriendHolders(props) {
  const [showAsCard, setShowAsCard] = useState(true);
  const [checkedFollowers, setCheckedFollowers] = useState(null);
  const { followers } = props;
  if (followers) {
    urlCheck();
  }

  async function urlCheck() {
    const checkedData = [];

    for (const key in followers) {
      const currenPage = followers[key]?.page;
      for (const index in currenPage) {
        const currentUrl = currenPage[index]?.ftPfpUrl;
        const price = await getSharePrice(
          readContract,
          config,
          FriendABI,
          currenPage[index]?.address,
          "1"
        );
        currenPage[index].price = price;
        const res = await fetch(currentUrl);
        if (res.status === 200) {
          currenPage[index].isValid = true;
        } else {
          currenPage[index].isValid = false;
        }
      }
      checkedData.push({
        page: currenPage,
      });
    }
    setCheckedFollowers(checkedData);
  }
  return (
    <div className="mx-auto">
      <div className="flex justify-start p-3 gap-2 text-[12px] font-bold">
        <button
          onClick={() => {
            setShowAsCard(false);
          }}
        >
          List
        </button>
        <button
          onClick={() => {
            setShowAsCard(true);
          }}
        >
          Cards
        </button>
      </div>
      <div>
        {showAsCard ? (
          <div>
            {checkedFollowers ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 overflow-y-auto h-[500px] w-screen ">
                {checkedFollowers.map((item, index) => {
                  const current = item?.page;
                  return (
                    <React.Fragment key={index}>
                      {current.map((user) => (
                        <div
                          key={user.address}
                          className="card  shadow-lg  w-[90%] h-[200px] md:w-full shadow-xl  md:mt-0 bg-gradient-to-tr from-stone-950 to-neutral-950 border border-stone-900 md:h-[250px] lg:h-[200px]  mx-auto"
                        >
                          <figure className="p-3 rounded-lg">
                            <img
                              src={
                                user?.isValid
                                  ? user?.ftPfpUrl
                                  : "https://sudoswap.xyz/assets/img/emptyProfile.svg"
                              }
                              alt=""
                              className="rounded-lg"
                            />
                          </figure>
                          <div className="p-4">
                            <div className="flex justify-start gap-1 md:p-2">
                              <Link
                                to={`/friend/${user?.address}`}
                                className="text-white font-mono font-bold whitespace-nowrap text-[10px] md:text-[12px] overflow-hidden hover:underline hover:text-stone-700"
                              >
                                {user?.ftName}
                              </Link>
                              <MdVerified className="text-blue-500 size-3 md:size-4" />
                            </div>
                            <div>
                              <h3 className="text-white text-[8px] md:ms-2">
                                Holds {user?.balance}{" "}
                                {Number(user?.balance) > 1 ? "shares" : "share"}
                              </h3>
                            </div>
                            {/* <div className="flex justify-start mt-2 gap-1">
                              <FaEthereum className="mt-1 text-[11px]  md:text-[15px] md:text-[12px] mt-[5px] text-gray-500" />
                              <h3 className="text-[10px] md:text-[15px] mt-1 font-mono font-bold text-white">
                                {uintFormat(user?.price).toFixed(5)}
                              </h3>
                            </div> */}
                            {/* <div className="mt-3">
                              <div className="flex justify-start gap-2 mt-1">
                                <Link
                                  to={`/friend/${user?.address}`}
                                  className="text-[10px] text-center border p-1 w-full bg-blue-500 text-white border-stone-800 rounded-md hover:bg-blue-800"
                                >
                                  Mint
                                </Link>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center mt-56 mb-10">
                <img
                  src="https://www.friend.tech/friendtechlogo.png"
                  alt=""
                  className="w-20 h-20 animate-bounce"
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {followers ? (
              <div className=" overflow-y-auto h-[500px] w-screen">
                {followers.map((item, index) => {
                  const currentPage = item?.page;
                  return (
                    <div key={index} className="w-screen">
                      {currentPage.map((user) => (
                        <div
                          key={user.address}
                          className=" bg-gradient-to-tr from-stone-950 to-neutral-950 border border-stone-900 shadow-xl  p-2 hover:bg-stone-700"
                        >
                          <div className="flex justify-start gap-2">
                            <img
                              src={user?.ftPfpUrl}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <h3 className="text-[10px] mt-1">{user?.ftName}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center mt-56 mb-10">
                <img
                  src="https://www.friend.tech/friendtechlogo.png"
                  alt=""
                  className="w-20 h-20 animate-bounce"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FriendHolders;
