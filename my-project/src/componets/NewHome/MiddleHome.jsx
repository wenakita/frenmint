import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Add this line to import Swiper styles
import CardBuilder from "./CardBuilder";

function MiddleHome(props) {
  const topTen = [];
  const { trending, recentTxs } = props;
  if (trending) {
    trending.map((item, index) => {
      if (index < 10) {
        topTen.push(item);
      }
    });
  }
  return (
    <div>
      <div>
        <div className="p-2 font-bold text-white">Top Ten</div>
        {trending ? (
          <Swiper
            freeMode={true}
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              700: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            }}
            pagination={{
              clickable: false,
            }}
            className="mySwiper"
          >
            {topTen.map((item) => {
              return (
                <SwiperSlide key={item}>
                  <CardBuilder data={item} isHero={false} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : null}
      </div>
      <div className="mt-5">
        <div className="p-2 font-bold text-white">Recent Buys</div>
        {recentTxs ? (
          <Swiper
            freeMode={true}
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              700: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            }}
            pagination={{
              clickable: false,
            }}
            className="mySwiper"
          >
            {recentTxs.map((item) => {
              return (
                <SwiperSlide key={item}>
                  <CardBuilder data={item} isHero={false} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : null}
      </div>
    </div>
  );
}

export default MiddleHome;
