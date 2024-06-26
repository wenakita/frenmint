import React, { useState, useEffect } from "react";
import { FaChartArea } from "react-icons/fa";
import { uintFormat } from "../../formatters/format";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import _ from "lodash";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoCubeOutline } from "react-icons/io5";
import { TbBoxMultiple } from "react-icons/tb";

function ChartButton(props) {
  const { currentPriceHistory, currentShare, shareTotalVolume } = props;
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
    <div>
      <button
        className=" text-white text-[12px] font-bold"
        onClick={() => document.getElementById("my_modal_12").showModal()}
      >
        <FaChartArea />
      </button>
      <dialog id="my_modal_12" className="modal">
        <div className="modal-box bg-stone-950 overflow-y-auto h-[500px] md:h-auto">
          <div className="flex gap-1">
            <img
              src={currentShare?.ftPfpUrl}
              alt=""
              className="size-5 rounded-full mt-1"
            />
            <Link
              to={`/friend/${currentShare?.address}`}
              className="font-bold text-lg hover:underline"
            >
              {currentShare?.ftName}
            </Link>
          </div>
          {currentPriceHistory ? (
            <div>
              <div className="p-2 mt-2">
                <div className="flex justify-start text-white font-bold text-[20px]">
                  {hoverPrice !== null
                    ? `${hoverPrice} Ξ`
                    : `${uintFormat(currentShare?.displayPrice)} Ξ`}
                </div>
                <div className="flex justify-start text-stone-400 font-bold text-[10px]">
                  {hoverDate ? hoverDate : new Date().toString().slice(0, 16)}
                </div>
              </div>
              <ResponsiveContainer height={300} className={"mx-auto"}>
                <AreaChart
                  data={currentPriceHistory}
                  margin={{
                    top: 10,
                    right: 30,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <defs>
                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
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
                  <XAxis dataKey="fullDate" className="text-[6px]" />

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
              <div className="overflow-x-auto overflow-y-auto h-[200px] mb-5">
                <table className="table bg-neutral-900   text-[8px]">
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
                        <tr key={item} className="text-[8px] text-white ">
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
                          <td className="whitespace-nowrap">
                            {item?.fullDate}
                          </td>
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
              <div className="border border-stone-900 w-full border-stone-600 p-5 rounded-lg">
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
                      {`${uintFormat(currentShare?.displayPrice)} Ξ`} Ξ /share
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
            <div className="flex justify-center mb-10 mt-[150px]">
              <img
                src="https://www.friend.tech/friendtechlogo.png"
                alt=""
                className="w-20 h-20 animate-bounce"
              />
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ChartButton;
