import React from "react";
import { FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

function TransactionsTable({ txs, ethPrice }) {
  console.log(txs);
  return (
    <div
      className="overflow-x-auto border border-stone-900 w-[80%] ms-auto mx-auto rounded-md"
      style={{ backgroundColor: "#131313" }}
    >
      <table className="table whitespace-nowrap">
        {/* head */}
        <thead>
          <tr className="text-[10px] font-regular text-gray-300 bg-neutral-900">
            <th>#</th>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Swapped</th>

            <th>USD Value</th>
            <th>Share Amount</th>
            <th>Token Amount</th>
            <th>Wallet</th>
          </tr>
        </thead>
        <tbody>
          {txs?.map((item, index) => {
            console.log(item);
            return (
              <tr key={index} className="text-gray-300 text-[10px] font-bold">
                <th>{index + 1}</th>
                <td>{new Date(item?.created_at).getTime() / 1000}</td>
                <td className="">
                  {item?.is_buy ? (
                    <FaArrowUp className="text-green-500" />
                  ) : (
                    <FaArrowUp className="text-red-500" />
                  )}
                </td>
                <td className="flex">
                  <Link to={`/friend/${item?.share_address}`}>
                    <img
                      src={item?.ftPfpUrl}
                      alt=""
                      className="  size-6 border border-transparent rounded-full"
                    />
                  </Link>
                  <img
                    src={
                      item?.ERC20_Token === "$Friend"
                        ? "https://dd.dexscreener.com/ds-data/tokens/base/0x0bd4887f7d41b35cd75dff9ffee2856106f86670.png?size=lg&key=ad3594"
                        : "https://d3egfmvgqzu76k.cloudfront.net/pfp-images/0x7b202496c103da5bedfe17ac8080b49bd0a333f1/35134801v4w26w52w8?Expires=1820546101&Key-Pair-Id=K11ON08J8XW8N0&Signature=hYhq6S1aeNeA6Ug5vCsR7hhh1654ftV4FSjVO6dJf6NvAoDiEzjmwUgMvVlcIZBUydwz8DEN2YegsTujuOfSdYmo-PmJD0cOigNnJxrMhFtIIqexMq7NOFaVtwTJ~r2OZ-Jk8ilbyXlAggaBYrsAqrHyv76DiulBaba6L65yTtPayfCHNGoWoDN-3UKJxmo2JOWSDvXyANXBIH04Av60CcqDUEQ0ItIskLyaScolK-zPcTBmPuMN~xlr-kxxq04mbIx0JaB1bp04zH96Z0Q164LKdh2v94vpGhZIef8oIpoARh4FJ~uTigKC75caJTmFSoYdrBjenJAblaUqmPLaPA__"
                    }
                    alt=""
                    className=" size-[22px] mt-[1.4px] rounded-full "
                  />
                </td>
                <td>{Number(item?.eth_val * ethPrice).toFixed(2)}</td>
                <td>{Number(item?.share_amount).toFixed(2)}</td>
                <td>{Number(item?.eth_val).toFixed(2)}Ξ</td>

                <td className="hover:underline">
                  <Link
                    to={`https://basescan.org/address/${item?.buyer_address}`}
                    target="_blank"
                  >
                    {item?.buyer_address}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
