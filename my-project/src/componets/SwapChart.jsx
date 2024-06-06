// src/LightweightChart.js

import React, { useRef, useEffect, useState } from "react";
import { uintFormat } from "../formatters/format";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from "recharts";
import _ from "lodash";

function SwapChart(props) {
  const { chartData, currentShare } = props;
  const [newChartData, setNewChartData] = useState(null);
  useEffect(() => {
    if (chartData !== null) {
      calculatePrice();
    }
  }, [chartData]);
  function calculatePrice() {
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
      // Customize tooltip content and style
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#414040",
            padding: "5px",
          }}
        >
          <p className="label text-stone-300">{`${label} : ${payload[0].value} Ξ`}</p>
          {/* You can include additional data or styling here */}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div
        className={`${newChartData ? `border border-stone-600 rounded-lg w-[390px] mx-auto mb-20 mt-2` : null}`}
      >
        {newChartData && newChartData !== null ? (
          <>
            <div className="mb-5 p-2 mt-1">
              <div className="flex justify-start gap-2 p-2">
                <img
                  src={currentShare?.ftPfpUrl}
                  alt=""
                  className="w-[30px] h-[30px] rounded-full"
                />
                <h3 className="text-white text-[12px] font-bold mt-1">
                  {currentShare?.ftName}
                </h3>
              </div>

              <div className="p-2">
                <div className="flex justify-start mt-2  ms-1">
                  <h3 className="text-white font-mono font-bold text-[10px]">
                    friend.tech profile
                  </h3>
                  <img
                    src="https://freepngimg.com/thumb/twitter/108250-badge-twitter-verified-download-free-image-thumb.png"
                    alt=""
                    className="w-5 h-5"
                  />
                </div>
                <div className="">
                  <h3 className="text-white font-mono font-bold text-[9px] ms-1">
                    CA: {currentShare?.address}
                  </h3>
                </div>
                <div className="mt-1">
                  <h3 className="text-white font-mono font-bold text-[9px] ms-1">
                    Holders: {currentShare?.holderCount}
                  </h3>
                </div>
                <div className="mt-1">
                  <h3 className="text-white font-mono font-bold text-[9px] ms-1">
                    Current Price: {uintFormat(currentShare?.displayPrice)} Ξ /
                    share
                  </h3>
                </div>
              </div>
            </div>
            <div
              style={{ width: "700px", height: "400px" }}
              className="mx-auto"
            >
              <ResponsiveContainer width="55%" height="100%">
                <AreaChart data={newChartData}>
                  <XAxis
                    dataKey="fullDate"
                    tick={{ fontSize: 9, fill: "#cccccc" }}
                  />
                  <YAxis
                    dataKey={"priceAtDate"}
                    tick={{ fontSize: 7, fill: "#cccccc" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="priceAtDate"
                    stroke="#312e81"
                    fill="#312e81"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="border w-[390px] border-stone-600 p-1 overflow-y-auto h-[100px]">
              <div className="flex justify-start">
                <h3 className="text-white text-[8px]">Trade History</h3>
              </div>
              {chartData.map((item) => {
                return (
                  <div
                    key={item}
                    className="border border-slate-500 grid grid-cols-4 p-2 mt-1 rounded-lg"
                  >
                    <div className="flex justify-start">
                      <img
                        src={item?.traderPfp}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    </div>

                    <div>
                      <h3 className="text-white text-[12px]">
                        {item?.traderName}
                      </h3>
                    </div>
                    <div className="flex justify-center">
                      <h3
                        className={`${item?.isBuy ? `text-green-500 text-[10px]` : "text-red-500 text-[10px]"}`}
                      >
                        {item?.isBuy
                          ? `+${item?.shareAmount}`
                          : `-${item?.shareAmount}`}
                      </h3>
                    </div>
                    <div className="flex justify-end me-10">
                      <h3
                        className={`${item?.isBuy ? `text-green-500 text-[10px]` : "text-red-500 text-[10px]"}`}
                      >
                        {item?.isBuy
                          ? `+${uintFormat(Number(item?.ethAmount))}`
                          : `-${uintFormat(Number(item?.ethAmount))}`}
                      </h3>
                    </div>
                  </div>
                );
              })}
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
// {
//   tradedShareAddress: '0x7b202496c103da5bedfe17ac8080b49bd0a333f1',
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
// },

export default SwapChart;
