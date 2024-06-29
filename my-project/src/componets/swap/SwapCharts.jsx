import React, { useRef, useEffect, useState } from "react";
import { getEthPrice } from "../../requests/priceCalls";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from "recharts";
import { IoCubeOutline } from "react-icons/io5";
import { TbBoxMultiple } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import _ from "lodash";
import { BarChart, Bar, Rectangle, Legend } from "recharts";
import { uintFormat } from "../../formatters/format";

function SwapCharts(props) {
  const {
    currentPriceHistory,
    currentShare,
    currentSharePrice,
    shareTotalVolume,
  } = props;

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

  return (
    <div className="mb-20">
      {currentPriceHistory ? (
        <div className="  w-[400px] mx-auto">
          <div className="mb-5 p-2 mt-1">
            <div className="grid grid-cols-2">
              <div className="grid grid-rows-2">
                <div className="indicator">
                  {/* <span className="indicator-item indicator-bottom badge rounded-sm mb-5 me-4 w-5">
                   <img
                     src="https://www.friend.tech/friendtechlogo.png"
                     alt=""
                     className="grid w-[] h-32 bg-base-300 place-items-center"
                   />
                 </span> */}

                  <div className="flex justify-start gap-2 p-3">
                    <img
                      src={currentShare?.ftPfpUrl}
                      alt=""
                      className="w-[30px] h-[30px] rounded-full"
                    />
                  </div>
                </div>
                <div className=" ms-3">
                  <h3 className="text-white text-[12px] font-light ">
                    {currentShare?.ftName}
                  </h3>
                </div>
              </div>
              <div className=" my-auto  flex justify- ms-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="">
                    <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                      <div className="flex justify-center  text-[15px] text-white">
                        <TbBoxMultiple color="gray" className="mt-0.5" />
                      </div>
                    </button>
                  </div>
                  <div>
                    <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                      <Link
                        to={`/friend/${currentShare?.address}`}
                        className="flex justify-center gap-1 text-[15px] text-white hover:text-stone-400"
                      >
                        <IoIosInformationCircleOutline
                          color="gray"
                          className="mt-0.5"
                        />
                      </Link>
                    </button>
                  </div>
                  <div>
                    <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                      <Link
                        to={`https://basescan.org/address/${currentShare?.address}`}
                        target="_blank"
                        className="flex justify-center gap-1 text-[15px] text-white"
                      >
                        <IoCubeOutline color="gray" className="mt-0.5" />
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="flex justify-start text-white font-bold text-[20px]">
                {hoverPrice !== null
                  ? `${hoverPrice} Ξ`
                  : `${currentSharePrice} Ξ`}
              </div>
              <div className="flex justify-start text-stone-400 font-bold text-[10px]">
                {hoverDate ? hoverDate : new Date().toString().slice(0, 16)}
              </div>
            </div>
          </div>
          <div>
            <ResponsiveContainer width={400} height={400} className={"mx-auto"}>
              <AreaChart
                data={currentPriceHistory}
                margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
              >
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={"#312e81"} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={"#312e81"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="fullDate"
                  tick={{ fontSize: 5, fill: "gray" }}
                  className="font-bold"
                />

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
                  strokeWidth={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto overflow-y-auto h-[200px] mb-5">
            <table className="table table-zebra-zebra  text-[8px]">
              <thead className="text-[8px] ">
                <tr>
                  <th>Trader</th>

                  <th>Time</th>
                  <th>Type</th>
                  <th>ETH</th>

                  <th>Price</th>
                </tr>
              </thead>
              <tbody className="">
                {currentPriceHistory.map((item) => {
                  return (
                    <tr key={item} className="text-[8px] text-white">
                      <td>
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
                      </td>
                      <td className="whitespace-nowrap">{item?.fullDate}</td>
                      <td
                        className={`${item?.isBuy ? "text-green-500" : "text-red-500"}`}
                      >
                        {item?.isBuy ? "Buy" : "Sell"}
                      </td>
                      <td className="whitespace-nowrap">
                        {uintFormat(item?.ethAmount)} Ξ
                      </td>

                      <td>{item?.priceAtDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border border-stone-900 w-[390px] border-stone-600 p-5 rounded-lg">
            <div className="flex justify-start text-stone-300 font-bold text-[15px] gap-1">
              <img
                src={currentShare?.ftPfpUrl}
                alt=""
                className="w-5 h-5 rounded-full mt-0.5"
              />
              <h3>{currentShare?.ftName} </h3>
            </div>
            <div className="flex justify-start gap-20 mt-1 p-2">
              <div className="grid grid-rows-1">
                <div className="text-stone-400 font-bold text-[10px]">
                  Trade Volume
                </div>
                <div className="text-white font-bold text-[12px] ms-0.5">
                  ${shareTotalVolume}
                </div>
              </div>
              <div className="grid grid-rows-1">
                <div className="text-stone-400 font-bold text-[10px]">
                  Current Price Ξ
                </div>
                <div className="text-white font-bold text-[10px] ms-0.5">
                  {currentSharePrice} Ξ /share
                </div>
              </div>
            </div>

            <div className="mt-4 p-1 w-[390px] ">
              <div className="flex justify-start text-stone-300 font-bold text-[13px] ms-2">
                Share Info
              </div>
              <div className="flex justify-start p-2">
                <div className="grid grid-cols-3  gap-3">
                  <div>
                    <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                      <div className="flex justify-center gap-1 text-[10px] text-white">
                        <TbBoxMultiple color="gray" className="mt-0.5" />

                        <h3 className="hover:text-stone-400">
                          {currentShare?.address.slice(0, 4)}...
                          {currentShare?.address?.slice(
                            currentShare?.address.length - 4,
                            currentShare?.address.length
                          )}
                        </h3>
                      </div>
                    </button>
                  </div>
                  <div>
                    <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                      <div className="flex justify-center gap-1 text-[10px] text-white">
                        <IoIosInformationCircleOutline
                          color="gray"
                          className="mt-0.5"
                        />

                        <Link
                          to={`/friend/${currentShare?.address}`}
                          className="hover:text-stone-400"
                        >
                          Share profile
                        </Link>
                      </div>
                    </button>
                  </div>
                  <div>
                    <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                      <div className="flex justify-center gap-1 text-[10px] text-white">
                        <IoCubeOutline color="gray" className="mt-0.5" />

                        <Link
                          to={`https://basescan.org/address/${currentShare?.address}`}
                          target="_blank"
                          className="hover:text-stone-400"
                        >
                          BaseScan
                        </Link>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-20 mb-10">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      )}
    </div>
  );
}

export default SwapCharts;
