import React, { useEffect } from "react";
import { CiWallet } from "react-icons/ci";
import { MdOutlineCompareArrows } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
function NewNavigation() {
  const navigate = useNavigate();
  const { logout, authenticated, user, ready } = usePrivy();
  const wallet = user?.wallet;
  useEffect(() => {
    if ((!authenticated && !wallet) || (!authenticated && !ready)) {
      navigate("/");
    }
  }, [authenticated, wallet]);
  return (
    <div className="navbar bg-neutral-950 md:w-screen w-screen border border-neutral-900">
      <div className="navbar-start">
        <div className="dropdown ">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral-900 rounded-box w-52 font-bold"
          >
            <li className="">
              <Link
                to={"https://telegra.ph/GODDOG-Official-Whitepaper-06-01"}
                target="_blank"
              >
                Whitepaper
              </Link>
            </li>
            <li>
              <Link
                to={"https://telegra.ph/What-is-FrenMint-06-03"}
                target="_blank"
              >
                Frenmint docs
              </Link>
            </li>
            <li>
              <Link
                to={
                  "https://interchain.axelar.dev/base/0xDDf7d080C82b8048BAAe54e376a3406572429b4e"
                }
                target="_blank"
              >
                Interchain
              </Link>
            </li>
            <li>
              <Link
                to={
                  "https://dexscreener.com/base/0x25e2dae20f0b251a4ccf5ac1ff04c9a24e7c0140"
                }
                target="_blank"
              >
                Chart
              </Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
        <Link to={"/"}>
          <img
            src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
            alt=""
            className="size-6 rounded-full"
          />
        </Link>
      </div>

      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <Link to={"/new"} className="btn btn-ghost btn-circle">
            <CiWallet className="text-[20px]" />
          </Link>
        </button>
        <button className="btn btn-ghost btn-circle">
          <Link to={"/newswap"} className="btn btn-ghost btn-circle">
            <FaArrowsRotate className="text-[15px]" />
          </Link>
        </button>
      </div>
    </div>
  );
}

export default NewNavigation;
