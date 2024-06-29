import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SearchByContract } from "../../requests/friendCalls";
import { MdVerified } from "react-icons/md";
import { uintFormat } from "../../requests/friendCalls";
import { FaChartArea, FaEthereum } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { GrContactInfo } from "react-icons/gr";
import { Collapse, theme } from "antd";
import { GoLinkExternal } from "react-icons/go";
import { getShareChartData } from "../../requests/friendCalls";
import _ from "lodash";

import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from "recharts";
import {
  CaretRightOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { getEthPrice } from "../../requests/priceCalls";
import { useNavigate } from "react-router-dom";
import "../../App.css";
function NewFriend() {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [userData, setUserData] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txData, setTxData] = useState(null);
  const { address } = useParams();

  useEffect(() => {
    setLoading(true);
    fetchUser();
  }, [address]);

  async function fetchUser() {
    const ethUSD = await getEthPrice();
    setEthPrice(ethUSD);
    const res = await SearchByContract(address);
    const txs = await getShareChartData(address);
    const orderedPriceHistory = _.orderBy(txs, ["date"]);

    setTxData(orderedPriceHistory);
    setUserData(res);
    setLoading(false);
  }

  const items = [
    {
      key: "1",
      label: (
        <div className="flex gap-1 text-gray-200 font-semibold ">
          <GrContactInfo className="text-[15px] mt-1" />
          <h3 className="text-[12px] mt-0.5"> Share Details</h3>
        </div>
      ),
      children: (
        <div className="text-gray-400 text-[10px] ">
          <div className="grid grid-rows-2 ">
            <div className="space-y-0.5">
              <div className="flex justify-between ">
                <h3> Name</h3>
                <h3 className="text-gray-200">{userData?.ftName}</h3>
              </div>

              <div className="flex justify-between">
                <h3> Creator</h3>
                <span className="flex gap-1">
                  <GoLinkExternal className="mt-[2px] text-gray-200" />
                  <h3 className="text-gray-200">
                    {userData?.twitterUsername
                      ? userData?.twitterUsername
                      : "Unknown"}
                  </h3>
                </span>
              </div>
              <div className="flex justify-between">
                <h3>Followers</h3>
                <h3 className="text-gray-200">{userData?.followerCount}</h3>
              </div>
              <div className="flex justify-between">
                <h3>Holders</h3>
                <h3 className="text-gray-200">{userData?.holderCount}</h3>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex gap-1 text-gray-200 font-semibold">
          <GrContactInfo className="text-[15px] mt-1" />
          <h3 className="text-[12px] mt-0.5"> Activity</h3>
        </div>
      ),
      children: (
        <div className="overflow-y-auto h-[130px]">
          {txData ? (
            <>
              {txData.map((item) => {
                return (
                  <div
                    key={item}
                    className="w-full text-[8px] text-white border border-stone-800 bg-neutral-900 grid grid-cols-5 p-2"
                  >
                    <div>
                      <Link
                        to={`/friend/${item?.traderShareAddress}`}
                        className="flex"
                      >
                        <img
                          src={item?.traderPfp}
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                      </Link>
                    </div>

                    <div className="whitespace-nowrap">{item?.fullDate}</div>
                    <div
                      className={`${item?.isBuy ? "text-green-500" : "text-red-500"} text-center`}
                    >
                      <h3
                        className={`border w-[40px] ms-5 rounded-full ${item?.isBuy ? `border-green-500` : `border-red-500`}`}
                      >
                        {item?.isBuy ? "Buy" : "Sell"}
                      </h3>
                    </div>
                    <div className="whitespace-nowrap flex justify-center">
                      {uintFormat(item?.ethAmount).toFixed(4)} Ξ
                    </div>

                    <div className="flex justify-end">
                      {item?.priceAtDate.toFixed(4)}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex justify-center mt-10 mb-10">
              <img
                src="https://www.friend.tech/friendtechlogo.png"
                alt=""
                className="w-20 h-20 animate-bounce"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="flex gap-1  text-gray-200 font-semibold">
          <GrContactInfo className="text-[15px] mt-1" />
          <h3 className="text-[12px] mt-0.5"> Token Details</h3>
        </div>
      ),
      children: (
        <div className="text-gray-400 text-[10px]">
          <div className="grid grid-rows-2">
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <h3>Token Standard</h3>
                <h3 className="text-gray-200"> ERC-1155</h3>
              </div>

              <div className="flex justify-between">
                <h3>Token Contract</h3>
                <Link
                  to={`https://basescan.org/address/${userData?.address}`}
                  target="_blank"
                  className="flex gap-1 text-gray-200"
                >
                  <GoLinkExternal className="mt-1" />
                  <h3>
                    {userData?.address.slice(0, 2) +
                      "..." +
                      userData?.address.slice(
                        userData?.address?.length - 4,
                        userData?.address.length
                      )}
                  </h3>
                </Link>
              </div>
              <div className="flex justify-between">
                <h3>Holders</h3>
                <h3 className="text-gray-200">{userData?.holderCount}</h3>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      ),
    },
  ];
  const onChange = (key) => {};
  const customExpandIcon = ({ isActive }) =>
    isActive ? (
      <UpOutlined
        style={{
          color: "gray",
          transition: "transform 0.2s",
          transform: isActive ? "rotate(90deg)" : "",
        }}
      />
    ) : (
      <DownOutlined
        style={{
          color: "gray",
          transition: "transform 0.2s",
          transform: isActive ? "rotate(90deg)" : "",
        }}
      />
    );
  const [hoverPrice, setHoverPrice] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      setHoverDate(label);
      setHoverPrice(Number(payload[0].value));
      // Customize tooltip content and style
      return null;
    } else {
      setHoverPrice(null);
    }
    return null;
  };

  const [currentVW, setCurrentVW] = useState(null);
  useEffect(() => {}, [currentVW]);

  return (
    <div className={` mb-10`}>
      {loading ? (
        <div className="flex justify-center mt-56 mb-10">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <>
          {userData ? (
            <div className="w-screen grid grid-cols-1 md:grid-cols-2 p-6">
              <div className="grid grid-flow-row md:hidden mb-2 p-2">
                <div className=" ">
                  <div className="gap-1 flex justify-start text-white font-bold text-[11px]">
                    {userData?.ftName}
                    <MdVerified className="text-blue-500 size-4" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-start  text-[11px] font-light">
                    <h3 className="text-gray-400 font-light text-[10px] mt-[0.8px]">
                      Share Price
                    </h3>
                    <span className="ms-0.5 flex">
                      <FaEthereum className="mt-1 text-gray-500 text-[10px]" />
                      <h3 className="text-[10px] mt-[1px]">
                        {uintFormat(userData?.displayPrice).toFixed(3)}
                      </h3>
                    </span>
                  </div>
                </div>
                <div className="flex justify-start mt-2 gap-2">
                  <button className="border border-stone-800 border-[1.3px] flex justify-center gap-1 text-[10px] p-0.5 rounded-xl w-[70px]">
                    <IoIosHeart className="text-red-300 mt-[2.3px]" />
                    <h3>{userData?.followerCount}</h3>
                  </button>

                  <div className="border border-stone-800 border-[1.3px] flex justify-center gap-1 text-[10px] p-0.5 rounded-xl w-[70px]">
                    <FaUserFriends className="text-gray-400 mt-[2.3px]" />
                    <h3>{userData?.holderCount}</h3>
                  </div>
                  <button
                    className="border border-stone-800 border-[1.3px] flex justify-center gap-1 text-[10px] p-0.5 rounded-xl w-[70px]"
                    onClick={() =>
                      document.getElementById("my_modal_12").showModal()
                    }
                  >
                    <FaChartArea className=" mt-[3px]" />

                    <h3 className="text-[10px] font-semibold">Chart</h3>
                  </button>
                </div>
              </div>
              <div className=" w-full p-2 md:p-0 md:mt-0 ">
                <img
                  src={userData?.ftPfpUrl}
                  alt=""
                  className="ms-auto me-auto w-[80%] md:w-[300px] lg:w-[380px] border border-transparent rounded-lg"
                />
                <div className="hidden md:block mt-3 w-full md:w-[380px] lg:w-[420px] ms-auto me-auto text-[10px] bg-stone-950 border border-neutral-800 rounded-lg">
                  <Collapse
                    bordered={false}
                    ghost={true}
                    items={items}
                    onChange={onChange}
                    className="border border-stone-500 "
                    expandIconPosition="end"
                    expandIcon={customExpandIcon}
                    style={{
                      borderColor: token.colorInfoBorderHover,
                    }}
                  />
                </div>
              </div>
              <div className="p-2 ">
                <div className="hidden md:block  p-4">
                  <div className="flex font-bold gap-1">
                    <img
                      src="https://nft-media.defined.fi/contract/image/d90167bb7bd067e39f2d3fdaaf1220c3.png"
                      alt=""
                      className=" size-5"
                    />
                    <h3 className="text-white text-[12px] mt-0.5">
                      Friend.tech share
                    </h3>
                    <MdVerified className="text-blue-500 size-4.5 mt-0.5" />
                  </div>
                  <div className="mt-2 text-[17px]">
                    <div className="flex gap-1">
                      <h3 className="text-white font-bold ">
                        {userData?.ftName}
                      </h3>
                      <h3 className="text-white font-bold">#{userData?.id}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <div className="indicator">
                          <span className="indicator-item indicator-bottom">
                            <MdVerified className="text-blue-600 size-3 mb-3" />
                          </span>
                          <img
                            src={userData?.twitterPfpUrl}
                            alt=""
                            className="size-8 rounded-full"
                          />
                        </div>
                        {userData?.twitterUsername ? (
                          <div className="grid grid-rows-1 text-[12px]">
                            <div className="font-bold">Creator</div>
                            <div className="text-white font-bold">
                              {userData?.twitterUsername}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex gap-2 me-7">
                        <div className="border border-transparent rounded-full bg-gradient-to-r from-pink-500 to-rose-500 p-4 h-3"></div>
                        <div className="grid grid-rows-1 text-[12px]">
                          <div className="font-bold">Contract</div>
                          <div className="text-white font-bold">
                            {userData?.address.slice(0, 2) +
                              "..." +
                              userData?.address.slice(
                                userData?.address?.length - 4,
                                userData?.address.length
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-start gap-3">
                      <div className="flex text-[14px] gap-1 mt-1 border border-stone-800 rounded-full w-[70px] place-content-center">
                        <IoIosHeart className="text-red-300 mt-[2.3px]" />

                        <h3 className="text-[12px] font-semibold">
                          {userData?.followerCount}
                        </h3>
                      </div>
                      <div className="flex text-[14px] gap-1 mt-1  border border-stone-800 rounded-full w-[70px] place-content-center">
                        <FaUserFriends className=" mt-[2.3px]" />

                        <h3 className="text-[12px] font-semibold">
                          {userData?.holderCount}
                        </h3>
                      </div>
                      <button
                        className="flex text-[10px] gap-1 mt-1  border border-stone-800 rounded-full w-[70px] place-content-center"
                        onClick={() =>
                          document.getElementById("my_modal_12").showModal()
                        }
                      >
                        <FaChartArea className=" mt-[4px]" />

                        <h3 className="text-[12px] font-semibold">Chart</h3>
                      </button>
                    </div>
                  </div>
                  <div className="mt-10 border border-transparent bg-neutral-900 rounded-lg p-3">
                    <div className="border border-transparent rounded-lg bg-neutral-900 p-2">
                      <div className="text-[12px] font-semibold">
                        <h3>Price</h3>
                        <div className="flex gap-1">
                          <div className="flex">
                            <FaEthereum className="mt-1 text-[18px] text-gray-500" />
                            <h3 className="text-gray-200 font-bold mt-[3px] text-[14px]">
                              {uintFormat(userData?.displayPrice).toFixed(3)}
                            </h3>
                          </div>
                          <h3 className="text-[8px] mt-[9px] ms-0.5">
                            {"($" +
                              Number(
                                uintFormat(userData?.displayPrice) * ethPrice
                              ).toFixed(2) +
                              ")"}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-2">
                        <button className="text-[12px] border w-full bg-white hover:bg-stone-400 text-black font-bold rounded-lg border-stone-700 h-[30px]">
                          Mint
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:hidden border border-stone-800 bg-gradient-to-r from-stone-950 to-neutral-900 rounded-lg p-3 w-full md:w-[370px] lg:w-[500px] ms-auto me-auto">
                  <div className="flex gap-1">
                    <img
                      src={userData?.ftPfpUrl}
                      alt=""
                      className="size-4 rounded-full"
                    />
                    <h3 className="text-stone-500 font-semibold mt-0.5 text-[10px]">
                      Price
                    </h3>
                  </div>
                  <div className="flex justify-start gap-0.5 mt-1">
                    <FaEthereum className="mt-1 text-[18px] text-gray-500" />
                    <h3 className="text-gray-200 font-bold mt-[3px] text-[14px]">
                      {uintFormat(userData?.displayPrice).toFixed(3)}
                    </h3>
                    <h3 className="text-[8px] mt-[9px] ms-0.5">
                      {"($" +
                        Number(
                          uintFormat(userData?.displayPrice) * ethPrice
                        ).toFixed(2) +
                        ")"}
                    </h3>
                  </div>
                  <div className="mt-3">
                    <button
                      className="text-[12px] border w-full bg-white hover:bg-stone-400 text-black font-bold rounded-lg border-stone-700 h-[30px]"
                      onClick={() => {
                        navigate("/newswap", {
                          state: {
                            userData,
                          },
                        });
                      }}
                    >
                      Mint
                    </button>
                  </div>
                </div>
              </div>

              <div className=" mt-3 md:hidden">
                <div className="w-full md:w-[380px] lg:w-[420px] ms-auto me-auto text-[10px] bg-stone-950 border border-neutral-800 rounded-lg">
                  <Collapse
                    bordered={false}
                    ghost={true}
                    items={items}
                    onChange={onChange}
                    className="border border-stone-500 "
                    expandIconPosition="end"
                    expandIcon={customExpandIcon}
                    style={{
                      borderColor: token.colorInfoBorderHover,
                    }}
                  />
                </div>
              </div>
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
      <dialog id="my_modal_12" className="modal">
        <div className="modal-box bg-stone-950">
          <div className="flex gap-1">
            <img
              src={userData?.ftPfpUrl}
              alt=""
              className="size-5 rounded-full mt-1"
            />
            <h3 className="font-bold text-lg">{userData?.ftName}</h3>
          </div>
          <div>
            <div className="p-2 mt-2">
              <div className="flex justify-start text-white font-bold text-[20px]">
                {hoverPrice !== null
                  ? `${hoverPrice} Ξ`
                  : `${uintFormat(userData?.displayPrice)} Ξ`}
              </div>
              <div className="flex justify-start text-stone-400 font-bold text-[10px]">
                {hoverDate ? hoverDate : new Date().toString().slice(0, 16)}
              </div>
            </div>
            <ResponsiveContainer height={300} className={"mx-auto"}>
              <AreaChart
                data={txData}
                margin={{
                  top: 10,
                  right: 30,
                  bottom: 20,
                  left: 20,
                }}
              >
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={"#32e81"} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={"#312e81"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="fullDate" className="text-[8px]" />

                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{ backgroundColor: "#111827" }}
                />
                <Area
                  type="monotone"
                  dataKey="priceAtDate"
                  stroke="#312e81"
                  fill="url(#chartColor)"
                  fillOpacity={1}
                  strokeWidth={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default NewFriend;

{
  /* <div className="p-2 mt-2">
                      <div className="flex justify-start text-white font-bold text-[20px]">
                        {hoverPrice !== null
                          ? `${hoverPrice} Ξ`
                          : `${uintFormat(userData?.displayPrice)} Ξ`}
                      </div>
                      <div className="flex justify-start text-stone-400 font-bold text-[10px]">
                        {hoverDate
                          ? hoverDate
                          : new Date().toString().slice(0, 16)}
                      </div>
                    </div> */
}

{
  /* <ResponsiveContainer height={300} className={"mx-auto"}>
                      <AreaChart
                        data={txData}
                        margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
                      >
                        <defs>
                          <linearGradient
                            id="chartColor"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={"#32e81"}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={"#312e81"}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="fullDate" tick={false} />

                        <Tooltip
                          content={<CustomTooltip />}
                          contentStyle={{ backgroundColor: "#111827" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="priceAtDate"
                          stroke="#312e81"
                          fill="url(#chartColor)"
                          fillOpacity={1}
                          strokeWidth={1}
                        />
                      </AreaChart>
                    </ResponsiveContainer> */
}
