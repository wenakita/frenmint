import React from "react";
import { FaTelegram, FaTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Socials() {
  return (
    <div className="border  rounded-lg bg-neutral-950 border border-stone-900  w-screen h-[120px]">
      <div className="p-3 text-[12px] md:text-[25px] text-center font-bold text-gray-200">
        <div className="flex justify-center gap-1">
          <img
            src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
            alt=""
            className="size-6 mt-1"
          />
          <h3 className="mt-2">Follow Goddog</h3>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <Link to={"https://warpcast.com/~/channel/goddog"} target="_blank">
          <img
            src="https://github.com/vrypan/farcaster-brand/blob/main/icons/icon-transparent/transparent-white.png?raw=true"
            alt=""
            className="size-8 border border-neutral-900 bg-stone-900 p-1 rounded-lg"
          />
        </Link>
        <Link to={"https://x.com/goddog_official"} target="_blank" className="">
          <FaTwitter className=" text-white size-8 border border-neutral-900 bg-stone-900 p-1.5 rounded-lg" />
        </Link>{" "}
        <Link to={"https://t.me/goddog_official"} target="_blank">
          <FaTelegram className=" text-white size-8 border border-neutral-900 bg-stone-900 p-1.5 rounded-lg" />
        </Link>
      </div>
    </div>
  );
}

export default Socials;
