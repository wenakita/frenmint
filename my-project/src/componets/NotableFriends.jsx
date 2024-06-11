import { useState } from "react";
import { Link } from "react-router-dom";
import { uintFormat } from "../formatters/format";
function NotableFriends(props) {
  const { data } = props;
  console.log(data);
  return (
    <div>
      {data ? (
        <>
          <h3 className="text-center text-white font-mono font-bold mt-5 text-[20px]">
            Notable Mention
          </h3>
          <div className="mt-5">
            <div className="card w-[250px] bg-stone-900 shadow-xl border border-stone-800">
              <figure>
                <img
                  src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmNfe9547vPVgd8qqdCFeH81yHos1n1CoQZu1D9n5Nrjvp?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
                  alt="Shoes"
                />
              </figure>
              <div className="p-3">
                <div className="flex justify-start gap-2 mb-2">
                  <img
                    src={data?.ftPfpUrl}
                    alt=""
                    className="rounded-full w-7 h-7"
                  />
                  <Link
                    to={`/friend/${data?.address}`}
                    className="text-white text-[12px] font-bold mt-1 hover:underline"
                  >
                    {data?.ftName}
                  </Link>
                </div>
                <div className="mt-1 p-1 flex justify-between font-bold whitepace-nowrap">
                  <div className="grid grid-rows-1 text-[8px] md:text-[14px]  whitepace-nowrap">
                    <div className="">
                      <h3 className="text-stone-400 ">Holders</h3>
                    </div>
                    <div className="">
                      <h3 className="text-white ">{data?.holderCount}</h3>
                    </div>
                  </div>
                  <div className="grid grid-rows-1 text-[8px] md:text-[14px] whitepace-nowrap">
                    <div>
                      <h3 className="text-stone-400 ">Price</h3>
                    </div>
                    <div>
                      <h3 className="text-white  ">
                        {uintFormat(data?.displayPrice).toFixed(2)} Ξ
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-rows-1 text-[8px] md:text-[14px] ">
                    <div>
                      <h3 className="text-stone-400  ">Supply</h3>
                    </div>
                    <div>
                      <h3 className="text-white  whitepace-nowrap">10</h3>
                    </div>
                  </div>
                </div>

                <div className=" mt-3">
                  <div className="mt-2 flex">
                    <Link
                      to={`/friend/${data?.address}`}
                      className="text-[10px] border w-full p-1 bg-blue-500 text-white border-stone-800 rounded-md hover:bg-blue-800"
                    >
                      <h3 className="text-center">Mint Share</h3>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default NotableFriends;
