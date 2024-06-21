import { useEffect, useState } from "react";
import { Quoter } from "sudo-defined-quoter";
import { Contract } from "ethers";
import { useBalance } from "wagmi";
import Balances from "./Balances";
import { useWallets } from "@privy-io/react-auth";
import { base } from "wagmi/chains";
import SudoSwapABI from "../abi/SudoSwapABI";
import friendTechABI from "../abi/FriendTechABi";
import GodDogABI from "../abi/GodDogABI";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Pools from "./Pools";
const API_KEY = import.meta.env.VITE_DEFINED_KEY;

function MyPools() {
  const navigate = useNavigate();
  const [finalizeTx, setFinalizeTx] = useState(false);
  const [userPools, setUserPools] = useState(null);
  const [input, setInput] = useState("");
  const [spotPrice, setSpotPrice] = useState("");
  const [fee, setFee] = useState("");
  const [shareAmount, setShareAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const { wallets } = useWallets();
  const w0 = wallets[0];
  const userAddress = w0?.address;
  const goddogBalanceResult = useBalance({
    address: userAddress,
    token: "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
    chainId: base.id,
  });

  const goddogBalance = Number(goddogBalanceResult?.data?.value) / 10 ** 18;
  const [selectedShare, setSelectedShare] = useState(null);
  const [shareInfo, setShareInfo] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getActivePools();
    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }, []);
  useEffect(() => {
    w0?.getEthersProvider().then(async (provider) => {
      const network = await provider.getNetwork();
      await w0.switchChain(8453);
    });
  }, [w0]);

  async function acitvateLoading() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, [2000]);
  }
  async function addNetwork() {
    console.info("Adding network");
    const provider = await w0?.getEthersProvider();
    //Request to add Inco chain
    await provider?.send("wallet_addEthereumChain", [
      {
        chainId: "0x2105", //9090
        chainName: "Base",
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://base.llamarpc.com"],
        blockExplorerUrls: ["https://basescan.org/"],
      },
    ]);
  }

  async function getActivePools() {
    let usersFoundPools = [];
    let q = new Quoter(API_KEY, 8453);
    let a = await q.getPoolsForCollection(
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514"
    );
    for (const key in a) {
      const currentOwner = a[key].owner;

      if (currentOwner.localeCompare(userAddress.trim().toLowerCase()) === 0) {
        usersFoundPools.push(a[key]);
      }
    }
    setUserPools(usersFoundPools);
  }

  //allow goes here in both
  async function goddogPermission() {
    try {
      const provider = await w0?.getEthersProvider();
      const network = await provider.getNetwork();
      const signer = await provider?.getSigner();
      if (network?.chainId !== 8453) {
        await addNetwork();
      }
      const godDogContract = new Contract(
        "0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
        GodDogABI,
        signer
      );
      //thsi approvall set a very high amount so we are approved to spend an infinite amount of tokens

      const res = await godDogContract.approve(
        "0x605145D263482684590f630E9e581B21E4938eb8",
        "99999999999999999999999999999999"
      );
      const reciept = await res;
      console.log(await reciept);
    } catch (error) {
      console.log(error);
    }
  }
  async function friendTechSharePermission() {
    try {
      const provider = await w0?.getEthersProvider();
      const network = await provider.getNetwork();
      const signer = await provider?.getSigner();
      if (network?.chainId !== 8453) {
        await addNetwork();
      }
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
    }
  }

  async function createPool() {
    await goddogPermission();
    await friendTechSharePermission();
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    const signer = await provider?.getSigner();
    const address = await signer?.getAddress();
    if (network?.chainId !== 8453) {
      await addNetwork();
    }
    const SudoSwapContract = new Contract(
      "0x605145D263482684590f630E9e581B21E4938eb8",
      SudoSwapABI,
      signer
    );

    //the spot price has to be the shares current price calculate din goddog value
    try {
      const parameters = [
        "0xDDf7d080C82b8048BAAe54e376a3406572429b4e", // token
        "0xbeea45F16D512a01f7E2a3785458D4a7089c8514", // nft
        "0xd0A2f4ae5E816ec09374c67F6532063B60dE037B", // bondingCurve
        String(w0?.address), // assetRecipient
        2, // poolType (assuming this should be uint8 and is 1)
        ethers.BigNumber.from("45"), // delta(the change in slope, change in price per purchase)
        "69000000000000000", // fee
        ethers.BigNumber.from(input).mul(ethers.BigNumber.from("10").pow(18)), // spotPrice this is the price in goddog for the nft
        shareInfo.id, // nftId (uint256)
        ethers.BigNumber.from(shareAmount), // initialNFTBalance (uint256)
        ethers.BigNumber.from(input)
          .mul(ethers.BigNumber.from("10").pow(18))
          .toString(), // initialTokenBalance (uint256)  the amount has to be multiplited by 1^18
        "0x0000000000000000000000000000000000000000", // hookAddress
        "0x0000000000000000000000000000000000000000",
      ];

      const res = await SudoSwapContract.createPairERC1155ERC20(parameters, {
        gasLimit: 300000, // Adjust this value as needed
      });
      const reciept = await res.wait();
      console.log(await reciept);
      acitvateLoading();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }
  //it works lfg now find how to properly manage it

  return (
    <div className="mb-20">
      {loading ? (
        <div className="flex justify-center mt-[250px] mb-10">
          <img
            src="https://www.friend.tech/friendtechlogo.png"
            alt=""
            className="w-20 h-20 animate-bounce"
          />
        </div>
      ) : (
        <div className="mt-20">
          {/* <div className="text-[30px] text-center p-5  flex justify-center">
            <img
              src="https://ivory-accurate-pig-375.mypinata.cloud/ipfs/QmNfe9547vPVgd8qqdCFeH81yHos1n1CoQZu1D9n5Nrjvp?pinataGatewayToken=DdSIfjJJunjBBaGpRA4VE7rw9Q3bNil3avaM8VrHQkPRh_2vaSMuwGFYGbn9Xzt2"
              alt=""
              style={{ maxWidth: "80%" }}
            />
          </div> */}

          <div className="text-center font-mono font-bold text-white text-[20px]">
            Pools Owned:
          </div>
          <center className="text-white mt-10 ">
            {userPools || userPools !== null ? (
              <Pools userPools={userPools} activateLoading={acitvateLoading} />
            ) : (
              <div className="flex justify-center gap-2 mt-2">
                <img
                  src="https://forums.frontier.co.uk/attachments/1000012145-png.391294/"
                  alt=""
                  className="w-7 h-7"
                />
                <h3 className="text-white font-mono font-bold text-[10px] mt-2">
                  You currently own no pools
                </h3>
              </div>
            )}
          </center>
          {open ? (
            <div
              className="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="fixed inset-0 bg-stone-950 bg-opacity-[80%] transition-opacity"></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center mb-12">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 w-[380px]">
                  <div className="relative transform overflow-hidden rounded-lg bg-stone-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 bg-stone-900">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-2 bg-stone-900">
                          <div className="flex justify-start gap-2">
                            <img
                              src="https://avatars.githubusercontent.com/u/94413972?s=280&v=4"
                              alt=""
                              className="w-10 h-10 mb-3"
                            />{" "}
                            <img
                              src={selectedShare?.ftPfpUrl}
                              alt=""
                              className="w-10 h-10 mb-3 rounded-full"
                            />
                          </div>
                          <h3
                            className="text-base font-semibold leading-6 text-white"
                            id="modal-title"
                          >
                            Create a pool for {selectedShare?.ftName}
                          </h3>
                          <div className="flex justify-start mt-3">
                            <h3 className="text-white text-[10px] font-mono font-bold">
                              Friend.Tech Profile
                            </h3>
                            <img
                              src="https://freepngimg.com/thumb/twitter/108250-badge-twitter-verified-download-free-image-thumb.png"
                              alt=""
                              className="w-5 h-5"
                            />
                          </div>
                          <div>
                            <h3 className="text-white font-mono font-bold text-[10px] mb-3">
                              Ca: {selectedShare?.address}
                            </h3>
                          </div>
                          <div className="mt-2">
                            <h3 className="text-white text-[12px]">
                              Paired $OOOooo
                            </h3>
                            <input
                              type="text"
                              className="w-[300px] bg-stone-700 rounded-lg text-white text-[11.5px] p-0.5"
                              onChange={(e) => {
                                setInput(e.target.value);
                              }}
                              placeholder="Enter $OOOooo Amount..."
                            />
                            <div className="flex justify-end">
                              <h3 className="text-white text-[8px] me-2">
                                $OOOooo balance: {goddogBalance}
                              </h3>
                            </div>
                            <div className="flex justify-center text-[20px] text-stone-300 mt-3">
                              +
                            </div>
                            <h3 className="text-white text-[12px] mt-2">
                              Paired share
                            </h3>

                            <input
                              type="text"
                              className="w-[300px] bg-stone-700 rounded-lg text-stone-300 text-[11.5px] p-0.5"
                              placeholder="Enter Share Amount..."
                              onChange={(e) => {
                                setShareAmount(e.target.value);
                              }}
                            />
                            <div className="flex justify-end">
                              <h3 className="text-white text-[8px] me-2">
                                Share balance: {shareInfo?.balance}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-rows-2 flex justify-center gap-10 ">
                      <div>
                        <div className="grid grid-cols-2 gap-10">
                          <div>
                            <h3 className="text-white text-[8px]">
                              Spot Price
                            </h3>
                            <input
                              type="text"
                              className="w-[100px] bg-stone-700 rounded-lg text-white text-[8px] p-0.5"
                              onChange={(e) => {
                                setSpotPrice(e.target.value);
                              }}
                            />
                          </div>
                          {/* <div>
                            <h3 className="text-white text-[8px]">Fee</h3>
                            <input
                              type="text"
                              className="w-[100px] bg-stone-700 rounded-lg text-white text-[8px] p-0.5"
                              onChange={(e) => {
                                setFee(e.target.value);
                              }}
                            />
                          </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 bg-stone-900">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-stone-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                        onClick={() => {
                          createPool();
                        }}
                      >
                        Create Pool
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-gray-900 border border-slate-500  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default MyPools;

// 0xbeea45F16D512a01f7E2a3785458D4a7089c8514

//base chain curve type addresses
//Exponential curve: 0x9506C0E5CEe9AD1dEe65B3539268D61CCB25aFB6,
//Linear curve: 0xe41352CB8D9af18231E05520751840559C2a548A
//Xyk curve: 0xd0A2f4ae5E816ec09374c67F6532063B60dE037B
//Gda curve: 0x4f1627be4C72aEB9565D4c751550C4D262a96B51

//sudoswap address to make the pools and do other things for owners of the specific pool: 0x605145d263482684590f630e9e581b21e4938eb8

//Sudoswap address to call buy and sell for the pool:
