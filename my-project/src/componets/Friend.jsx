import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SearchByContract } from "../requests/friendCalls";
import { uintFormat } from "../formatters/format";
import { fetchFollowers } from "../requests/friendCalls";
import FriendSwap from "./FriendSwap";
function Friend() {
  const [data, setData] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [shareBalance, setShareBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const { address } = useParams();
  useEffect(() => {
    fetchInfo();
    getFollowers();
    setTimeout(() => {
      setLoading(false);
    }, [1500]);
  }, [address]);

  async function fetchInfo() {
    const results = await SearchByContract(address);
    setData(results);
  }

  async function getFollowers() {
    const response = await fetchFollowers(data?.address);
    setFollowers(await response);
  }

  return (
    <div className="mt-10 container p-5 mb-10">
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
          {data !== null ? (
            <div className="flex justify-center">
              <div className="border border-slate-500 rounded-xl w-[400px] p-5 mb-20">
                <div className="p-2">
                  <img
                    src={data?.ftPfpUrl}
                    alt=""
                    className="w-26 h-16 rounded-full"
                  />
                </div>
                <div className="text-white text-[20px] p-2 flex justify-start gap-1">
                  <img
                    src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
                    alt=""
                    className="w-5 h-5 rounded-full mt-1"
                  />
                  {data?.ftName}
                </div>

                <div className=" p-2">
                  <a
                    href={`https://www.friend.tech/${data?.address}`}
                    target="_blank"
                  >
                    <div className="flex justify-start">
                      <h3 className="text-white text-[12px] mt-2 hover:underline font-mono font-bold">
                        Friend.tech profile
                      </h3>
                      <img
                        src="https://freepngimg.com/thumb/twitter/108250-badge-twitter-verified-download-free-image-thumb.png"
                        alt=""
                        className="w-8 h-8 hover:underline"
                      />
                    </div>
                  </a>
                </div>
                <a
                  href={`https://basescan.org/address/${data?.address}`}
                  target="_blank"
                  className="flex justify-start text-[12px] text-white p-2 hover:underline font-mono font-bold"
                >
                  Ca: {data?.address}
                </a>

                <div className="ms-2 mt-1 mb-2 font-mono font-bold">
                  <div className="flex justify-start">
                    <h3 className="text-white text-[12px] mt-0.5">
                      Followed by {data?.followerCount} users
                    </h3>
                  </div>
                  <div className="flex justify-start mt-2">
                    <h3 className="text-white text-[12px]">
                      Holders: {data?.holderCount}
                    </h3>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex justify-start text-[12px]">
                    <h3 className="text-white font-bold">
                      Price: {uintFormat(data?.displayPrice)} Ξ / Share
                    </h3>
                  </div>
                </div>
                <div className="">
                  <FriendSwap
                    shareAddress={data?.address}
                    price={uintFormat(data?.displayPrice)}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Friend;
