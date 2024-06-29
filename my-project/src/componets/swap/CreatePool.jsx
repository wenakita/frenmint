import React, { useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
import { Contract } from "ethers";
import SudoSwapABI from "../../abi/SudoSwapABI";
import GodDogABI from "../../abi/GodDogABI";
import friendTechABI from "../../abi/FriendTechABi";
import { ethers } from "ethers";
import { uintFormat } from "../../requests/friendCalls";
import { getGoddogPrice, getEthPrice } from "../../requests/priceCalls";
import { useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { checkChain, getShareBalance } from "../../requests/txRequests";
import { readContract } from "@wagmi/core";
import { config } from "../../config";
import ChartButton from "./ChartButton";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import { MdError } from "react-icons/md";
//remmm min nft to deposit is 4 no maximum
//formula to caclculate delta => numNftDeposited * 11 + 1
//spot price = spotprice * delta
//spot price for above = sharePrice(in eth) / goddog price (in eth)
function CreatePool(props) {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  const goddogBalanceResult = useBalance({
    address: w0?.address,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });
  const ethBalance = useBalance({
    address: w0?.address,
    chainId: base.id,
  });
  const [goddogBalance, setGoddogBalance] = useState(null);
  const [ethbalance, setEthBalance] = useState(null);

  const {
    holdingsData,
    setCurrentShare,
    currentPriceHistory,
    currentShare,
    shareTotalVolume,
    getUserHoldings,
  } = props;
  const [selectedShare, setSelectedShare] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [currentSpotPrice, setCurrentSpotPrice] = useState(0);
  const [currentDelta, setCurrentDelta] = useState(0);
  const [initialTokenBalance, setIntitialTokenBalance] = useState(null);
  const [message, setMessgae] = useState(null);
  const [shareBalance, setShareBalance] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  const [ethPrice, setEthPrice] = useState(null);
  const [goddogPrice, setGoddogPrice] = useState(null);

  const [lp, setLp] = useState(0);
  useEffect(() => {
    getEthereumPrice();
    if (holdingsData) {
      setSelectedShare(holdingsData[0]);
    }
    setGoddogBalance(uintFormat(goddogBalanceResult?.data?.value).toFixed(2));
    setEthBalance(Number(ethBalance?.data?.formatted).toFixed(6));
  }, []);
  useEffect(() => {
    getBalance();
  }, [selectedShare]);

  useEffect(() => {
    calculate();
  }, [depositAmount]);

  async function getEthereumPrice() {
    const ethPriceUSD = await getEthPrice();
    const oooOOOPrice = await getGoddogPrice();
    setGoddogPrice(oooOOOPrice);
    setEthPrice(ethPriceUSD);
  }

  async function calculate() {
    const ethPriceUSD = await getEthPrice();
    const goddogPrice = await getGoddogPrice();
    const goddogPriceUSD = goddogPrice * ethPriceUSD;
    const sharePrice = uintFormat(selectedShare.FTData?.displayPrice);
    const sharePriceUSD =
      uintFormat(selectedShare.FTData?.displayPrice) * ethPriceUSD;
    const deltaEquation = depositAmount * 11 + 1;
    const preSpotPriceEquation =
      (sharePrice * deltaEquation * ethPriceUSD) / goddogPrice;
    const finalSpotPrice = preSpotPriceEquation * deltaEquation;
    const roundedSpotPrice = Math.round(finalSpotPrice);
    const intialBalanceTest = sharePrice * depositAmount;
    const finalDepositAmount = (intialBalanceTest * ethPriceUSD) / goddogPrice;
    //pool price has to be per share in goddog

    setLp(finalDepositAmount);
    setIntitialTokenBalance(finalDepositAmount.toFixed(0));
    setCurrentDelta(deltaEquation);
    setCurrentSpotPrice(preSpotPriceEquation.toFixed(0));
  }

  async function getBalance() {
    const balRes = await getShareBalance(
      readContract,
      config,
      friendTechABI,
      w0?.address,
      selectedShare?.contract
    );
    setShareBalance(balRes);
  }

  async function goddogPermission() {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const godDogContract = new Contract(
      "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
      GodDogABI,
      signer
    );
    try {
      const res = await godDogContract.approve(
        "0x605145D263482684590f630E9e581B21E4938eb8",
        "99999999999999999999999999999999"
      );
      const reciept = await res;
      console.log(await reciept);
    } catch (error) {
      console.log(error);
      // setMessage("Transaction Reverted");
    }
  }
  async function friendTechSharePermission() {
    try {
      const provider = await w0?.getEthersProvider();
      const network = await provider.getNetwork();
      const signer = await provider?.getSigner();

      const godDogContract = new Contract(
        "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
        friendTechABI,
        signer
      );
      const res = await godDogContract.setApprovalForAll(
        "0x605145D263482684590f630E9e581B21E4938eb8",
        true
      );
      const reciept = await res;
      console.log(await reciept);
    } catch (error) {
      console.log(error);
      // setMessage("Transaction Reverted");
    }
  }

  async function createPool() {
    let txRes;

    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const validNetwork = await checkChain(network?.chainId);
    const signer = await provider?.getSigner();
    const address = await signer?.getAddress();

    const SudoSwapContract = new Contract(
      "0x605145D263482684590f630E9e581B21E4938eb8",
      SudoSwapABI,
      signer
    );

    try {
      const parameters = [
        "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
        "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
        "0xd0A2f4ae5E816ec09374c67F6532063B60dE037B",
        String(w0?.address),
        2,
        ethers.BigNumber.from(String(currentDelta)),
        "69000000000000000", // fee
        ethers.BigNumber.from(currentSpotPrice).mul(
          ethers.BigNumber.from("10").pow(18)
        ),
        selectedShare.nftID,
        ethers.BigNumber.from(depositAmount),
        ethers.BigNumber.from(initialTokenBalance)
          .mul(ethers.BigNumber.from("10").pow(18))
          .toString(),
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
      ];
      if (validNetwork) {
        await goddogPermission();
        await friendTechSharePermission();
        const res = await SudoSwapContract.createPairERC1155ERC20(parameters, {
          gasLimit: 350000,
        });
        const reciept = await res.wait();
        console.log(await reciept);
        txRes = { failed: false, receipt: reciept, type: "Create pool" };

        getUserHoldings();
      } else {
        document.getElementById("my_modal_300").showModal();
      }
    } catch (error) {
      console.log(error);
      txRes = { failed: false, receipt: null, type: "Create pool" };
    }
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
    } else if (res.failed === true) {
      console.log("failed tx");
      setModalMessage({
        message: `${res.type} unexpectedly failed`,
        variant: "red",
        failed: res.failed,
        hash: null,
      });
    }
    document.getElementById("my_modal_200").showModal();
  }

  //to add, goddog pair amount (liquidity tokens added), spot price , and how many shares to add
  //abstracct(do not add): fee: set to 6.9 defualt,
  // Abstract Parameters for Users:
  //   - XYK Curve = 10
  //   - Fees = 6.9%
  //   - Make it so that adding 1 NFT requires the same amount of $oooOOO to be added to the LP
  //   - Allow users to only just the number of shares they would like to provide as liquidity.
  //   - Basically make it so users simply 1. Enter the number of NFT's they wana provide and then 2. Click "Create Pool"
  return (
    <div className="border border-transparent bg-neutral-900 p-2 rounded-md w-[400px] mx-auto">
      <dialog id="my_modal_200" className="modal">
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
                <div className="flex justify-center gap-2">
                  <div className="flex gap-1 hover:text-stone-800">
                    <FaExternalLinkAlt className="text-[13px] mt-1" />
                    <h3 className="mt-1">Tx Hash</h3>
                  </div>
                  <Link
                    to={"/new"}
                    className="flex gap-1 mt-0.5 hover:text-stone-800"
                  >
                    <CiWallet className="text-[18px]" />
                    <h3 className="mt-0.5">wallet</h3>
                  </Link>
                </div>
              </Link>
            </div>
          )}
          <div className="mt-2">
            <button
              onClick={() => {
                document.getElementById("my_modal_200").close();
              }}
              className="border w-full rounded-md text-[12px] border-stone-900 bg-blue-500 text-white font-mono font-bold p-1 hover:bg-stone-800"
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => {}}>close</button>
        </form>
      </dialog>
      <div className="flex justify-between">
        <div className="flex justify-start gap-1">
          <img
            src="https://avatars.githubusercontent.com/u/94413972?s=280&v=4"
            alt=""
            className="w-5 h-5 rounded-full"
          />
          <h3 className="text-white font-bold text-[10px] mt-0.5">
            Add liquidity
          </h3>
        </div>
        <div>
          <ChartButton
            shareTotalVolume={shareTotalVolume}
            currentPriceHistory={currentPriceHistory}
            currentShare={currentShare}
          />
        </div>
      </div>

      <div className=" mt-4">
        <div className="">
          <div className="flex justify-start">
            <h3 className="text-white text-[10px]">Paired ERC-20 Token</h3>
          </div>
          <button
            className="border w-full rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500"
            // onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <div className="flex justify-between gap-1 p-0.5">
              <div className="flex justify-start gap-1">
                <img
                  src={
                    "https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
                  }
                  alt=""
                  className="w-3 h-3 mt-[3px] ms-1 rounded-full"
                />
                <h3 className="whitespace-nowrap truncate text-[8px] mt-0.5">
                  GodDog
                </h3>
              </div>
              {/* <img
                src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                alt=""
                className="w-3 h-3 mt-1"
              /> */}
            </div>
          </button>
          <div className="flex justify-end text-[8px]">
            $oooOOO balance: {goddogBalance || 0}
          </div>
        </div>
        <div>
          <h3 className="text-stone-300 text-center mt-1 font-bold">+</h3>
        </div>
        <div className="">
          <div className="flex justify-start">
            <h3 className="text-white text-[10px]">Paired ERC-1155 Share</h3>
          </div>
          <button
            className="border w-full rounded-md border-neutral-600 bg-stone-800 mt-1 hover:text-stone-500"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <div className="flex justify-between gap-1 p-0.5">
              <div className="flex justify-start gap-1">
                <img
                  src={
                    selectedShare?.FTData?.ftPfpUrl ||
                    "https://p7.hiclipart.com/preview/281/279/792/pepe-the-frog-batman-internet-meme-pepe-frog.jpg"
                  }
                  alt=""
                  className="w-3 h-3 mt-[3px] ms-1 rounded-full"
                />
                <h3 className="whitespace-nowrap truncate text-[8px] mt-0.5">
                  {selectedShare?.FTData?.ftName || "You own 0 shares"}
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
        <div className="mt-3 grid grid-flow-col p-2">
          <div>
            <div className="grid grid-rows-1">
              <h3 className="text-white text-[8px] font-bold">
                Shares deposited
              </h3>
              <div>
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-full bg-stone-800 rounded-lg text-[10px] text-white p-0.5"
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setDepositAmount(Number(e.target.value));
                    }
                  }}
                  value={depositAmount || 0}
                />
                <div className="flex justify-end text-[8px]">
                  ERC-1155 share balance: {selectedShare?.balance || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" p-1  text-[9px] mb-4">
          <div className="flex justify-center">
            <h3 className="text-red-500">{message ? message : null}</h3>
          </div>
          <div className="flex justify-start p-1 text-[10px] font-bold">
            Initial Pool
          </div>

          <div className="grid grid-cols-2 p-1">
            <div className="border border-neutral-700 bg-neutral-800 rounded-md">
              <div className="grid grid-rows-1 p-2">
                <div className="font-bold text-stone-400">Pool fee</div>
                <div className="font-bold text-white text-[8px] ">6.9%</div>
              </div>
            </div>
            <div className="border border-neutral-700 bg-neutral-800 rounded-sm">
              <div className="grid grid-rows-1 p-2">
                <div className="font-bold text-stone-400 whitespace-nowrap">
                  Required $OOOooo LP
                </div>
                <div className="font-bold text-white text-[8px] ">
                  <div className="flex gap-1">
                    <h3>{lp.toFixed(0)}</h3>
                    <h3 className="text-[7px] mt-[1px]">
                      {"≈ " + Number(lp * goddogPrice).toFixed(2) + " USD"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-neutral-700 bg-neutral-800 rounded-md w-[98%] mx-auto">
            <div className="grid grid-rows-1 p-2">
              <div className="font-bold text-stone-400">Mint price</div>
              <div className="font-bold text-white ">
                <div className="flex gap-1">
                  <h3>
                    {uintFormat(selectedShare?.FTData?.displayPrice).toFixed(
                      5
                    ) || 0}{" "}
                    {" Ξ / Share"}
                  </h3>
                  <h3 className="text-[7px] mt-[2px]">
                    ≈{" "}
                    {" " +
                      Number(
                        uintFormat(selectedShare?.FTData?.displayPrice) *
                          ethPrice
                      ).toFixed(2)}{" "}
                    USD
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            className="w-full border text-[10px] border-neutral-700 p-1 rounded-md bg-blue-700 hover:bg-stone-800 text-white font-bold font-mono"
            onClick={() => {
              console.log("hey");
              createPool();
              setMessgae(null);
            }}
          >
            Provide Liquidity
          </button>
        </div>

        <dialog id="my_modal_1" className="modal modal-bottom md:modal-middle">
          <div className="modal-box bg-neutral-900  h-[400px]">
            <div className="flex gap-1">
              <img
                src="https://www.friend.tech/friendtechlogo.png"
                alt=""
                className="size-5"
              />
              <h3 className="font-bold text-sm mb-2">Select </h3>
            </div>
            {/* <div className="flex justify-center mt-5">
              <input
                type="text"
                className="w-[80%] border rounded-lg border-transparent outline-none text-[10px] mb-4"
                onChange={(e) => {
                  // setSearchInput(e.target.value);
                }}
              />
            </div> */}
            <div className="overflow-y-auto h-[270px] md:h-[200px] border border-neutral-800 border-b-0 border-r-0 border-l-0  p-2">
              {holdingsData ? (
                <>
                  {holdingsData?.map((item) => {
                    const slicedContract = `${item?.FTData?.address.slice(0, 4)}...${item?.FTData?.address.slice(item?.FTData?.address.length - 4, item?.FTData?.address.length)}`;

                    return (
                      <button
                        key={item}
                        className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
                        onClick={() => {
                          setCurrentShare(item?.FTData);
                          setSelectedShare(item);
                          document.getElementById("my_modal_1").close();
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
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}

export default CreatePool;

{
  /* <button
key={item}
className=" p-2 grid grid-flow-col whitespace-nowrap text-[10px] w-full hover:bg-stone-800"
onClick={() => {
  setCurrentShare(item);
  document.getElementById("my_modal_1").close();
}}
>
<div className="flex justify-start gap-2">
  <img
    src={item?.ftPfpUrl}
    alt=""
    className="w-5 h-5 rounded-full"
  />
  <h3 className="mt-1">{item?.ftName}</h3>
</div>
<div className="flex justify-end">
  {slicedContract}
</div>
</button> */
}
