import { useEffect, useState } from "react";
import { findId } from "../requests/friendCalls";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { readContract } from "@wagmi/core";
import { config } from "../config";
import FriendTechABi from "../abi/FriendTechABi";
import { uintFormat } from "../formatters/format";
import { Link } from "react-router-dom";
import { useBalance } from "wagmi";
import { useLocation } from "react-router-dom";
function Balances(props) {
  const location = useLocation();
  console.log(location.pathname);
  const { exportWallet } = usePrivy();
  const [userHoldings, setUserHoldings] = useState([]);
  const [holdingsDataFound, setHoldingsDataFound] = useState([]);

  const { wallets } = useWallets();
  const w0 = wallets[0];
  const userAddress = w0?.address;
  const ETHBalance = useBalance({
    address: userAddress,
  });

  useEffect(() => {
    getShareHoldings();
  }, [userAddress]);

  async function getHoldingData(holdings) {
    const finalHoldings = [];
    for (const key in holdings) {
      const currentAddress = holdings[key].address;
      const current = await fetchContract(currentAddress);
      console.log(current);

      if (current !== null) {
        finalHoldings.push(current);
      }
    }
    setHoldingsDataFound(finalHoldings);
  }

  async function fetchContract(targetAddress) {
    try {
      const response = await fetch(
        `https://prod-api.kosetto.com/users/${targetAddress}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getShareHoldings() {
    const userShareHoldings = [];
    const userSharesFound = await findId(userAddress);
    for (const key in userSharesFound) {
      console.log(userSharesFound[key]);
      const currentShareId = userSharesFound[key].identifier;
      const currentShareContract = await findShare(currentShareId);
      console.log(currentShareContract);
      const currentShareBalance = await getShareBalance(currentShareId);
      userShareHoldings.push({
        id: currentShareId,
        address: currentShareContract,
        balance: currentShareBalance,
      });
    }
    console.log(userShareHoldings.length);
    setUserHoldings(userShareHoldings);
    getHoldingData(userShareHoldings);
  }

  async function getShareBalance(targetId) {
    try {
      const shareBalance = await readContract(config, {
        address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
        abi: FriendTechABi,
        functionName: "balanceOf",
        args: [w0?.address, targetId],
      });
      const balanceResult = await Number(shareBalance);
      return balanceResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async function findShare(targetShareId) {
    try {
      const uriResult = await readContract(config, {
        address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
        functionName: "uri",
        abi: FriendTechABi,
        args: [targetShareId],
      });
      const contractFound = await uriResult.slice(28, uriResult.length);
      return contractFound;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return (
    <div className="container">
      {holdingsDataFound.length > 0 ? (
        <div
          className={`overflow-auto h-[200px] w-[420px] border border-slate-500 rounded-xl`}
        >
          {holdingsDataFound.map((item, index) => {
            return (
              <div
                key={index}
                className="text-white border border-slate-500 rounded-xl grid grid-flow-col p-3 w-[420px]"
              >
                <div className="flex justify-start gap-2">
                  <img
                    src={item?.ftPfpUrl}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <h3 className="text-[10px] text-center mt-2">
                    {item?.ftName}
                  </h3>
                </div>
                <div className="flex justify-center text-[10px] mt-2">
                  Price: {uintFormat(item?.displayPrice)}
                </div>
                <div className="flex justify-center text-[10px] mt-2">
                  Balance: {userHoldings[index].balance}
                </div>
                <div className="flex justify-end gap-2">
                  {location.pathname !== "/my-pools" ? (
                    <Link
                      to={`/friend/${item?.address}`}
                      className="border border-slate-500 rounded-xl p-2 flex"
                    >
                      <img
                        src="https://i.pinimg.com/originals/49/02/54/4902548424a02117b7913c17d2e379ff.gif"
                        alt=""
                        className="w-7 h-6"
                      />
                      <span className="text-[10px] mt-1">Mint & Burn</span>
                      <img
                        src="https://media0.giphy.com/media/J2awouDsf23R2vo2p5/giphy.gif?cid=6c09b9528hc0btlg9yo7v4fnfa4c0amgumd8n075941rgt12&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=e"
                        alt=""
                        className="w-7 h-6"
                      />
                    </Link>
                  ) : (
                    <>
                      <button
                        className="border border-slate-500 rounded-xl p-2 flex text-[10px]"
                        onClick={() => {
                          console.log(item?.ftName);
                          if (props.setter) {
                            props.setter(item);
                            props.setOpen(true);
                            props.info(userHoldings[index]);
                          }
                        }}
                      >
                        Create a pool
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center gap-2">
          <img
            src="https://forums.frontier.co.uk/attachments/1000012145-png.391294/"
            alt=""
            className="w-7 h-7"
          />
          <h3 className="text-white font-mono font-bold text-[10px] mt-2">
            You currently hold no shares
          </h3>
        </div>
      )}
    </div>
  );
}

export default Balances;
