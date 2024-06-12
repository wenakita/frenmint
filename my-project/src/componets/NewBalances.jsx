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

function NewBalances() {
  const [balanceData, setBalanceData] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const { wallets } = useWallets();
  const userAddress = wallets[0]?.address;
  const [hasUserName, setHasUserName] = useState(null);
  const [currentUserName, setCurrentuserName] = useState(null);

  useEffect(() => {
    getEthereumPrice();
    getShareHoldings();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);
  let currentWidth;

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
        className={`border border-t-0 border-r-0 border-l-0 w-screen  border-stone-800 p-4 `}
      >
        <div className="flex justify-start p-2 gap-2">
          <img
            src="https://i1.sndcdn.com/artworks-xXiAQBXW43JjK5fN-Xy2bEA-t500x500.jpg"
            alt=""
            className="w-10 h-10 rounded-full border border-stone-700 bg-stone-500"
          />
          <h3 className="text-white font-bold mt-2 ">{currentUserName}</h3>
        </div>
        <div className="mt-2 p-2 flex gap-4">
          <div className="grid grid-rows-1">
            <div>
              <h3 className="text stone-500 text-[10px]">Total Volume:</h3>
            </div>
            <div>
              <h3 className="text-white font-bold text-[14px]">200 Ξ</h3>
            </div>
          </div>
          <div className="grid grid-rows-1">
            <div>
              <h3 className="text stone-500 text-[10px]">Wallet Value:</h3>
            </div>
            <div>
              <h3 className="text-white font-bold text-[14px]">0.0025 Ξ</h3>
            </div>
          </div>
          <div className="grid grid-rows-1">
            <div>
              <h3 className="text stone-500 text-[10px]">Shares Held:</h3>
            </div>
            <div>
              <h3 className="text-white font-bold text-[14px]">
                {balanceData?.length}
              </h3>
            </div>
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

      {balanceData ? (
        <div className="mt-2 border border-transparent grid grid-cols-2 md:grid-cols-3  w-[375px] h-[400px] md:w-[560px]  gap-x-5 gap-y-2 p-2">
          {balanceData.map((item) => {
            return (
              <div
                key={item}
                className="card w-[180px] h-[220px] bg-stone-900 shadow-xl border border-stone-800"
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
                      src={item?.FTData?.ftPfpUrl}
                      alt=""
                      className="rounded-full w-7 h-7"
                    />
                    <Link
                      to={`/friend/${item?.FTData?.address}`}
                      className="text-white text-[12px] font-bold mt-1 hover:underline"
                    >
                      {item?.FTData?.ftName}
                    </Link>
                  </div>
                  <div className="">
                    <h3 className="text-white text-[8px]">
                      Balance: {item?.balance} (USD $
                      {(
                        ethPrice *
                        uintFormat(item?.FTData?.displayPrice) *
                        item?.balance
                      ).toFixed(2)}
                      )
                    </h3>

                    <h3 className="text-white text-[8px]">
                      {uintFormat(item?.FTData?.displayPrice)} / share
                    </h3>
                  </div>
                  <div className=" mt-3">
                    <div className="flex justify-start gap-2 mt-1">
                      {/* <button className="text-[10px] border p-1 bg-blue-500 text-white border-stone-800 rounded-md hover:bg-blue-800">
                        Mint
                      </button>
                      <button className="text-[10px] border p-1 bg-blue-500 text-white border-stone-800 rounded-md hover:bg-blue-800">
                        Create Pool
                      </button> */}
                      <button className="text-[10px] border p-1 w-full bg-blue-500 text-white border-stone-800 rounded-md hover:bg-blue-800">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
    </div>
  );
}

export default NewBalances;
