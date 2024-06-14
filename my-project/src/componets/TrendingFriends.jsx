import PropTypes from "prop-types";
import { uintFormat } from "../formatters/format";
import { Link } from "react-router-dom";
import { FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getShareSupply } from "../requests/txRequests";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { config } from "../config";
import friendTechABI from "../abi/FriendTechABi";
import "../App.css";

function TrendingFriends(props) {
  const [carouselSpace, setCarouselSpace] = useState(null);
  const topTen = [];
  const { data } = props;
  console.log(data);

  useEffect(() => {
    const currentWidth = window.innerWidth;
    console.log(currentWidth);
    if (currentWidth >= 557) {
      setCarouselSpace(40);
    }
    if (currentWidth >= 589) {
      setCarouselSpace(80);
    } else {
      setCarouselSpace(210);
    }
  });

  if (data) {
    data.map((item, index) => {
      if (index < 10) {
        topTen.push(item);
      }
    });
  }

  async function getSupply(shareAddress) {
    console.log(shareAddress);
    const shareSupply = await getShareSupply(
      readContract,
      config,
      friendTechABI,
      shareAddress
    );

    console.log(shareSupply);
    return shareSupply;
  }
  console.log(topTen);

  return (
    <div className="overflow-x-hidden overflow-auto ">
      <div className=" p-2 mb-2  w-[90%] mx-auto ">
        <h3 className="text-white font-mono font-bold text-[18px] flex justify-start">
          Trending Frens
        </h3>
      </div>

      {data ? (
        <Swiper
          freeMode={true}
          slidesPerView={3}
          spaceBetween={8}
          pagination={{
            clickable: false,
          }}
          modules={[FreeMode, Pagination]}
          className="max-w-screen overflow-x-hidden "
        >
          {topTen.map((item) => {
            return (
              <SwiperSlide key={item} className="">
                <div className="card w-full bg-stone-900 shadow-xl border border-stone-800">
                  <figure>
                    <img
                      src={
                        "https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmNfe9547vPVgd8qqdCFeH81yHos1n1CoQZu1D9n5Nrjvp?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
                      }
                      alt="Shoes"
                    />
                  </figure>
                  <div className="p-3">
                    <div className="flex justify-start gap-2 mb-2">
                      <img
                        src={item?.ftPfpUrl}
                        alt=""
                        className="rounded-full w-7 h-7"
                      />
                      <Link
                        to={`/friend/${item?.address}`}
                        className="text-white text-[9px] font-bold mt-1 hover:underline whitespace-nowrap"
                      >
                        {item?.ftName}
                      </Link>
                    </div>
                    <div className="mt-1 p-1 flex justify-between font-bold whitepace-nowrap">
                      <div className="grid grid-rows-1 text-[8px] md:text-[14px]  whitepace-nowrap">
                        <div className="">
                          <h3 className="text-stone-400 ">Holders</h3>
                        </div>
                        <div className="">
                          <h3 className="text-white ">{item?.holderCount}</h3>
                        </div>
                      </div>
                      <div className="grid grid-rows-1 text-[8px] md:text-[14px] whitepace-nowrap">
                        <div>
                          <h3 className="text-stone-400 ">Price</h3>
                        </div>
                        <div>
                          <h3 className="text-white  ">
                            {uintFormat(item?.displayPrice).toFixed(2)} Ξ
                          </h3>
                        </div>
                      </div>
                      <div className="grid grid-rows-1 text-[8px] md:text-[14px] ">
                        <div>
                          <h3 className="text-stone-400  ">Supply</h3>
                        </div>
                        <div>
                          <h3 className="text-white  whitepace-nowrap">10</h3>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-3">
                      <div className="mt-2 flex">
                        <Link
                          to={`/friend/${item?.address}`}
                          className="text-[10px] border w-full p-1 bg-blue-500 text-white border-stone-800 rounded-md hover:bg-blue-800"
                        >
                          <h3 className="text-center">Mint Share</h3>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : null}
    </div>
  );
}

export default TrendingFriends;
