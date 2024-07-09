import React, { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import "../../App.css";
import {
  getPoolTxs,
  getTransactionData,
  getVolume,
} from "../../requests/supaBaseHandler";

import { useWallets } from "@privy-io/react-auth";
import { getExistingPools } from "../../requests/SudoSwapRequests";
import PoolsTable from "./PoolsTable";
import TransactionsTable from "./TransactionsTable";
import { getEthPrice } from "../../requests/priceCalls";
function TransactionCharts() {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const [pools, setPools] = useState(null);
  const [txs, setTxs] = useState(null);

  const [showPools, setShowPools] = useState(true);
  const [showTxs, setShowTxs] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [stats, setStats] = useState(null);
  useEffect(() => {
    console.log(w0);
    getData();
  }, []);

  async function getData() {
    const res = await getExistingPools(w0?.address);
    await getTxs();

    console.log(res);
    setPools(res);
  }
  async function getTxs() {
    const stat = await getVolume();
    setStats(stat);
    const res = await getEthPrice();
    const txData = await getPoolTxs();

    setTxs(txData);
    setEthPrice(Number(res));
  }
  const data = [
    {
      date: "Page G",
      uv: 800,
    },
    {
      date: "Page G",
      uv: 540,
    },
    {
      date: "Page G",
      uv: 300,
    },
    {
      date: "Page G",
      uv: 400,
    },
    {
      date: "Page G",
      uv: 900,
    },
    {
      date: "Page G",
      uv: 700,
    },
    {
      date: "Page G",
      uv: 800,
    },
    {
      date: "Page G",
      uv: 500,
    },
  ];
  const data2 = [
    {
      date: "Page G",
      uv: 300,
    },
    {
      date: "Page G",
      uv: 540,
    },
    {
      date: "Page G",
      uv: 200,
    },
    {
      date: "Page G",
      uv: 370,
    },
    {
      date: "Page G",
      uv: 900,
    },
    {
      date: "Page G",
      uv: 700,
    },
    {
      date: "Page G",
      uv: 800,
    },
    {
      date: "Page G",
      uv: 900,
    },
  ];
  const CustomBar = (props) => {
    return <rect {...props} className="rounded-bar " />;
  };

  return (
    <div>
      {pools ? (
        <>
          <div className="grid grid-cols-2 mx-auto w-screen  p-8 gap-10 ">
            <div className=" h-[200px] w-[200px] md:w-[250px] mx-auto mb-10">
              <div className="text-start">
                <h3 className="text-gray-400 font-bold text-[10px]">
                  Shares Minted
                </h3>
                <h3 className="text-white font-bold text-[18px]">
                  {stats?.sharesTransacted}
                </h3>
              </div>
              <ResponsiveContainer width="100%" height="100%" className={""}>
                <BarChart width={150} height={40} data={data}>
                  <Bar
                    dataKey="uv"
                    fill="#00bafa"
                    className="rounded-bar "
                    shape={<CustomBar />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className=" h-[200px] w-[200px]  md:w-[250px] ">
              <div className="text-start">
                <h3 className="text-gray-400 font-bold text-[10px]">
                  Frenmint Volume
                </h3>
                <h3 className="text-white font-bold text-[18px]">
                  ${(stats?.volume * ethPrice).toFixed(2)}
                </h3>
              </div>
              <ResponsiveContainer width="100%" height="100%" className={""}>
                <BarChart width={150} height={40} data={data2}>
                  <Bar
                    dataKey="uv"
                    fill="#00bafa"
                    className="rounded-bar "
                    shape={<CustomBar />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mx-16 md:mx-[130px] lg:mx-[160px] mt-3 text-white text-[12px]">
            <div className="flex justify-start gap-2">
              <button
                className="hover:text-stone-500"
                onClick={() => {
                  setShowPools(true);
                  setShowTxs(false);
                }}
              >
                Pools
              </button>
              <button
                className="hover:text-stone-500"
                onClick={() => {
                  setShowPools(false);
                  setShowTxs(true);
                }}
              >
                Transactions
              </button>
            </div>
          </div>
          <div className="mt-2">
            {showPools ? (
              <>
                <PoolsTable pools={pools} />
              </>
            ) : (
              <TransactionsTable txs={txs} ethPrice={ethPrice} />
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center mb-10 mt-[300px]">
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

export default TransactionCharts;
