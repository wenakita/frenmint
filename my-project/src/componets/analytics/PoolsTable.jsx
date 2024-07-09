import React from "react";

function PoolsTable({ pools }) {
  console.log(pools);
  return (
    <div
      className="overflow-x-auto border border-stone-900 w-[80%]  mx-auto md:ms-[120px] lg:ms-[150px] rounded-md"
      style={{ backgroundColor: "#131313" }}
    >
      <table className="table whitespace-nowrap">
        {/* head */}
        <thead>
          <tr className="text-[10px] font-regular text-gray-300 bg-neutral-900">
            <th>#</th>
            <th>Pool</th>
            <th>Owner</th>

            <th>Transactions</th>
            <th>Volume</th>
            <th>Fees Earned</th>
            <th>Fee</th>
          </tr>
        </thead>
        <tbody>
          {pools?.map((item, index) => {
            return (
              <tr key={index} className="text-gray-300 text-[10px] font-bold">
                <th>{index + 1}</th>
                <td className="flex">
                  <img
                    src={item?.ftPfpUrl}
                    alt=""
                    className="  size-6 border border-transparent rounded-full"
                  />
                  <img
                    src={item?.pairIMGURL}
                    alt=""
                    className=" size-6 rounded-full "
                  />
                </td>
                <td>PepeFan69</td>
                <td>{item?.poolStats[0] ? item?.poolStats[0]?.txCount : 0}</td>
                <td>
                  {item?.poolStats[0]
                    ? item?.poolStats[0]?.volume.toFixed(2)
                    : 0}{" "}
                  Ξ
                </td>

                <td>
                  {item?.poolStats[0]
                    ? String(item?.poolStats[0]?.feesEarned.toFixed(2))
                    : 0}{" "}
                  Ξ
                </td>
                <td>6.9%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PoolsTable;
