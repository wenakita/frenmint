import React, { useEffect, useState } from "react";
import { uintFormat } from "../../requests/friendCalls";
import { Link } from "react-router-dom";
import { MdError, MdVerified } from "react-icons/md";
import {
  FaCube,
  FaCubes,
  FaEthereum,
  FaEye,
  FaRankingStar,
} from "react-icons/fa6";
import {
  FaCheckCircle,
  FaExternalLinkAlt,
  FaUserFriends,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getShareBalance, transferShares } from "../../requests/txRequests";
import { readContract } from "@wagmi/core";
import friendTechABI from "../../abi/FriendTechABi";

import { config } from "../../config";
import { useWallets } from "@privy-io/react-auth";
import { CiWallet } from "react-icons/ci";
function CardBuilder(props) {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const navigate = useNavigate();
  const {
    data,
    isHero,
    isBalance,
    setSelectedData,
    selectedData,
    getShareHoldings,
  } = props;
  const [url, setUrl] = useState(null);
  const [currentShareBalance, setCurrentShareBalance] = useState(null);
  const [sendAmount, setSendAmount] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  console.log(data);
  // if (data) {
  //   test(data?.ftPfpUrl);
  // }
  useEffect(() => {
    console.log(data);
    console.log(data?.address);

    test(data?.ftPfpUrl);
  }, [data]);

  useEffect(() => {
    getBalance();
  }, [selectedData]);

  async function test(imgUrl) {
    console.log("here");
    //we check to see if image url is valid if it valid we should get a 200 response if not we get 404 etc
    const res = await fetch(url);
    console.log(await res.status);
    if (res.status == 200) {
      setUrl(imgUrl);
    } else {
      setUrl("https://sudoswap.xyz/assets/img/emptyProfile.svg");
    }
  }
  async function getBalance() {
    const res = await getShareBalance(
      readContract,
      config,
      friendTechABI,
      w0?.address,
      selectedData?.address
    );
    console.log(res);
    setCurrentShareBalance(res);
  }

  async function initializeTransfer() {
    document.getElementById("my_modal_75").close();
    const provider = await wallets[0]?.getEthersProvider();
    const signer = await provider?.getSigner();
    const txRes = await transferShares(
      signer,
      sendAmount,
      selectedData?.address,
      w0?.address,
      receiver
    );
    console.log(txRes);
    finalizedModal(txRes);
  }

  function finalizedModal(res) {
    if (res.failed === false) {
      setModalMessage({
        message: `${res.type} successful!`,
        variant: "green",
        failed: res.failed,
        hash: res?.receipt?.transactionHash,
      });
      getShareHoldings();
    } else if (res.failed === true) {
      console.log("failed tx");
      setModalMessage({
        message: `${res.type} unexpectedly failed`,
        variant: "red",
        failed: res.failed,
        hash: null,
      });
    }
    document.getElementById("my_modal_65").showModal();
  }
  // https://sudoswap.xyz/assets/img/emptyProfile.svg
  return (
    <>
      {data ? (
        <div
          className={` card ${isHero ? "w-[200px] md:w-[205px] lg:w-[250px] mx-auto shadow-lg " : isBalance ? "w-full h-[250px] md:h-[280px]" : "w-full"} shadow-xl  md:mt-0 bg-gradient-to-tr from-stone-950 to-neutral-950 border border-stone-900 `}
        >
          <div className=" w-full card-body rounded-lg mx-auto p-2">
            <figure
              className={`relative ${isHero ? "md:w-full md:flex-shrink-0" : "w-full md:flex-shrink-0 md:mr-4 "}`}
            >
              <Link to={`/friend/${data?.address}`}>
                <img
                  src={data.ftPfpUrl}
                  alt=""
                  className={`rounded-lg w-full h-full `}
                />
                <span
                  className={`absolute top-0 right-0  badge badge-dark rounded-sm border border-stone-700 text-[10px]`}
                >
                  #{data?.id}
                </span>
              </Link>
            </figure>

            <div className={isBalance ? `p-2 rounded-lg` : `p-3 rounded-lg`}>
              <div className="flex justify-start gap-1 md:p-2">
                <Link
                  to={`/friend/${data?.address}`}
                  className="text-white font-mono font-bold whitespace-nowrap text-[10px] md:text-[12px] overflow-hidden hover:underline hover:text-stone-700"
                >
                  {data?.ftName}
                </Link>
                <MdVerified className="text-blue-500 size-3 md:size-4" />
              </div>
              <div className="flex justify-start mt-2 gap-1">
                <FaEthereum className="mt-1 text-[11px]  md:text-[15px] md:text-[12px] mt-[5px] text-gray-500" />
                <h3 className="text-[10px] md:text-[15px] mt-1 font-mono font-bold text-white">
                  {uintFormat(data?.displayPrice).toFixed(5)}
                </h3>
              </div>
              {isBalance ? (
                <div className="relative flex gap-1 mt-1">
                  <button
                    onClick={() => navigate(`/newswap`, { state: data })}
                    className=" text-[9px] font-bold p-0.5 w-full border bg-gray-200 text-black border-neutral-900 rounded-lg hover:bg-stone-400"
                  >
                    Mint
                  </button>
                  <button
                    onClick={() => {
                      setSelectedData(data);
                      document.getElementById("my_modal_75").showModal();
                    }}
                    className=" text-[9px] font-bold p-0.5 w-full border bg-gray-200 text-black border-neutral-900 rounded-lg hover:bg-stone-400"
                  >
                    Transfer
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}{" "}
      <dialog id="my_modal_75" className="modal">
        <div className="modal-box bg-neutral-900">
          <h3 className="font-bold text-lg">Transfer shares</h3>
          <div className="border mt-2 p-2 bg-stone-900 border-stone-900">
            <div>
              <h3 className="text-start font-mono font-bold text-white text-[10px]">
                You send
              </h3>
            </div>
            <div className="flex justify-between mt-1">
              <input
                type="text"
                className="bg-transparent w-[150px] outline-none  mt-1 text-white font-mono font-bold text-[14px]"
                placeholder="Enter amount..."
                onChange={(e) => {
                  if (Number(e.target.value)) {
                    setSendAmount(e.target.value);
                  }
                }}
                defaultValue={0}
              />
              <button className="w-[150px] border border-stone-700 bg-stone-800 p-1 rounded-lg">
                <div className="flex justify-start gap-1">
                  <img
                    src={selectedData?.ftPfpUrl}
                    alt=""
                    className="size-4 rounded-full"
                  />
                  <h3 className="text-white whitespace-nowrap truncate text-[8px] mt-0.5">
                    {selectedData?.ftName}
                  </h3>
                </div>
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <h3 className="text-white font-mono font-bold text-[7px]">
                ERC-1155 share baalnce: {currentShareBalance}
              </h3>
            </div>
            <div className=" mt-2 mb-2">
              <input
                type="text"
                placeholder="Enter receiver..."
                className="w-full rounded-lg bg-transparent text-white font-bold text-[10px] p-1"
                onChange={(e) => {
                  setReceiver(e.target.value);
                }}
              />
            </div>
            <div className="mt-2">
              <button
                className="w-full border border-stone-700 bg-blue-500 hover:bg-stone-800 text-white font-mono font-bold text-[10px] p-0.5 rounded-lg"
                onClick={() => {
                  if (receiver.includes("0x")) {
                    initializeTransfer();
                  }
                }}
              >
                Send Shares
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog id="my_modal_65" className="modal">
        <div className="modal-box bg-neutral-900">
          <div className="mb-3">
            {modalMessage?.failed ? (
              <MdError
                className={`text-[100px] text-${modalMessage?.variant}-500 ms-auto me-auto`}
              />
            ) : (
              <FaCheckCircle className="text-[100px] text-green-500 ms-auto me-auto " />
            )}
          </div>
          <h3 className="font-bold text-[10px] font-mono text-center">
            {modalMessage?.message}
          </h3>

          {modalMessage?.failed ? (
            <h3 className="text-[8px] text-center mt-1">
              Please make sure you have enough to cover gas and tokens and the
              correct inputs
            </h3>
          ) : (
            <div className="text-center text-[10px] mt-2">
              <Link
                to={`https://basescan.org/tx/${modalMessage?.hash}`}
                target="_blank"
                className=""
              >
                <div className="flex justify-center gap-2">
                  <div className="flex gap-1 hover:text-stone-800">
                    <FaExternalLinkAlt className="text-[13px] mt-1" />
                    <h3 className="mt-1">Tx Hash</h3>
                  </div>
                </div>
              </Link>
            </div>
          )}
          <div className="mt-2">
            <button
              onClick={() => {
                document.getElementById("my_modal_65").close();
              }}
              className="border w-full rounded-md text-[12px] border-stone-900 bg-blue-500 text-white font-mono font-bold p-1 hover:bg-stone-800"
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => {
              if (!modalMessage?.failed) {
                // getActivePools();
                // getExistingPools();
              }
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
}

export default CardBuilder;
