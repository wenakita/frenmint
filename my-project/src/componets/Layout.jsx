import { Outlet, useLocation } from "react-router-dom";
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
import TrendingCarousel from "./TrendingCarousel";
import { GetTrendingFriends } from "../requests/friendCalls";

function Layout() {
  const { logout, authenticated, user, ready } = usePrivy();

  const { address, chainId, isConnecting, isDisconnected } = useAccount();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  console.log(location?.pathname === "/");
  //it should not equal "/"

  const wallet = user?.wallet;
  const [input, setInput] = useState(null);
  const [trending, setTrending] = useState(null);

  useEffect(() => {
    if (!authenticated && !wallet) {
      navigate("/");
    } else {
      getTrending();
      getUsers();
    }
  }, [authenticated, wallet]);

  async function getTrending() {
    const result = await GetTrendingFriends();
    setTrending(result);
  }

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
            img_url:
              fileUrl ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk3BEiUjewgdlaP0T1JRZXBbeB4RjAXnz_Tg&s",
          },
        ])
        .single();
      getUsers();
    } catch (error) {
      console.log(error);
    }
  }

  const [fileUrl, setFileUrl] = useState(null);
  //this how we store files
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

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
            <p className="font-mono font-bold whitespace-nowrap text-[10px] text-center">
              {chainId === 8453
                ? "Make sure you are on base chain before completing transactions on frenmint"
                : "You are currently on a chain that is not available on frenmint"}
            </p>
            <p className=" font-bold whitespace-nowrap text-[8px] text-center">
              Switch to base chain before logging in to completing any
              transaction on frenmint
            </p>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
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
            <div className="mb-2">
              <div className="flex gap-2">
                {fileUrl && (
                  <img
                    src={fileUrl}
                    alt=""
                    className="size-14 border rounded-full border-stone-700"
                  />
                )}
                <div className="mt-[17px] text-white font-bold  text-[14px]">
                  {input && <h3>{input}</h3>}
                </div>
              </div>
            </div>
            <h3 className="text-[10px] mt-4">Username:</h3>
            <input
              type="text"
              className="w-full rounded-lg mt-1 text-[12px] p-1 "
              placeholder="Enter Name..."
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <div className="mb-2 mt-4">
              <h3 className="text-[10px]">Profile picture:</h3>

              <input
                type="file"
                className="border file-input-primary rounded-lg w-full text-white bg-stone-800 text-[10px] font-bold"
                onChange={handleFileChange}
              />
            </div>

            <div className="mt-5">
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
      {location?.pathname !== "/" ? (
        <div>
          <TrendingCarousel trending={trending} />
        </div>
      ) : null}

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
