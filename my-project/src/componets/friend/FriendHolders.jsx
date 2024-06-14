import React, { useState } from "react";
import { uintFormat } from "../../formatters/format";
import { Link } from "react-router-dom";

function FriendHolders(props) {
  const [showAsCard, setShowAsCard] = useState(true);
  const { followers } = props;
  console.log(followers);
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
            {followers ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 overflow-y-auto h-[500px] w-screen ">
                {followers.map((item, index) => {
                  const currentPage = item?.page;
                  return (
                    <React.Fragment key={index}>
                      {currentPage.map((user) => (
                        <div
                          key={user.address}
                          className="card bg-stone-900 shadow-xl border border-stone-800 w-[80%] h-[220px] lg:h-[200px]  mx-auto"
                        >
                          <figure>
                            <img
                              src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmNfe9547vPVgd8qqdCFeH81yHos1n1CoQZu1D9n5Nrjvp?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
                              alt="Shoes"
                            />
                          </figure>
                          <div className="p-3">
                            <div className="flex justify-start gap-1 mb-4">
                              <img
                                src={user?.ftPfpUrl}
                                alt=""
                                className="rounded-full w-7 h-7"
                              />
                              <Link
                                to={`/friend/${user?.address}`}
                                className="text-white text-[12px] font-bold mt-1 hover:underline"
                              >
                                {user?.ftName}
                              </Link>
                            </div>
                            <div>
                              <h3 className="text-white text-[8px]">
                                Holds {user?.balance}{" "}
                                {Number(user?.balance) > 1 ? "shares" : "share"}
                              </h3>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-start gap-2 mt-1">
                                <button className="text-[10px] border p-1 w-full bg-blue-500 text-white border-stone-800 rounded-md hover:bg-blue-800">
                                  Mint
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : null}
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
                          className="bg-stone-900 shadow-xl border border-stone-800 p-2 hover:bg-stone-700"
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
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default FriendHolders;
