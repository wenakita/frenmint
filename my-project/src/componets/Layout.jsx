import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecentTx from "./RecentTx";
import LiveChat from "./LiveChat";
function Layout() {
  const navigate = useNavigate();
  const params = useParams();
  console.log(params.address);
  const { authenticated, user, ready } = usePrivy();
  const wallet = user?.wallet;
  useEffect(() => {
    if (!authenticated && !wallet) {
      navigate("/");
    }
  }, [authenticated, wallet]);
  return (
    <div className="container">
      <div className="flex justify-center">
        {authenticated && ready ? <NavBar /> : null}
      </div>

      {authenticated && wallet ? (
        <>
          <div className="flex justify-center p-3 gap-2">
            <SearchBar />
            <LiveChat />
          </div>
        </>
      ) : null}

      <div className="">
        <Outlet />
      </div>
      {/* <footer className="mt-5 border border-slate-500 p-2">
        <div className="flex justify-between">
          <img
            src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
            alt=""
            className="w-10 h-10"
          />
          <h3 className="text-white font-mono text-[10px] mt-3">
            @2024 Goddog
          </h3>
        </div>
      </footer> */}
    </div>
  );
}

export default Layout;
