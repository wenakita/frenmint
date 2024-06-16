import React from "react";
import { FaTelegram, FaTwitter } from "react-icons/fa6";

function Socials() {
  return (
    <div className="border  rounded-lg bg-neutral-950 border border-stone-900  w-screen h-[120px]">
      <div className="p-3 text-[20px] md:text-[25px] text-center font-bold font-mono text-stone-500">
        Follow Goddog
      </div>
      <div className="flex justify-center gap-3">
        <div>
          <img
            src="https://github.com/vrypan/farcaster-brand/blob/main/icons/icon-transparent/transparent-white.png?raw=true"
            alt=""
            className="size-8 border border-neutral-900 bg-stone-900 p-1 rounded-lg"
          />
        </div>
        <div>
          <FaTwitter className=" text-white size-8 border border-neutral-900 bg-stone-900 p-1.5 rounded-lg" />
        </div>{" "}
        <div>
          <FaTelegram className=" text-white size-8 border border-neutral-900 bg-stone-900 p-1.5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default Socials;
