import { useState } from "react";
import { Token } from "@uniswap/sdk-core";
function Swap() {
  const [input, setInput] = useState("");
  const handleSwap = () => {
    console.log(Token);
    console.log("Here");
  };
  return (
    <div>
      <div className="border border-slate-500 p-2 mt-10">
        <div className="flex justify-start gap-1">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png"
            alt=""
            className="w-16 h-16"
          />
          <h3 className="text-white mt-5 font-mono">Swap now</h3>
        </div>
        <div className="border p-2">
          <h3 className="text-white font-mono">Swap now</h3>
        </div>
        <div className="flex justify-center mt-5">
          <button
            className="border border-slate-500 rounded-xl text-white p-2"
            onClick={handleSwap}
          >
            Transaction
          </button>
        </div>
      </div>
    </div>
  );
}

export default Swap;
