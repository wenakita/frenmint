import React, { useEffect, useState } from "react";

import Slider from "react-slick";
import { uintFormat } from "../formatters/format";
import { Link, useNavigate } from "react-router-dom";
function TrendingCarousel({ trending }) {
  const [toShow, setToShow] = useState(null);
  console.log(trending);
  const navigation = useNavigate();
  console.log(window.innerWidth);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 6,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
    ],
  };
  return (
    <div className="relative h-[50px]">
      <div className="absolute top-0 left-0 z-10 border border-neutral-800 rounded-md bg-neutral-950 h-[45px]">
        <div className="flex p-2 gap-1 mt-1">
          <img
            src="https://em-content.zobj.net/source/apple/114/fire_1f525.png"
            alt=""
            className="size-4"
          />
          <h3 className="text-[8px] text-white font-bold mt-1">Trending</h3>
        </div>
      </div>
      <div className="border border-stone-900 p-1 w-screen text-white">
        <div className="slider-container">
          <Slider {...settings}>
            {trending?.map((item, index) => {
              if (index < 12) {
                return (
                  <div key={index} className="p-2">
                    <div className="flex gap-[4px]">
                      <h3 className="text-gray-500 font-bold text-[9px] mt-1.5">
                        #{index}
                      </h3>
                      <Link
                        to={`/friend/${item?.address}`}
                        className="flex gap-1"
                      >
                        <img
                          src={item?.ftPfpUrl}
                          alt=""
                          className="size-5 rounded-full"
                        />
                        <div className="text-truncate text-[6px] mt-2 whitespace-nowrap">
                          <h3 className="text-truncate">{item?.ftName}</h3>
                        </div>
                        <h3 className="text-green-500 text-[9px] whitespace-nowrap font-bold mt-1.5 text-truncate">
                          {uintFormat(item?.displayPrice).toFixed(4)}
                        </h3>
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default TrendingCarousel;
