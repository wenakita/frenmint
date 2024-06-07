import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
function NavBar() {
  const [oooPrice, setOooPrice] = useState(null);
  const navigate = useNavigate();
  const { logout, authenticated, user, ready } = usePrivy();
  const wallet = user?.wallet;
  const address = wallet?.address;
  useEffect(() => {
    if (!authenticated && !wallet) {
      navigate("/");
    }
  }, [authenticated, wallet]);
  useEffect(() => {
    fetch(
      "https://api.dexscreener.com/latest/dex/pairs/base/0x25E2DAe20f0b251a4cCF5AC1ff04C9A24E7c0140"
    )
      .then(async function (results) {
        const response = await results.json();
        return response;
      })
      .then(function (data) {
        setOooPrice(data.pairs[0].priceUsd);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
  return (
    <div
      className={`mt-1 w-[440px] border border-stone-800 p-2 rounded-xl text-[8px] ${authenticated && wallet ? "flex justify-between" : null}`}
    >
      {authenticated && wallet ? (
        <>
          <Link
            to={
              "https://app.uniswap.org/swap?outputCurrency=0xDDf7d080C82b8048BAAe54e376a3406572429b4e&chain=base"
            }
            target="_blank"
            className="flex justify-center p-5 gap-2"
          >
            <img
              src="https://dd.dexscreener.com/ds-data/tokens/base/0xddf7d080c82b8048baae54e376a3406572429b4e.png?size=lg&key=18ea46"
              alt=""
              className="w-8 h-8"
            />
            <h3 className="text-white mt-2 text-[10px]">{oooPrice}</h3>
          </Link>
          <Link
            to="/home"
            className="text-white text-center p-5 mt-2 font-bold"
          >
            Home
          </Link>
          {/* <Link to="*" className="text-white text-center p-5 mt-2 font-bold ">
            Notion
          </Link> */}

          <Link
            to="/pools"
            className="text-white text-center p-5 mt-2 font-bold "
          >
            Pools
          </Link>

          <Link
            to="/swap"
            className="text-white text-center p-5 mt-2 font-bold "
          >
            Swap
          </Link>

          <Menu>
            <MenuButton>
              <img
                src="https://enterprisefilmsllc.com/wp-content/uploads/2018/07/white-down-arrow-png-2.png"
                alt=""
                className="w-3 h-3 me-2"
              />
            </MenuButton>
            <MenuItems
              anchor="bottom"
              className={`border border-stone-800 rounded-lg p-2 bg-black grid grid-flow-row hover:${console.log("hoveed")}`}
            >
              <MenuItem className="text-white text-center p-1 mt-1 font-bold text-[8px]">
                <Link
                  to={"/balances"}
                  className="text-white text-center p-1 mt-2 font-bold"
                >
                  Balance
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to={"/my-pools"}
                  className="text-white text-center p-1 mt-2 font-bold text-[8px]"
                >
                  My Pools
                </Link>
              </MenuItem>

              <MenuItem>
                <Link
                  to={"/icnu"}
                  className="text-white text-center p-1 mt-2 font-bold text-[8px]"
                >
                  Incubator
                </Link>
              </MenuItem>
            </MenuItems>
          </Menu>

          <div className="grid grid-flow-row me-3">
            <button
              className="text-white p-2 h-[30px]  mt-[19.5px] border border-stone-700 rounded-xl"
              onClick={logout}
            >
              <div>Logout</div>
            </button>
            <div className="text-white text-center">
              {address.slice(0, 3) +
                "..." +
                address.slice(address.length - 3, address.length)}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default NavBar;
