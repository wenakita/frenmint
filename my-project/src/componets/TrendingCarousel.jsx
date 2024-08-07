import React from "react";
import Slider from "react-slick";
import { uintFormat } from "../formatters/format";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../App.css";
function TrendingCarousel({ trending }) {
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
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative h-auto py-4 border border-neutral-900 text-white w-screen">
      <div className="w-screen mx-auto ">
        <Slider {...settings}>
          {trending?.map((item, index) => {
            if (index <= 11) {
              return (
                <div key={index} className="px-3  ">
                  <div className="flex items-center gap-2 ">
                    <h3 className="text-gray-500 font-bold text-xs">
                      #{index + 1}
                    </h3>
                    <Link
                      to={`/friend/${item?.address}`}
                      className="flex items-center gap-1"
                    >
                      <img
                        src={item?.ftPfpUrl}
                        alt={item?.ftName}
                        className="size-4 rounded-full"
                      />
                      <div className="truncate text-xs">
                        <h3 className="truncate">{item?.ftName}</h3>
                      </div>
                      <h3 className="text-green-500 font-bold text-[9px] truncate">
                        +{uintFormat(item?.displayPrice).toFixed(4)}
                      </h3>
                    </Link>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </Slider>
      </div>
    </div>
  );
}

export default TrendingCarousel;
