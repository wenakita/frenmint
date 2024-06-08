import React from "react";
import { FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";

function CreatePoolSwap(props) {
  const { setOpenTokenPairs } = props;
  return (
    <div>
      <div className="flex justify-center">
        <div className="border border-stone-700 bg-stone-900 rounded-lg w-[400px] mt-3 text-white p-2">
          <div className="flex justify-start font-bold">Create Pools</div>
          <div className="border border-slate-500 bg-stone-800 rounded-lg p-2 mt-3">
            <div className="flex justify-between">
              <h3 className="text-white text-[12px] font-mono font-bold">
                Paired ERC-20:
              </h3>
              <h3 className="text-white text-[10px] text-stone-400">
                Balance: 0 | Max
              </h3>
            </div>
            <div className="mt-2 absolute">
              <input
                type="text"
                className="w-[350px] bg-transparent border border-transparent outline-none text-stone"
                style={{ "-moz-apperance": "textfield" }}
                placeholder="0"
                value={"0"}
              />
            </div>
            <div className="flex justify-between mt-10">
              <button
                className="border border-slate-500 bg-stone-900 p-1 rounded-lg"
                onClick={() => {
                  setOpenTokenPairs(true);
                }}
              >
                <span className="flex justify-center gap-2">
                  <img
                    src={
                      "https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                    }
                    alt=""
                    className={`w-5 h-5 rounded-full mt-[2px]`}
                  />
                  <h3 className="text-white text-[12px] mt-[2px]">Goddog</h3>
                  <img
                    src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                    alt=""
                    className="w-3 h-3 mt-[6px]"
                  />
                </span>
              </button>
              <div className="grid grid-rows-2 text-[10px]">
                <div className="text-white">$0</div>
                <div className="text-white">≈ USD</div>
              </div>
            </div>
            <div className="ms-[155px] absolute">
              <button
                className="flex justify-center border p-2 gap-[2px]  border-slate-500 rounded-lg bg-stone-900 w-[40px]"
                onClick={() => {
                  console.log("clicked");
                }}
              >
                <FaPlus className="w-[8px]" />
              </button>
            </div>
          </div>

          <div className="border border-slate-500 bg-stone-800 rounded-lg p-2 mt-5">
            <div className="flex justify-between">
              <h3 className="text-white text-[12px] font-mono font-bold">
                Paired ERC-1155
              </h3>
              <h3 className="text-white text-[10px] text-stone-400">
                Balance: | Max
              </h3>
            </div>
            <div className="mt-2 absolute">
              <input
                type="text"
                disabled="true"
                className="w-[350px] bg-transparent border border-transparent outline-none"
                placeholder="0"
                value={"0"}
              />
            </div>
            <div className="flex justify-between mt-10">
              <button
                className="border border-slate-500 bg-stone-900 p-1 rounded-lg"
                onClick={() => {}}
              >
                <span className="flex justify-center gap-2">
                  <img
                    src={
                      "https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                    }
                    alt=""
                    className="w-4 h-4 rounded-full mt-1"
                  />
                  <h3 className="text-white text-[12px] mt-[3px]">shareName</h3>
                  <img
                    src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                    alt=""
                    className="w-3 h-3 mt-2"
                  />
                </span>
              </button>
              <div className="grid grid-rows-2 text-[10px]">
                <div className="text-white">Ξ</div>
                <div className="text-white">≈ USD</div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 p-1">
            <div>
              <h3 className="text-stone-400 font-bold text-[10px] hover:underline">
                Contract:
              </h3>
              <h3 className="text-stone-400 text-[10px] font-bold mt-0.5">
                Price:
              </h3>
              <div className="flex">
                <h3 className="text-stone-400 mt-0.5  font-bold text-[10px]">
                  Fees Earned:
                </h3>
              </div>
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <img
              src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
              alt=""
              className="w-4 h-4 rounded-full"
            />
            <div className="mt-1 flex">
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
            </div>
            <div className="border rounded-lg w-[70px] h-[20px] border-stone-600 bg-stone-950 flex gap-1">
              <div className="flex mt-[1px] gap-0.5">
                <img
                  src={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAP1BMVEVHcEy5uf+5uf+5uf+5uf+5uf+5uf+5uf+5uf+5uf+7u/+np+eYmNGLi8AAAADAwP9VVXRnZ44zM0YXFyCentpxzBVnAAAACnRSTlMANIfD7v9jGuFD0s6R0QAAAM9JREFUeAF9k0EWhCAIQKsiHS1Q6/5nHWAROtPjr8L/QkGcHuZl3QC2dZmnX/YNHrZ9UCHCQAzmPvDHx3GPDfBKUBnfZRS3A5NGoaGcWWrIx2DTkaUirl2CE82Kw1PCeVqAISzEi8QkjgoSMMu0qqzILjfES1JgVbnKlrLOiai1nAsm3iQn0E1BYUHUKjH6DUon+Q8sFXppaYHyWfHq09qB4AaizMIOZKUkbPddsC/FmqCltCNZE6x91gRrn9N478rcy/bGxB8wfzT9oXafwxfaBRJco9g1WQAAAABJRU5ErkJggg=="
                  }
                  alt=""
                  className="w-3 h-3 rounded-full mt-0.5 ms-1"
                />
                <h3 className="text-white text-[6px] mt-1">0xbe...8514</h3>
              </div>
            </div>
            <div className="mt-1 flex">
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px] h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
              <div className="border border-stone-800 rounded-full p-1 bg-stone-700 w-[10px]  h-[5px]"></div>
            </div>
            <div className="border rounded-lg w-[60px] h-[20px] border-stone-600 bg-stone-950 flex gap-1">
              <div className="flex mt-[1px] gap-0.5">
                <img
                  src="https://www.candlepowerforums.com/media/pepe-hype-png.1887/full"
                  alt=""
                  className="w-3 h-3 ms-0.5"
                />
                <h3 className="text-white text-[6px] mt-1">Pool Maker</h3>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-1">
            <button
              className="border border-slate-500 bg-blue-600 hover:bg-blue-700 w-full rounded-md p-1 text-[13px]"
              onClick={() => {}}
            >
              Create Pool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePoolSwap;
