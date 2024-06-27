import React, { useState, useEffect, useRef } from "react";
import { uintFormat } from "../requests/friendCalls";
import { useBalance } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import { base } from "wagmi/chains";
import friendTechABI from "../abi/FriendTechABi";
import { readContract } from "@wagmi/core";
import {
  depositGoddog,
  depositShares,
  getShareBalance,
  withdrawGoddog,
  withdrawShares,
} from "../requests/txRequests";
import { config } from "../config";
import SudoSwapPoolABI from "../abi/SudoSwapPoolABI";
import SudoSwapABI from "../abi/SudoSwapABI";
function PoolsManageDialoge(props) {
  const { currentPool, getActivePools } = props;
  const [showWithdrawShare, setShowWithdrawShare] = useState(false);
  const [showWithdrawGoddog, setShowWithdrawGoddog] = useState(false);
  const [showDepositGoddog, setShowDepositGoddog] = useState(false);
  const [showDepositShare, setShowDepositShare] = useState(false);
  const [goddogBalance, setGoddogBalance] = useState(null);
  const [currentShareBalance, setCurrentShareBalance] = useState(null);
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
  useEffect(() => {
    setGoddogBalance(Number(goddogBalanceResult?.data?.value) / 10 ** 18);
    const size = window
      .getComputedStyle(inputRef.current, null)
      .getPropertyValue("font-size");

    console.log(size);
  }, []);
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
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    if (showWithdrawGoddog) {
      const res = await withdrawGoddog(
        signer,
        SudoSwapPoolABI,
        currentPool?.poolData?.sharePoolData?.address,
        input
      );
    } else if (showWithdrawShare) {
      const res = await withdrawShares(
        signer,
        SudoSwapPoolABI,
        currentPool?.poolData?.sharePoolData?.address,
        input,
        currentPool?.poolData?.sharePoolData?.erc1155Id
      );
    } else if (showDepositGoddog) {
      const res = await depositGoddog(
        signer,
        SudoSwapABI,
        currentPool?.poolData?.sharePoolData?.address,
        input
      );
    } else if (showDepositShare) {
      const res = await depositShares(
        signer,
        SudoSwapABI,
        currentPool?.poolData?.sharePoolData?.address,
        currentPool?.poolData?.sharePoolData?.erc1155Id,
        input
      );
    }
    getActivePools();
  }

  return (
    <div className="border bg-neutral-900 p-2 rounded-lg border-stone-900 font-mono font-bold">
      <select
        name="h"
        id=""
        className="text-[8px] p-1 rounded-md bg-stone-950 border border-transparent hover:border-blue-500 w-full mb-2"
      >
        <option value="" disabled selected>
          Select
        </option>
        <option
          value="h"
          onClick={() => {
            setShowWithdrawShare(true);
            setShowDepositGoddog(false);
            setShowWithdrawGoddog(false);
            setShowDepositShare(false);
          }}
        >
          Withdraw shares
        </option>
        <option
          value="h"
          onClick={() => {
            console.log("here");
            setShowWithdrawGoddog(true);

            setShowWithdrawShare(false);
            setShowDepositGoddog(false);
            setShowDepositShare(false);
          }}
        >
          Withdraw goddog
        </option>
        <option
          value="h"
          onClick={() => {
            setShowDepositGoddog(true);

            setShowWithdrawShare(false);
            setShowWithdrawGoddog(false);
            setShowDepositShare(false);
          }}
        >
          Deposit goddog
        </option>
        <option
          value="h"
          onClick={() => {
            setShowDepositShare(true);

            setShowWithdrawShare(false);
            setShowDepositGoddog(false);
            setShowWithdrawGoddog(false);
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
                        : "Select option"}
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
