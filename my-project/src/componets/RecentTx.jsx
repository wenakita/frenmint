import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
function RecentTx(props) {
  const { getTxData } = props;
  const [liveTxData, setLiveTxData] = useState(null);
  const [displayTx, setDisplayTx] = useState(false);
  useEffect(() => {
    fetchLiveTxData();
  }, []);

  useEffect(() => {
    console.log("changed");
    if (getTxData) {
      console.log("true");
      fetchLiveTxData();
    }
  }, [getTxData]);

  async function fetchLiveTxData() {
    const { data, error } = await supabase.from("txs").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data[data.length - 1]);
      setLiveTxData(data[data.length - 1]);
      console.log(liveTxData);
    }
  }
  //

  useEffect(() => {
    if (liveTxData !== null || liveTxData) {
      setDisplayTx(true);
      setTimeout(() => {
        setDisplayTx(false);
      }, [2000]);
    }
  }, [liveTxData]);

  return (
    <>
      {displayTx ? (
        <div className="shake-little  shake-constant absolute ">
          <center className="  text-[8px] text-white animate-fade border border-slate-500  rounded-xl w-[300px] h-[50px] bg-black p-2 grid grid-cols-4">
            <div className="flex justify-center mt-1">
              <img
                src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
                alt=""
                className="w-5 h-5 rounded-full"
              />
            </div>
            <div className="mt-2 flex justify-start ">
              <div className="text-white flex gap-1">
                <img
                  src="https://www.candlepowerforums.com/media/pepe-hype-png.1887/full"
                  alt=""
                  className="w-3 h-3"
                />
                {liveTxData.frenmint_username}
              </div>
            </div>
            <div className="mt-2 flex-justify-start">
              <div className="flex justify-center gap-1">
                <h3 className="text-white">
                  {liveTxData.is_buy
                    ? `Bought ${liveTxData.purchase_amount}`
                    : `Sold ${liveTxData.purchase_amount}`}
                </h3>
                <img
                  src="https://www.friend.tech/keysIcon3d.png"
                  alt=""
                  className="w-3 h-3"
                />
                <h3 className="text-white"> of</h3>
              </div>
            </div>
            <Link
              to={`/friend/${liveTxData.share_address}`}
              className="flex justify-center gap-1 mt-1 hover:underline"
            >
              <img
                src={liveTxData.share_pfp}
                alt=""
                className="w-5 h-5 rounded-full"
              />
              <h3 className="text-white mt-1">{liveTxData.share_name}</h3>
            </Link>
          </center>
        </div>
      ) : null}
    </>
  );
}

export default RecentTx;
