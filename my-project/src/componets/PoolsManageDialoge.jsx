import { useWallets } from "@privy-io/react-auth";
import { readContract } from "@wagmi/core";
import React, { useEffect, useRef, useState } from "react";
import { useBalance } from "wagmi";
import { base } from "wagmi/chains";
import friendTechABI from "../abi/FriendTechABi";
import SudoSwapABI from "../abi/SudoSwapABI";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI";
import { config } from "../config";
import {
  depositGoddog,
  depositShares,
  getShareBalance,
  withdrawGoddog,
  withdrawShares,
} from "../requests/txRequests";
import { message } from "antd";
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Link } from "react-router-dom";
function PoolsManageDialoge(props) {
  const { currentPool, getActivePools } = props;
  const [showWithdrawShare, setShowWithdrawShare] = useState(true);
  const [showWithdrawGoddog, setShowWithdrawGoddog] = useState(false);
  const [showDepositGoddog, setShowDepositGoddog] = useState(false);
  const [showDepositShare, setShowDepositShare] = useState(false);
  const [goddogBalance, setGoddogBalance] = useState(null);
  const [currentShareBalance, setCurrentShareBalance] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [input, setInput] = useState(null);
  const inputRef = useRef();
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const goddogBalanceResult = useBalance({
    address: w0?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });
  const poolGoddogBalance = useBalance({
    address: currentPool?.poolData?.sharePoolData?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });
  const currentPoolGoddogBalance = poolGoddogBalance?.data?.formatted;

  console.log(currentPool);

  useEffect(() => {
    if (currentPool !== null) {
      getBalance();
    }
  }, [currentPool]);

  async function getBalance() {
    const balance = await getShareBalance(
      readContract,
      config,
      friendTechABI,
      w0?.address,
      currentPool?.poolData?.sharePoolData?.erc1155Id
    );
    console.log(balance);
    setCurrentShareBalance(balance);
  }

  async function detectTransaction() {
    let res;

    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    if (showWithdrawGoddog) {
      res = await withdrawGoddog(
        signer,
        SudoSwapPoolABI,
        currentPool?.poolData?.sharePoolData?.address,
        input
      );
    } else if (showWithdrawShare) {
      res = await withdrawShares(
        signer,
        SudoSwapPoolABI,
        currentPool?.poolData?.sharePoolData?.address,
        input,
        currentPool?.poolData?.sharePoolData?.erc1155Id
      );
    } else if (showDepositGoddog) {
      res = await depositGoddog(
        signer,
        SudoSwapABI,
        currentPool?.poolData?.sharePoolData?.address,
        input
      );
    } else if (showDepositShare) {
      res = await depositShares(
        signer,
        SudoSwapABI,
        currentPool?.poolData?.sharePoolData?.address,
        currentPool?.poolData?.sharePoolData?.erc1155Id,
        input,
        w0?.address
      );
    }
    console.log(res);
    if (res.failed === false) {
      setModalMessage({
        message: `${res.type} successful!`,
        variant: "green",
        failed: res.failed,
        hash: res?.receipt?.transactionHash,
      });
    } else if (res.failed === true) {
      console.log("failed tx");
      setModalMessage({
        message: `${res.type} unexpectedly failed`,
        variant: "red",
        failed: res.failed,
        hash: null,
      });
    }
    document.getElementById("my_modal_20").showModal();
  }

  return (
    <div className="border bg-neutral-900 p-2 rounded-lg border-stone-900 font-mono font-bold">
      {/*  */}
      <dialog id="my_modal_20" className="modal">
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
              Please make sure you have enough to cover gas and tokens as well
            </h3>
          ) : (
            <div className="text-center text-[10px] mt-2">
              <Link
                to={`https://basescan.org/tx/${modalMessage?.hash}`}
                target="_blank"
                className=""
              >
                <div className="flex justify-center gap-1">
                  <FaExternalLinkAlt className="text-[13px] mt-1" />
                  <h3 className="mt-1">Tx Hash</h3>
                </div>
              </Link>
            </div>
          )}
          <div className="mt-2">
            <button
              onClick={() => {
                document.getElementById("my_modal_20").close();
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
              console.log("closed");
              if (!modalMessage?.failed) {
                getActivePools();
              }
            }}
          >
            close
          </button>
        </form>
      </dialog>
      {/*  */}
      <select
        name="h"
        id=""
        className="text-[8px] p-1 rounded-md bg-stone-950 border border-transparent hover:border-blue-500 w-full mb-4"
      >
        <option
          value="h"
          selected
          onClick={() => {
            setShowDepositGoddog(false);
            setShowWithdrawGoddog(false);
            setShowDepositShare(false);
            setShowWithdrawShare(true);
          }}
        >
          Withdraw shares
        </option>
        <option
          value="h"
          onClick={() => {
            setShowWithdrawShare(false);
            setShowDepositGoddog(false);
            setShowDepositShare(false);
            setShowWithdrawGoddog(true);
          }}
        >
          Withdraw goddog
        </option>
        <option
          value="h"
          onClick={() => {
            setShowWithdrawShare(false);
            setShowWithdrawGoddog(false);
            setShowDepositShare(false);
            setShowDepositGoddog(true);
          }}
        >
          Deposit goddog
        </option>
        <option
          value="h"
          onClick={() => {
            setShowWithdrawShare(false);
            setShowDepositGoddog(false);
            setShowWithdrawGoddog(false);
            setShowDepositShare(true);
          }}
        >
          Deposit shares
        </option>
      </select>

      <div className="flex justify-between text-[8px]">
        <h3>
          {showDepositGoddog || showDepositShare
            ? "You Deposit"
            : showWithdrawGoddog || showWithdrawShare
              ? "You withdraw"
              : null}
        </h3>
        <h3>
          {showDepositGoddog ? (
            `$oooOOO balance: ${Number(goddogBalance).toFixed(2)} `
          ) : (
            <>
              {showDepositShare ? (
                `Share balance ${currentShareBalance}`
              ) : (
                <>
                  {showWithdrawGoddog ? (
                    `$oooOOO deposited:     ${Number(currentPoolGoddogBalance).toFixed(2)} `
                  ) : (
                    <>
                      {showWithdrawShare
                        ? `Shares deposited: ${Number(
                            currentPool?.poolData?.sharePoolData?.nftBalance
                          )} `
                        : null}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </h3>
      </div>
      <input
        type="text"
        className="w-full rounded-lg bg-transparent outline-none"
        defaultValue={0}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />

      <button className="text-[9px] border p-1 w-[50%] bg-stone-800 border-stone-700 rounded-lg">
        <div className="flex justify-between ms-1">
          <div className="flex gap-1">
            <h3 ref={inputRef}>{currentPool?.poolData?.shareData?.ftName}</h3>
            <img
              src={currentPool?.poolData?.shareData?.ftPfpUrl}
              alt=""
              className="size-3.5 rounded-full"
            />
          </div>
          <div></div>
        </div>
      </button>
      <div>
        <button
          className="border w-full mt-4 rounded-lg border-stone-950 bg-blue-500 text-white text-[10px] p-1"
          onClick={() => {
            document.getElementById("my_modal_1").close();
            detectTransaction();
          }}
        >
          {showDepositGoddog ? (
            "Deposit goddog "
          ) : (
            <>
              {showDepositShare ? (
                "Deposit Shares "
              ) : (
                <>
                  {showWithdrawGoddog ? (
                    "Withdraw goddog "
                  ) : (
                    <>
                      {showWithdrawShare ? "Withdraw Shares " : "Select option"}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PoolsManageDialoge;
