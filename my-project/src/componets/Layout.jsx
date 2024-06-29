import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecentTx from "./RecentTx";
import LiveChat from "./LiveChat";
import NewNavigation from "./NewHome/NewNavigation";
import TopSlider from "./NewHome/TopSlider";
import { supabase } from "../client";
import { useAccount } from "wagmi";

function Layout() {
  const { logout, authenticated, user, ready } = usePrivy();

  const { address, chainId, isConnecting, isDisconnected } = useAccount();
  const navigate = useNavigate();
  const params = useParams();
  const wallet = user?.wallet;
  const [input, setInput] = useState(null);
  useEffect(() => {
    console.log("chain id:", chainId);
    if (chainId !== 8453) {
      if (authenticated && wallet) {
        document.getElementById("my_modal_300").showModal();
      }
    }

    if (!authenticated && !wallet) {
      navigate("/");
    } else {
      getUsers();
    }
  }, [authenticated, wallet]);

  async function getUsers() {
    let hasUserName = false;
    const { data, error } = await supabase.from("usernames").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      for (const key in data) {
        if (data[key]?.user_address === wallet?.address) {
          hasUserName = true;
        }
      }

      if (!hasUserName) {
        document.getElementById("my_modal_69").showModal();
      } else {
        document.getElementById("my_modal_69").close();
      }
    }
  }

  async function createUserName() {
    try {
      await supabase
        .from("usernames")
        .insert([
          {
            user_address: wallet?.address,
            username: input,
          },
        ])
        .single();
      getUsers();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container touch-pan-y">
      <dialog id="my_modal_300" className="modal">
        <div className="modal-box bg-neutral-900">
          <div className="flex gap-1">
            <img
              src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
              alt=""
              className="size-6"
            />
            <h3 className="font-bold text-[15px] text-red-500">
              Wrong chain warning
            </h3>
          </div>
          <div className="p-4">
            <p className="font-mono font-bold whitespace-nowrap text-[11px] text-center">
              You are currently on a chain that is not available on frenmint
            </p>
            <p className=" font-bold whitespace-nowrap text-[8px] text-center">
              log out and Switch to base chain before logging in to completing
              any transaction on frenmint
            </p>
          </div>
          <div className="\">
            <button
              className="w-full border bg-blue-600 hover:bg-stone-800 rounded-lg text-white border-stone-500 text-[10px] p-1 font-mono font-bold"
              onClick={() => {
                logout();
                document.getElementById("my_modal_300").close();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </dialog>

      {/*  */}
      <dialog id="my_modal_69" className="modal ">
        <div className="modal-box bg-neutral-900">
          <div className="flex">
            <img
              src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
              alt=""
              className="size-6"
            />
            <h3 className="text-[12px] font-bold mt-1">Create a username</h3>
          </div>
          <div className="mt-3 p-2">
            <h3 className="text-[10px]">Username:</h3>
            <input
              type="text"
              className="w-full rounded-lg mt-1 text-[12px] p-1 "
              placeholder="Name goes here..."
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <div className="mt-2">
              <button
                className="w-full border border-stone-900 bg-blue-500 rounded-lg text-white font-bold p-1 text-[10px]"
                onClick={() => {
                  if (input?.length > 0) {
                    createUserName();
                  }
                }}
              >
                Create username
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <div className="">
        <NewNavigation />
      </div>
      {/* {authenticated && wallet ? <NavBar /> : null} */}

      {authenticated && wallet ? (
        <>
          {/* <div className="flex justify-end me-[80px] sm:me-[120px] md:me-[200px] lg:me-[310px] xl:me-[440px]">
            <LiveChat />
          </div> */}
        </>
      ) : null}
      {/* <div className="">
        <RecentTx />
      </div> */}

      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
