// src/LightweightChart.js

import React, { useRef, useEffect, useState } from "react";
import { uintFormat } from "../formatters/format";
import { getEthPrice } from "../requests/priceCalls";
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
import _ from "lodash";
import { TbBoxMultiple } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
function SwapChart(props) {
  const { chartData, currentShare } = props;
  const [hoverPrice, setHoverPrice] = useState(null);
  const [newChartData, setNewChartData] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [shareVolume, setShareVolume] = useState(null);
  useEffect(() => {
    if (chartData !== null) {
      calculatePrice();
    }
  }, [chartData]);
  useEffect(() => {
    let totalVolume = 0;
    for (const key in newChartData) {
      const currentData = newChartData[key];
      console.log(currentData?.priceAtDate);
      console.log(Math.round(Number(currentData?.priceAtDate) * ethPrice));
      totalVolume += Math.round(Number(currentData?.priceAtDate) * ethPrice);
    }
    setShareVolume(totalVolume);
  }, [newChartData]);
  async function calculatePrice() {
    const ethPrice = await getEthPrice();
    setEthPrice(ethPrice);
    const currentPrice = uintFormat(currentShare?.displayPrice);
    console.log(currentPrice);
    console.log(chartData);
    for (const key in chartData) {
      const currentShare = chartData[key];
      const currentDate = currentShare?.date;
      const buyAmountEth = uintFormat(currentShare.ethAmount);
      const sharesBought = currentShare.shareAmount;
      console.log(buyAmountEth);
      console.log(sharesBought);
      console.log(currentDate);
      const convertedDate = new Date(currentDate);
      let month = convertedDate.toLocaleString("default", { month: "long" });
      let day = convertedDate.getDate();
      let year = convertedDate.getFullYear();
      let formattedDate = `${month} ${day}, ${year}`;
      console.log(formattedDate);
      chartData[key].fullDate = formattedDate;
      const calculatePriceAtTime = Number(buyAmountEth) / Number(sharesBought);
      console.log(calculatePriceAtTime);
      chartData[key].priceAtDate = calculatePriceAtTime;
    }
    console.log(chartData);
    const orderedData = _.orderBy(chartData, ["date"]);

    setNewChartData(orderedData);
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      setHoverPrice(Number(payload[0].value));
      // Customize tooltip content and style
      return null;
    } else {
      setHoverPrice(null);
    }
    return null;
  };

  return (
    <>
      <div
        className={`${newChartData ? `border border-transparent rounded-lg w-[390px] mx-auto mb-20 mt-2` : null}`}
      >
        {newChartData && newChartData !== null ? (
          <>
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
                        <div className="flex justify-center gap-1 text-[15px] text-white">
                          <IoIosInformationCircleOutline
                            color="gray"
                            className="mt-0.5"
                          />
                        </div>
                      </button>
                    </div>
                    <div>
                      <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                        <div className="flex justify-center gap-1 text-[15px] text-white">
                          <IoCubeOutline color="gray" className="mt-0.5" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="flex justify-start text-white font-bold text-[20px]">
                  {hoverPrice !== null
                    ? `${hoverPrice} Ξ`
                    : `${uintFormat(currentShare?.displayPrice).toFixed(4)} Ξ`}
                </div>
                <div className="flex justify-start text-stone-400 font-bold text-[10px]">
                  {new Date().toString().slice(0, 16)}
                </div>
              </div>
            </div>
            <div className="">
              <ResponsiveContainer width="94%" height={400}>
                <AreaChart
                  data={newChartData}
                  margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
                >
                  <defs>
                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={"#312e81"}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={"#312e81"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="fullDate"
                    tick={{ fontSize: 8, fill: "gray" }}
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
            {/* <div className="flex justify-start">
                <h3 className="text-white text-[8px]">Trade History</h3>
              </div> */}
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
                  {/* {//   tradedShareAddress: '0x7b202496c103da5bedfe17ac8080b49bd0a333f1',
//   traderShareAddress: '0x8a0ae997cea0c8c62cec961e8c283558e87040f5',
//   traderName: 'director.eth',
//   traderPfp:
//     'https://d3egfmvgqzu76k.cloudfront.net/pfp-images/0x8a0ae997cea0c8c62cec961e8c283558e87040f5/993883243zyk1guflr8?Expires=1817651141&Key-Pair-Id=K11ON08J8XW8N0&Signature=HxIyYv~Dl65mBMl4iYGDN0QOqLEezW0cCiTuiFR8AfH2A1YuJ4vFCDq-iIo5IN~rzaVPki8~zNDPa1BE9HflEFPyfBBrk27E27pQAXdWhzB9WFdfWzku~lK3F3tRkjqWPY8opozA0kIH1dWzzFkNrIFq8jl9vyo2tVKPS2~--eqhaBACyWjnNOSKT0GV~1pgHNsRX5iJlfid0xmWfWfBhmCnKc64XpirrZEJuIsvQsTB4Xtt81B5Zir66zWfc2Dng2wUK0MrIXiIoMzyfbSEXIKON6OcPmKmsiLJGmipxyw3~Dz3edKWCwo9kJsOWhTn16tVmGcifn2lIFjji8ufgA__',
//   isBuy: undefined,
//   shareAmount: '1',
//   ethAmount: '33062500000000000',
//   date: 1713861186332,
//   fullDate: 'April 23, 2024',
//   priceAtDate: 0.0330625
// } */}

                  {chartData.map((item) => {
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
              <div className="flex justify-start text-stone-300 font-bold text-[15px]">
                {currentShare?.ftName} Stats
              </div>
              <div className="flex justify-start gap-20 mt-1 p-2">
                <div className="grid grid-rows-1">
                  <div className="text-stone-400 font-bold text-[10px]">
                    Trade Volume
                  </div>
                  <div className="text-white font-bold text-[12px] ms-0.5">
                    ${shareVolume}
                  </div>
                </div>
                <div className="grid grid-rows-1">
                  <div className="text-stone-400 font-bold text-[10px]">
                    Current Price Ξ
                  </div>
                  <div className="text-white font-bold text-[10px] ms-0.5">
                    {uintFormat(currentShare?.displayPrice).toFixed(4)} Ξ /share
                  </div>
                </div>
              </div>

              <div className="mt-4 p-1 w-[390px] ">
                <div className="flex justify-start text-stone-300 font-bold text-[15px]">
                  Share Info
                </div>
                <div className="flex justify-start p-2">
                  <div className="grid grid-cols-3  gap-3">
                    <div>
                      <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                        <div className="flex justify-center gap-1 text-[10px] text-white">
                          <TbBoxMultiple color="gray" className="mt-0.5" />

                          <h3>
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

                          <h3>Share profile</h3>
                        </div>
                      </button>
                    </div>
                    <div>
                      <button className="text-[10px]  text-white border p-1 rounded-xl bg-stone-900 border-stone-800">
                        <div className="flex justify-center gap-1 text-[10px] text-white">
                          <IoCubeOutline color="gray" className="mt-0.5" />

                          <h3>BaseScan</h3>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
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
    </>
  );
}

export default SwapChart;

//
