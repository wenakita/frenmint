import { useState } from "react";
import { Link } from "react-router-dom";
function NotableFriends(props) {
  const { data } = props;
  console.log(data);
  return (
    <div>
      {data ? (
        <>
          <h3 className="text-center text-white font-mono font-bold mt-5 text-[20px]">
            Notable Mention
          </h3>
          <div className="mt-5">
            <div className="border border-stone-800 p-2 w-[320px] rounded-xl">
              <div className="flex justify-start p-2">
                <img
                  src={data?.ftPfpUrl}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="flex justify-start">
                <h3 className="text-white text-[15px] p-3 hover:underline">
                  {data?.ftName}
                </h3>
              </div>
              <div className="flex justify-start">
                <h3 className="text-white text-[9px] ms-2.5 font-mono hover:underline">
                  Ca: {data?.address}
                </h3>
              </div>
              <div className="flex justify-start ms-2.5 mt-1.5">
                <Link
                  to={`https://www.friend.tech/${data?.address}`}
                  target="_blank"
                  className="text-white text-[12px] mt-1 font-mono font-bold hover:underline"
                >
                  friend.tech profile
                </Link>
                <img
                  src="https://freepngimg.com/thumb/twitter/108250-badge-twitter-verified-download-free-image-thumb.png"
                  alt=""
                  className="w-7 h-7"
                />
              </div>
              <div className="flex justify-start gap-1 mt-1">
                <Link
                  to={`/friend/${data?.address}`}
                  className="flex justify-center ms-2 mt-1 mb-3 gap-1 border border-stone-700 bg-black w-[110px] rounded-lg p-1"
                >
                  <div className="text-[8px] mt-1 text-white">Mint / Burn</div>
                  <div>
                    <img
                      src="https://www.friend.tech/keysIcon3d.png"
                      alt=""
                      className="w-3 h-3 mt-1"
                    />
                  </div>
                </Link>{" "}
                <Link
                  to={`/friend/${data?.address}`}
                  className="flex justify-center ms-2 mt-1 mb-3 gap-1 border border-stone-700 bg-black w-[110px] rounded-lg p-1"
                >
                  <div className="text-[8px] mt-1 text-white"> Chart</div>
                  <img
                    src="https://media3.giphy.com/media/hZE5xoaM0Oxw4xiqH7/giphy.gif?cid=82a1493b8d9p1o6zrl0qwsz7ve7kglvu0015yeopmy895rvt&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                    alt=""
                    className="w-3 h-3 mt-[3px]"
                  />
                  <div></div>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default NotableFriends;
