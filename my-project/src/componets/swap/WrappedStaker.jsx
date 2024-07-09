import { useWallets } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import {
  getExistingPools,
  getWrappedPools,
} from "../../requests/SudoSwapRequests";
import { checkChain } from "../../requests/txRequests";
import { getIdHoldings } from "../../requests/friendCalls";
import { StakeWrappedPool } from "../../requests/stakingRequests";

function WrappedStaker(props) {
  const { currentShare, setCurrentShare } = props;
  const { wallets } = useWallets();
  const [wrappedPoolsHoldings, setWrappedPoolsHoldings] = useState(null);
  const [walletDTA, setWalletDTA] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);

  const wallet = wallets[0];
  useEffect(() => {
    getWrappedPoolHoldings();
  }, []);

  useEffect(() => {
    console.log(wrappedPoolsHoldings);
    if (wrappedPoolsHoldings) {
      setSelectedPool(wrappedPoolsHoldings[0]);
    }
  }, [wrappedPoolsHoldings]);

  async function getUserWalletSigner() {
    const provider = await wallets[0]?.getEthersProvider();
    const network = await provider.getNetwork();
    const validNetwork = await checkChain(network?.chainId);
    const signer = await provider?.getSigner();
    return {
      provider: provider,
      validNetwork: validNetwork,
      signer: signer,
    };
  }

  async function getWrappedPoolHoldings() {
    const data = await getUserWalletSigner();
    setWalletDTA(data);
    const res = await getWrappedPools(wallet?.address);
    console.log(res);
    setWrappedPoolsHoldings(res);
  }

  async function initializeStaking() {
    const res = await StakeWrappedPool(
      walletDTA?.signer,
      selectedPool?.wrappedPoolData?.inner_id
    );
    if (!res.failed) {
      getWrappedPoolHoldings();
    }
  }
  return (
    <div className="border border-transparent bg-neutral-900 p-2 rounded-md w-[400px] mx-auto">
      <div className="flex gap-2">
        <img
          src="https://avatars.githubusercontent.com/u/94413972?s=280&v=4"
          alt=""
          className="size-7"
        />
        <h3 className="text-[10px] font-bold font-mono text-white mt-2">
          Stake wrapped pools
        </h3>
      </div>

      <div>
        <button
          className="border w-full p-1 border-stone-800 rounded-md bg-stone-800 mt-2"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <div className="flex justify-between gap-1">
            <div className="flex gap-1">
              <img
                src={
                  selectedPool
                    ? selectedPool?.friendTechData?.ftPfpUrl
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2lxy7RaD621qGEjD3vir7TmCcTCr-j4UL7HO0i6deXFOVgTBt5oGu2bHYKRWWRX8VT1U&usqp=CAU"
                }
                alt=""
                className="size-4 rounded-full"
              />
              <h3 className="text-white text-[9px] font-bold font-mono mt-0.5">
                {wrappedPoolsHoldings
                  ? wrappedPoolsHoldings[0]?.friendTechData?.ftName
                  : selectedPool?.friendTechData?.ftPfpUrl || "Loading Shares"}
              </h3>
            </div>
            <img
              src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
              alt=""
              className="w-3 h-3 mt-1"
            ></img>
          </div>
        </button>
      </div>

      <div>
        <button
          className="mt-4 border border-stone-800 bg-blue-600 text-[9px] font-mono font-bold w-full text-white p-1 rounded-lg"
          onClick={() => {
            initializeStaking();
          }}
        >
          Stake Wrapped Pool
        </button>
      </div>
      <dialog id="my_modal_1" className="modal modal-bottom md:modal-middle">
        <div className="modal-box bg-neutral-900  h-[400px] md:h-auto">
          <div className="flex gap-1">
            <img
              src="https://www.friend.tech/friendtechlogo.png"
              alt=""
              className="size-5"
            />
            <h3 className="font-bold text-sm mb-2">Select </h3>
          </div>
          <div className="relative mb-2">
            <input
              type="text"
              className="pl-9 pr-3 py-2 w-full text-[10px] bg-stone-800  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Search..."
              onChange={(e) => {
                // setSearchInput(e.target.value);
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="overflow-y-auto h-[270px] md:h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
            {wrappedPoolsHoldings ? (
              <>
                {wrappedPoolsHoldings.map((item) => {
                  const slicedContract = `${item?.sudoSwapData?.address.slice(0, 4)}...${item?.sudoSwapData?.address.slice(item?.sudoSwapData?.address.length - 4, item?.sudoSwapData?.address.length)}`;

                  return (
                    <button
                      key={item}
                      className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                      onClick={() => {
                        setCurrentShare(item?.friendTechData);
                        setSelectedPool(item);
                        document.getElementById("my_modal_1").close();
                      }}
                    >
                      <div className="flex justify-start gap-2">
                        <img
                          src={item?.friendTechData?.ftPfpUrl}
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                        <h3 className="mt-1">{item?.friendTechData?.ftName}</h3>
                      </div>
                      <div className="flex justify-end">{slicedContract}</div>
                    </button>
                  );
                })}
              </>
            ) : (
              <div className="flex justify-center mb-10 mt-[100px]">
                <img
                  src="https://www.friend.tech/friendtechlogo.png"
                  alt=""
                  className="size-10 animate-bounce"
                />
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default WrappedStaker;
