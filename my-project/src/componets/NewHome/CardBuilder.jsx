import React, { useEffect, useState } from "react";
import { uintFormat } from "../../requests/friendCalls";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import {
  FaCube,
  FaCubes,
  FaEthereum,
  FaEye,
  FaRankingStar,
} from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function CardBuilder(props) {
  const navigate = useNavigate();
  const { data, isHero, isBalance } = props;
  const [url, setUrl] = useState(null);
  console.log(data);
  // if (data) {
  //   test(data?.ftPfpUrl);
  // }
  useEffect(() => {
    console.log(data);
    console.log(data?.address);

    test(data?.ftPfpUrl);
  }, [data]);
  async function test(imgUrl) {
    console.log("here");
    //we check to see if image url is valid if it valid we should get a 200 response if not we get 404 etc
    const res = await fetch(url);
    console.log(await res.status);
    if (res.status == 200) {
      setUrl(imgUrl);
    } else {
      setUrl("https://sudoswap.xyz/assets/img/emptyProfile.svg");
    }
  }

  // https://sudoswap.xyz/assets/img/emptyProfile.svg
  return (
    <>
      {data ? (
        <div
          className={` card ${isHero ? "w-[200px] md:w-[205px] lg:w-[250px] mx-auto shadow-lg " : isBalance ? "w-full h-[250px] md:h-[280px]" : "w-full"} shadow-xl  md:mt-0 bg-gradient-to-tr from-stone-950 to-neutral-950 border border-stone-900 `}
        >
          <div className=" w-full card-body rounded-lg mx-auto p-2">
            <figure
              className={`relative ${isHero ? "md:w-full md:flex-shrink-0" : "w-full md:flex-shrink-0 md:mr-4 "}`}
            >
              <Link to={`/friend/${data?.address}`}>
                <img
                  src={data.ftPfpUrl}
                  alt=""
                  className={`rounded-lg w-full h-full `}
                />
                <span
                  className={`absolute top-0 right-0  badge badge-dark rounded-sm border border-stone-700 text-[10px]`}
                >
                  #{data?.id}
                </span>
              </Link>
            </figure>

            <div className={isBalance ? `p-2 rounded-lg` : `p-3 rounded-lg`}>
              <div className="flex justify-start gap-1 md:p-2">
                <Link
                  to={`/friend/${data?.address}`}
                  className="text-white font-mono font-bold whitespace-nowrap text-[10px] md:text-[12px] overflow-hidden hover:underline hover:text-stone-700"
                >
                  {data?.ftName}
                </Link>
                <MdVerified className="text-blue-500 size-3 md:size-4" />
              </div>
              <div className="flex justify-start mt-2 gap-1">
                <FaEthereum className="mt-1 text-[11px]  md:text-[15px] md:text-[12px] mt-[5px] text-gray-500" />
                <h3 className="text-[10px] md:text-[15px] mt-1 font-mono font-bold text-white">
                  {uintFormat(data?.displayPrice).toFixed(5)}
                </h3>
              </div>
              {isBalance ? (
                <div className="relative">
                  <button
                    onClick={() => navigate(`/newswap`, { state: data })}
                    className=" text-[9px] font-bold p-0.5 w-full border bg-gray-200 text-black border-neutral-900 rounded-lg hover:bg-stone-400"
                  >
                    Mint
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}{" "}
    </>
  );
}

export default CardBuilder;
