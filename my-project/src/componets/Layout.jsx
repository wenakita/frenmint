import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecentTx from "./RecentTx";
import LiveChat from "./LiveChat";
import NewNavigation from "./NewHome/NewNavigation";
import TopSlider from "./NewHome/TopSlider";
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
      <div className="">
        <RecentTx />
      </div>

      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
