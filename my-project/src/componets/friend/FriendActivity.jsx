import React from "react";
import { Link } from "react-router-dom";
import { uintFormat } from "../../formatters/format";
function FriendActivity(props) {
  const { priceHistory } = props;
  console.log(priceHistory);
  return (
    <div>
      {priceHistory ? (
        <>
          <div className="overflow-x-auto overflow-y-auto w-screen h-[400px] mb-5">
            <table className="table table-zebra-zebra  text-[8px]">
              <thead className="text-[8px] ">
                <tr>
                  <th>Trader</th>

                  <th>Time</th>
                  <th>Type</th>
                  <th>ETH</th>

                  <th>Price</th>
                </tr>
              </thead>
              <tbody className="">
                {priceHistory.map((item) => {
                  return (
                    <tr key={item} className="text-[8px] text-white">
                      <td>
                        <Link
                          to={`/friend/${item?.traderShareAddress}`}
                          className="flex"
                        >
                          <img
                            src={item?.traderPfp}
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                        </Link>
                      </td>
                      <td className="whitespace-nowrap">{item?.fullDate}</td>
                      <td
                        className={`${item?.isBuy ? "text-green-500" : "text-red-500"}`}
                      >
                        {item?.isBuy ? "Buy" : "Sell"}
                      </td>
                      <td className="whitespace-nowrap">
                        {uintFormat(item?.ethAmount)} Ξ
                      </td>

                      <td>{item?.priceAtDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>empty</>
      )}
    </div>
  );
}

export default FriendActivity;
