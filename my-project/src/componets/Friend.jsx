import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SearchByContract } from "../requests/friendCalls";
import { uintFormat } from "../formatters/format";
import { fetchFollowers } from "../requests/friendCalls";
import FriendSwap from "./FriendSwap";
import RecentTx from "./RecentTx";
import FriendActivity from "./friend/FriendActivity";
import FriendHolders from "./friend/FriendHolders";
import { getShareChartData } from "../requests/friendCalls";
function Friend() {
  const [data, setData] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [shareBalance, setShareBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [getTxData, setGetTxData] = useState(false);
  const [showHolders, setShowHolders] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [priceHistory, setPriceHistory] = useState(null);
  const [totalVolume, setTotalVolume] = useState(null);

  const { address } = useParams();
  console.log(address);
  useEffect(() => {
    setLoading(true);
    fetchInfo();

    // setTimeout(() => {
    //   setLoading(false);
    // }, [2000]);
  }, [address]);
  // useEffect(() => {
  //   setFollowers(null);
  //   setPriceHistory(null);
  //   setTotalVolume(null);
  // }, [address]);

  useEffect(() => {
    getFollowers();
    getChart();
  }, [data]);

  useEffect(() => {}, [totalVolume]);

  async function getChart() {
    let totalVolume = 0;
    const priceChartData = await getShareChartData(address);
    console.log(priceChartData);
    setPriceHistory(priceChartData);

    for (const key in priceChartData) {
      const currentAmount = uintFormat(Number(priceChartData[key]?.ethAmount));
      console.log(currentAmount);
      totalVolume += currentAmount;

      console.log(totalVolume);
      setTotalVolume(totalVolume);
      console.log(priceChartData[key]?.ethAmount);
    }
    setLoading(false);
  }

  async function fetchInfo() {
    const results = await SearchByContract(address);
    setData(results);
  }

  async function getFollowers() {
    const response = await fetchFollowers(data?.address);
    console.log(response);
    setFollowers(response);
  }

  return (
    <div className=" mb-10">
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
          <div className="">
            <RecentTx getTxData={getTxData} />
          </div>

          {data !== null ? (
            <div>
              <div className="border w-screen border-t-0 border-r-0 border-l-0 border-stone-800">
                <div className="p-3">
                  <div className="flex justify-start gap-2">
                    <img
                      src={data?.ftPfpUrl}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />

                    <h3 className="text-white mt-2 font-bold">
                      {data?.ftName}
                    </h3>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-start gap-5">
                    <div className="grid grid-rows-1">
                      <div className="text-[10px]">Price</div>
                      <div className="text-white font-bold text-[13px]">
                        {uintFormat(data?.displayPrice).toFixed(2)} Ξ
                      </div>
                    </div>
                    <div className="grid grid-rows-1">
                      <div className="text-[10px]">Holders</div>
                      <div className="text-white font-bold text-[13px]">
                        {data?.holderCount}
                      </div>
                    </div>
                    <div className="grid grid-rows-1">
                      <div className="text-[10px]">Total Volume</div>
                      <div className="text-white font-bold text-[13px]">
                        {totalVolume.toFixed(2)} Ξ
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start p-3 gap-2 text-[10px]">
                  <button
                    onClick={() => {
                      setShowActivity(false);
                      setShowHolders(true);
                    }}
                  >
                    Holders
                  </button>
                  <button
                    onClick={() => {
                      setShowHolders(false);

                      setShowActivity(true);
                    }}
                  >
                    Activity
                  </button>
                  <Link
                    to={`/newswap`}
                    onClick={() => {
                      setShowHolders(false);

                      setShowActivity(true);
                    }}
                  >
                    Mint
                  </Link>
                </div>
              </div>
              {showActivity ? (
                <FriendActivity priceHistory={priceHistory} />
              ) : (
                <>
                  {showHolders ? <FriendHolders followers={followers} /> : null}
                </>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Friend;

// <FriendSwap
// shareAddress={data?.address}
// price={uintFormat(data?.displayPrice)}
// setGetTxData={setGetTxData}
// shareData={data}
// />
