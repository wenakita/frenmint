import React, { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import { useBalance } from "wagmi";
import Socials from "../componets/NewHome/Socials";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Faq from "./NewHome/Faq";
import { getVolume } from "../requests/supaBaseHandler";
function Portal() {
  const navigate = useNavigate();
  const {
    login,
    logout,
    ready,
    authenticated,
    user,
    connectWallet,
    linkEmail,
  } = usePrivy();
  const wallet = user?.wallet;
  const address = wallet?.address;
  const userEthBalance = useBalance({
    address: wallet?.address,
  });
  const [data, setData] = useState(null);
  useEffect(() => {
    if ((authenticated && wallet) || (ready && authenticated)) {
      navigate("/home");
    }
  });
  useEffect(() => {
    Volume();
  }, []);

  async function Volume() {
    const res = await getVolume();
    setData(res);
  }

  return (
    <div className="mt-10 w-screen">
      <div className="flex justify-center mb-4">
        <img
          src="https://i.postimg.cc/qqhQyJgK/friendmint-removebg-preview.png"
          alt=""
          className="size-10"
        />
        <h3 className="text-center text-white font-mono font-bold mt-2 text-[20px]">
          Frenmint
        </h3>
      </div>
      <div className="text-center  text-white w-[400px] md:w-[500px] mx-auto text-[18px] md:text-[24px] font-bold font-mono">
        Trade for thousands of friend.tech users in a more cost-effective and
        efficient manner on Frenmint.
      </div>
      <div className="grid grid-cols-5 size-[200px] mx-auto mt-5 h-[50px] gap-2">
        <div className=" -mr-4">
          <img
            src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0x6a955d6d6cfaefbb7b2f1bf59e2552ac4a18d0d9.jpg?Expires=1820158091&Key-Pair-Id=K11ON08J8XW8N0&Signature=ikqTs1FKYcBsvKi8mw8df7DJ-Vd2W8OHW0sr9JVnki4JhYAvJXwjtNOUeBjGqnnDk46OHLc-JVQhSTfdrmFSxT5aOhfKEoendkdvHVD-zS9mgmctp~Ih4Gm94JMHA3leLq1KKdkNth~fMZnpesbSl5brD7lAlElG71zPvXJAv-N0OeLJJgS7NeA1CZO9HfzrRAjnMi2WpOeN0VPhhFatGJ8tDDz3muBaYusXNYrueClnm0BJSAlpQikoFEyGFDA9vxZf9dN9GFQezjkFIyJedz0wF53GqMMeh~RL7gPt36FTgzCbxzx-BD5PuyEaPcIrVN9~pWBpxUT0iZ-DRiLehg__"
            alt=""
            className="rounded-full"
          />
        </div>
        <div className=" -mr-4">
          <img
            src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0xd431a1666f9ce076c184a3d7dd1d07fad2df44b2.jpg?Expires=1820158091&Key-Pair-Id=K11ON08J8XW8N0&Signature=CQH2b0MVdrcfNb~86FUWmXDEZGAx~Z8hJ6rs4tZZ9tBP7aQs4x2AGjFFfv8dm5iy~fVbH-MGTtJEgtdKLF39b7V3ubJ7WHTY8MWfpN3fpiQ-oHg9CyoYWWE2Fpt4C41uM1doigeQlryKmLTPY1xr3sYcl08OuGMpefabsgKwSyryOTWKqo9xTRKp6SA-to6iIR-P~5P4LK034v0v76KX2ZiTWSpt6y1-O~GOC2XdCg6RndAPrR3GuEoyhp5UZtKdJdJvjmNqH1lVa-e5RwEiXmnlGsJ8Y0bstOKCuVFTx8QlZA5OT~slbWjm9GSjkkI776CPyR6zhSuxydd6PqHZlA__"
            alt=""
            className="rounded-full"
          />
        </div>
        <div className=" -mr-4">
          <img
            src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0x39a3f21b712d8f93e37d30376680d789ff3e9167.jpg?Expires=1820158132&Key-Pair-Id=K11ON08J8XW8N0&Signature=aOxw2o69b13zZNhLikW7Xwwo~pQNajz7SmLR3khMJ1Evi7XQ3MvXUm1D-7DgKPPivlGmrahb0y-NTdg2uo8MpU7CGN04B2Ag1sgetviVjyQFwARrlDbwjICCqYLvYcMcUv01pZS-foI3wXmbSFlK0Dra8P0BbwrQZg3fMojn8boNPPSGu~UQotgsnY9DZh9TVmwYWY7tadG9geBi4-vOI6J4DuFxuoiyb8GUbkHO43ccXFRE325k9jym3mtQhruXV9CjMR1RIJrYhsf44uIX7T94yqXGnbGjiul2CGVvwXy1DFjti1jJfg-O5IFcCvR1k~3Puq~lVA-Fo-ez8r2-ZQ__"
            alt=""
            className="rounded-full"
          />
        </div>
        <div className=" -mr-4">
          <img
            src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0xe662b210d547966eb33b391b9a8292d2a87b5f69.jpg?Expires=1820158156&Key-Pair-Id=K11ON08J8XW8N0&Signature=AM5ccP7q33PLBXbDHQqSw8lyHd2LZh0obN1sPKutV1F0GjmfbtBzb5lvzSEF4g1ZhizpNqp84iE5mbLcBj4X7qd5lrTJd00wdwZzbI8W9HOhznmN1TU~UAkfYOpAPkT4jTao7wtcMHl2P8Rm2mb4BokB63PMRfj1yrNCx7JB2Y0lFu9QChR5ZjHsx7UQJ9KrejLGSM-f0YsZSy4go~cSt5A8C~b7hZTiso-vsukd0iE1k~vkaX1MlPlrf4IM0nyet~ZudsbRkPV9BUtTbccy8MGokMNKj1el~6qc~5JzDvuUpl7b9A9yGNeu4JrJEHA-PAbXZizr6Fb3S74zDpe4Gg__"
            alt=""
            className="rounded-full"
          />
        </div>
        <div className=" -mr-4">
          <img
            src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0x3c2c38a354f72d0d5cd1ac4b77bf7b0d86d0f80a.jpg?Expires=1820158061&Key-Pair-Id=K11ON08J8XW8N0&Signature=kIUmtlMoiJWct1Usb7TbhVbERF-AGlIaUrnu2Q4FZusLO9N5etbPwnOReuwEj03DJmJYv3s~zCwtVKiD8lBL4H646BsUznyrmozHh082UJMz8BkJSI7CcinDc3GdA9UBePTNB8WYgwNcw4UNy8TKYOC5fganvo6tidqCD1Qz0Niorv7~1ZA9JRilGMX-MIH80DI77hhDjJ0yaVm3yxUDRQiB3w6AG1ywyeeA5QqwE3ub3YSCSsnQaiulFYYjvAG0GU8DaSToHAli2P8EgDnmhpTN4R~GB-sJBPVus47sF6pWa5~MPHjDIck2bj-jhCoZr679F0~4LkDjDN5H5gCZ7g__"
            alt=""
            className="rounded-full"
          />
        </div>
      </div>
      <div className=" mt-2">
        <div className="flex justify-center gap-1">
          <h3 className="text-white font-mono font-bold text-[10px] mt-1">
            Exculsivley on
          </h3>
          <img
            src="https://avatars.githubusercontent.com/u/108554348?s=280&v=4"
            alt=""
            className="size-5 "
          />
        </div>
      </div>

      <div>
        <h3 className="text-[10px] mt-4 font-mono  text-gray-200 max-w-[300px] text-center mx-auto">
          FrenMint offers a cost-effective way to mint ERC-1155 NFTs via
          Friend.Tech shares, providing up to 38% higher revenue for hosts.
        </h3>
        <div className="flex mx-auto mt-10 text-[14px] w-[400px] p-8  ">
          <div className=" rounded-box grid flex-grow place-items-center">
            <div className="grid grid-rows-2">
              <div className="text-white whitespace-nowrap font-mono font-bold">
                Shares Minted
              </div>
              <div className="text-white whitespace-nowrap font-mono font-bold text-[12px]">
                {data?.sharesTransacted}
              </div>
            </div>
          </div>
          <div className="divider divider-horizontal h-12"></div>
          <div className=" grid  flex-grow place-items-center">
            <div className="grid grid-rows-2">
              <div className="text-white whitespace-nowrap font-mono font-bold">
                Total Users
              </div>
              <div className="text-white whitespace-nowrap font-mono font-bold text-[12px]">
                {data?.users}
              </div>
            </div>
          </div>
          <div className="divider divider-horizontal h-12"></div>
          <div className=" grid  flex-grow place-items-center">
            <div className="grid grid-rows-2">
              <div className="text-white whitespace-nowrap font-mono font-bold">
                ETH Volume
              </div>
              <div className="text-white whitespace-nowrap font-mono font-bold text-[12px]">
                {Number(data?.volume).toFixed(2)} Ξ
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" grid  grid-cols-1 md:grid-cols-2 mt-10 max-w-[65%] mx-auto gap-2 font-bold text-[12px] lg:text-[14px] font-mono">
        <div className="border text-white bg-neutral-950 rounded-md border-stone-900 p-5">
          <div className="flex justify-between ">
            <div className="mt-1">
              <h3>31% lower fees</h3>
            </div>
            <div>
              <IoMdCheckmarkCircleOutline className="text-[14px] text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="border text-white bg-neutral-950 rounded-md  border-stone-900 p-5">
          <div className="flex justify-between ">
            <div className="mt-1">
              <h3>Create LP's for friend shares</h3>
            </div>
            <div>
              <IoMdCheckmarkCircleOutline className="text-[14px] text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="border text-white bg-neutral-950 rounded-md  border-stone-900 p-5">
          <div className="flex justify-between ">
            <div className="mt-1">
              <h3>Earn additonal revenue from shares</h3>
            </div>
            <div>
              <IoMdCheckmarkCircleOutline className="text-[14px] text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="border text-white bg-neutral-950 rounded-md  border-stone-900 p-5">
          <div className="flex justify-between ">
            <div className="mt-1">
              <h3>Wrap LPs into ERC-721s</h3>
            </div>
            <div>
              <IoMdCheckmarkCircleOutline className="text-[14px] text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Faq />
      </div>
      <div className="mt-10">
        <Socials />
      </div>
    </div>
  );
}

// {(authenticated && wallet) || (ready && authenticated) ? (
//   <button
//     className="border border-slate-500 rounded-lg text-white p-2 text-[20px] hover:bg-white hover:text-black"
//     onClick={logout}
//   >
//     Logout
//   </button>
// ) : (
//   <>
//     <button
//       className="border border-stone-800 bg-neutral-900 rounded-lg text-white p-2 text-[15px] font-bold hover:bg-white hover:text-black"
//       onClick={login} nm
//     >
//       FrenMint login
//     </button>
//   </>
// )}

export default Portal;

//https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0x3c2c38a354f72d0d5cd1ac4b77bf7b0d86d0f80a.jpg?Expires=1820158061&Key-Pair-Id=K11ON08J8XW8N0&Signature=kIUmtlMoiJWct1Usb7TbhVbERF-AGlIaUrnu2Q4FZusLO9N5etbPwnOReuwEj03DJmJYv3s~zCwtVKiD8lBL4H646BsUznyrmozHh082UJMz8BkJSI7CcinDc3GdA9UBePTNB8WYgwNcw4UNy8TKYOC5fganvo6tidqCD1Qz0Niorv7~1ZA9JRilGMX-MIH80DI77hhDjJ0yaVm3yxUDRQiB3w6AG1ywyeeA5QqwE3ub3YSCSsnQaiulFYYjvAG0GU8DaSToHAli2P8EgDnmhpTN4R~GB-sJBPVus47sF6pWa5~MPHjDIck2bj-jhCoZr679F0~4LkDjDN5H5gCZ7g__
//https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0x6a955d6d6cfaefbb7b2f1bf59e2552ac4a18d0d9.jpg?Expires=1820158091&Key-Pair-Id=K11ON08J8XW8N0&Signature=ikqTs1FKYcBsvKi8mw8df7DJ-Vd2W8OHW0sr9JVnki4JhYAvJXwjtNOUeBjGqnnDk46OHLc-JVQhSTfdrmFSxT5aOhfKEoendkdvHVD-zS9mgmctp~Ih4Gm94JMHA3leLq1KKdkNth~fMZnpesbSl5brD7lAlElG71zPvXJAv-N0OeLJJgS7NeA1CZO9HfzrRAjnMi2WpOeN0VPhhFatGJ8tDDz3muBaYusXNYrueClnm0BJSAlpQikoFEyGFDA9vxZf9dN9GFQezjkFIyJedz0wF53GqMMeh~RL7gPt36FTgzCbxzx-BD5PuyEaPcIrVN9~pWBpxUT0iZ-DRiLehg__
//https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0xd431a1666f9ce076c184a3d7dd1d07fad2df44b2.jpg?Expires=1820158091&Key-Pair-Id=K11ON08J8XW8N0&Signature=CQH2b0MVdrcfNb~86FUWmXDEZGAx~Z8hJ6rs4tZZ9tBP7aQs4x2AGjFFfv8dm5iy~fVbH-MGTtJEgtdKLF39b7V3ubJ7WHTY8MWfpN3fpiQ-oHg9CyoYWWE2Fpt4C41uM1doigeQlryKmLTPY1xr3sYcl08OuGMpefabsgKwSyryOTWKqo9xTRKp6SA-to6iIR-P~5P4LK034v0v76KX2ZiTWSpt6y1-O~GOC2XdCg6RndAPrR3GuEoyhp5UZtKdJdJvjmNqH1lVa-e5RwEiXmnlGsJ8Y0bstOKCuVFTx8QlZA5OT~slbWjm9GSjkkI776CPyR6zhSuxydd6PqHZlA__
//https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0x39a3f21b712d8f93e37d30376680d789ff3e9167.jpg?Expires=1820158132&Key-Pair-Id=K11ON08J8XW8N0&Signature=aOxw2o69b13zZNhLikW7Xwwo~pQNajz7SmLR3khMJ1Evi7XQ3MvXUm1D-7DgKPPivlGmrahb0y-NTdg2uo8MpU7CGN04B2Ag1sgetviVjyQFwARrlDbwjICCqYLvYcMcUv01pZS-foI3wXmbSFlK0Dra8P0BbwrQZg3fMojn8boNPPSGu~UQotgsnY9DZh9TVmwYWY7tadG9geBi4-vOI6J4DuFxuoiyb8GUbkHO43ccXFRE325k9jym3mtQhruXV9CjMR1RIJrYhsf44uIX7T94yqXGnbGjiul2CGVvwXy1DFjti1jJfg-O5IFcCvR1k~3Puq~lVA-Fo-ez8r2-ZQ__
//https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0xe662b210d547966eb33b391b9a8292d2a87b5f69.jpg?Expires=1820158156&Key-Pair-Id=K11ON08J8XW8N0&Signature=AM5ccP7q33PLBXbDHQqSw8lyHd2LZh0obN1sPKutV1F0GjmfbtBzb5lvzSEF4g1ZhizpNqp84iE5mbLcBj4X7qd5lrTJd00wdwZzbI8W9HOhznmN1TU~UAkfYOpAPkT4jTao7wtcMHl2P8Rm2mb4BokB63PMRfj1yrNCx7JB2Y0lFu9QChR5ZjHsx7UQJ9KrejLGSM-f0YsZSy4go~cSt5A8C~b7hZTiso-vsukd0iE1k~vkaX1MlPlrf4IM0nyet~ZudsbRkPV9BUtTbccy8MGokMNKj1el~6qc~5JzDvuUpl7b9A9yGNeu4JrJEHA-PAbXZizr6Fb3S74zDpe4Gg__
