import { useEffect, useState } from "react";
import { findId } from "../requests/friendCalls";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { readContract } from "@wagmi/core";
import { config } from "../config";
import FriendTechABi from "../abi/FriendTechABi";
import { uintFormat } from "../formatters/format";
import { Link } from "react-router-dom";
import { useBalance } from "wagmi";
import { useLocation } from "react-router-dom";
import { getShareUri, getShareBalance } from "../requests/txRequests";
import { SearchByContract } from "../requests/friendCalls";
import { getEthPrice } from "../requests/priceCalls";
import { supabase } from "../client";
import { Quoter } from "sudo-defined-quoter";
import CardBuilder from "./NewHome/CardBuilder";
import Pools from "./Pools";
function NewBalances() {
  const API_KEY = import.meta.env.VITE_DEFINED_KEY;

  const [balanceData, setBalanceData] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const { wallets } = useWallets();
  const userAddress = wallets[0]?.address;
  const [hasUserName, setHasUserName] = useState(null);
  const [currentUserName, setCurrentuserName] = useState(null);
  const [userPools, setUserPools] = useState(null);
  const [viewShareHoldings, setViewShareHoldings] = useState(true);

  useEffect(() => {
    getEthereumPrice();
    getShareHoldings();
    getActivePools();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);
  async function getActivePools() {
    let usersFoundPools = [];
    let q = new Quoter(API_KEY, 8453);
    let a = await q.getPoolsForCollection(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
    );
    for (const key in a) {
      const currentOwner = a[key].owner;

      if (currentOwner.localeCompare(userAddress.trim().toLowerCase()) === 0) {
        usersFoundPools.push(a[key]);
      }
    }
    setUserPools(usersFoundPools);
  }

  function handleView() {
    if (viewShareHoldings) {
      setViewShareHoldings(false);
    } else {
      setViewShareHoldings(true);
    }
  }

  async function getEthereumPrice() {
    const ethereumPrice = await getEthPrice();
    setEthPrice(ethereumPrice);
  }

  async function getShareHoldings() {
    const userHoldingsFormatted = [];
    const userSharesHoldings = await findId(userAddress);
    for (const key in userSharesHoldings) {
      const currentShare = userSharesHoldings[key];
      const currentShareCA = await getShareUri(
        readContract,
        config,
        FriendTechABi,
        currentShare?.identifier
      );

      const currentShareFTData = await SearchByContract(currentShareCA);

      const shareBalance = await getShareBalance(
        readContract,
        config,
        FriendTechABi,
        userAddress,
        currentShare?.identifier
      );
      userHoldingsFormatted.push({
        nftID: currentShare?.identifier,
        contract: currentShareCA,
        balance: shareBalance,
        FTData: currentShareFTData,
      });
    }
    setBalanceData(userHoldingsFormatted);
  }

  async function fetchUsers() {
    const { data, error } = await supabase.from("usernames").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      for (const key in data) {
        if (data[key]?.user_address === userAddress) {
          console.log(data[key]);
          setCurrentuserName(data[key]?.username);
        }
      }
    }
  }
  return (
    <div className="mt-1 ">
      <div
        className={`border border-t-0 border-r-0 border-l-0 w-screen  border-stone-800 `}
      >
        <div className="text-[10px] mt-10">
          <div className="flex justify-start gap-2 ">
            <button
              onClick={() => {
                setViewShareHoldings(true);
              }}
              className={`hover:border hover:border-t-0 hover:border-r-0 hover:border-l-0  font-bold ${
                viewShareHoldings === true &&
                `border  p-1 border-t-0 border-r-0 border-l-0 text-white font-bold`
              }`}
            >
              Shares
            </button>
            <button
              onClick={() => {
                setViewShareHoldings(false);
              }}
              className={` hover:border hover:border-t-0 hover:border-r-0 hover:border-l-0  font-bold ${
                viewShareHoldings === false &&
                `border  p-1 border-t-0 border-r-0 border-l-0 text-white font-bold`
              }`}
            >
              Pools
            </button>
          </div>
        </div>
        {/* <img
          src="https://cdn.pfps.gg/banners/5980-pepe.png"
          alt=""
          className=" rounded-lg  w-full h-full"
        /> */}
        <div>
          <div className="flex justify-start">
            <img src="" alt="" />
          </div>
        </div>
      </div>

      {viewShareHoldings ? (
        <>
          {balanceData ? (
            <div className="mt-2 border border-transparent grid grid-cols-2 md:grid-cols-3  w-[375px] h-[400px] md:w-[560px]  gap-x-5 gap-y-2 p-2">
              {balanceData.map((item, index) => {
                return (
                  <CardBuilder
                    key={index}
                    data={item?.FTData}
                    isHero={false}
                    isBalance={true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center mb-10 mt-20">
              <img
                src="https://www.friend.tech/friendtechlogo.png"
                alt=""
                className="w-10 h-10 animate-bounce"
              />
            </div>
          )}
        </>
      ) : (
        <div>
          <Pools userPools={userPools} />
        </div>
      )}
    </div>
  );
}

export default NewBalances;
