import React, { useEffect, useState } from "react";
import friendTechABI from "../../abi/FriendTechABi";
import { useWallets } from "@privy-io/react-auth";
import { Contract } from "ethers";
function ShareSender(props) {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const { holdingsData } = props;
  const [selectedShare, setSelectedShare] = useState(null);
  const [walletInput, setWalletInput] = useState(null);
  const [amountInput, setAmountInput] = useState(null);

  useEffect(() => {
    if (holdingsData) {
      setSelectedShare(holdingsData[0]);
    }
  }, []);
  console.log(holdingsData);

  async function sendShare() {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const wrapperCA = new Contract(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      friendTechABI,
      signer
    );
    try {
      const res = await wrapperCA.safeTransferFrom(
        w0?.address,
        walletInput,
        selectedShare?.nftID,
        amountInput,
        "0x",
        {
          gasLimit: 250000,
        }
      );
      const reciept = await res;
      console.log(await reciept);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="border border-transparent bg-stone-900 p-2 rounded-md w-[400px] mx-auto">
      <h3 className="text-[10px] p-2 text-white font-bold">Transfer Shares</h3>
      <div className=" p-2">
        <div className="flex justify-start ">
          <h3 className="text-white text-[10px]">Share to send </h3>
        </div>
        <button
          className="border w-full rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          <div className="flex justify-between gap-1 p-0.5">
            <div className="flex justify-start gap-1">
              <img
                src={selectedShare?.FTData?.ftPfpUrl}
                alt=""
                className="w-3 h-3 mt-[3px] ms-1 rounded-full"
              />
              <h3 className="whitespace-nowrap truncate text-[8px] mt-0.5">
                {selectedShare?.FTData?.ftName}
              </h3>
            </div>
            <img
              src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
              alt=""
              className="w-3 h-3 mt-1"
            />
          </div>
        </button>
      </div>
      <div className="mt-2 p-2.5  text-[10px] text-white">
        <h3>Amount to send</h3>
        <input
          type="text"
          className="w-full rounded-sm mt-1"
          onChange={(e) => {
            setAmountInput(e.target.value);
          }}
        />
        <div className="flex justify-end text-[8px] text-stone-400 mt-1">
          Balance: {selectedShare?.balance}
        </div>
      </div>
      <div className="mt-2 p-2.5  text-[10px] text-white">
        <h3>Wallet to send</h3>
        <input
          type="text"
          className="w-full rounded-sm mt-1"
          onChange={(e) => {
            setWalletInput(e.target.value);
          }}
        />
      </div>
      <div className="mt-2">
        <button
          className="border border-slate-700 rounded-md bg-blue-600 w-full text-[8px] hover:bg-blue-700 text-white font-bold p-1"
          onClick={() => {
            sendShare();
          }}
        >
          Confirm Send
        </button>
      </div>

      <dialog id="my_modal_5" className="modal">
        <div className="modal-box bg-neutral-900">
          <h3 className="font-bold text-lg mb-2">Select a share</h3>
          {/* <div className="flex justify-center mt-5">
              <input
                type="text"
                className="w-[80%] border rounded-lg border-transparent outline-none text-[10px] mb-4"
                onChange={(e) => {
                  // setSearchInput(e.target.value);
                }}
              />
            </div> */}
          <div className="overflow-y-auto h-[200px] border border-neutral-700 border-b-0 border-r-0 border-l-0  p-2">
            {holdingsData ? (
              <>
                {holdingsData?.map((item) => {
                  const slicedContract = `${item?.FTData?.address.slice(0, 4)}...${item?.FTData?.address.slice(item?.FTData?.address.length - 4, item?.FTData?.address.length)}`;

                  return (
                    <button
                      key={item}
                      className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                      onClick={() => {
                        // setCurrentShare(item?.FTData);
                        setSelectedShare(item);
                        document.getElementById("my_modal_5").close();
                      }}
                    >
                      <div className="flex justify-start gap-2">
                        <img
                          src={item?.FTData?.ftPfpUrl}
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                        <h3 className="mt-1">{item?.FTData?.ftName}</h3>
                      </div>
                      <div className="flex justify-end">{slicedContract}</div>
                    </button>
                  );
                })}
              </>
            ) : (
              <>No Data no holdings</>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ShareSender;
