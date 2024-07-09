import React from "react";
import { HiArrowPath } from "react-icons/hi2";
import { LuFileSymlink } from "react-icons/lu";
import { Link } from "react-router-dom";
import CardBuilder from "./CardBuilder";
import MiddleHome from "./MiddleHome";
function Hero(props) {
  const { heroData, recentTxs, trending } = props;
  return (
    <div className=" p-2 md:w-screen w-screen">
      <div className="grid grid-cols-1 gap-2 md:hidden ">
        <div className=" text-center font-bold font-mono mt-auto mb-auto  p-5 lg:p-20 md:p-10 ">
          <h3 className="text-white text-[18px] md:text-[25px] lg:text-[30px]">
            Empower Liquidity Through SocialFi
          </h3>
          <div className=" mt-auto mb-auto  me-4">
            <div className="grid grid-cols-6 size-[300px] mx-auto mt-5 h-[50px] gap-2">
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
              <div className=" -mr-4">
                <img
                  src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0xe9825fd47c5d863b1aecba3707abcc7c8b49b88d.jpg?Expires=1820497745&Key-Pair-Id=K11ON08J8XW8N0&Signature=JG-QtB~2XRfvNTTxsrXG-Eyq-vwuM991GHfKSf53iuumu4Fm4iaFO2wR~bt1Me~u3iX84nGQLA6E6bRAeP817KgTf2aQNHTXySq6k8oBODuvkPH~rnIB6G1EpAsId94rS3nqs~2GFJOMqeDuvCRzNwURx4PNjgel9sdxajxCxPR7g~D-LlHK~juE5xffekNZSGSf00xLHVAfcPqiQCbgVwKt3gA6KdhMXov-WrqVxgL8IlZYpOP4lujlGfPBVp~ygUhbtkbTjvx30w-c4cpSvxbmgLipzICWaVKFF~6sMAvcpQUNNguWXSUb~cdlqRQbFqLZ3edNjW9i~T2uflpG7Q__"
                  alt=""
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 size-[130px] mx-auto mt-4 h-[50px] gap-2">
              <div className=" -mr-4">
                <img
                  src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0xe9825fd47c5d863b1aecba3707abcc7c8b49b88d.jpg?Expires=1820497745&Key-Pair-Id=K11ON08J8XW8N0&Signature=JG-QtB~2XRfvNTTxsrXG-Eyq-vwuM991GHfKSf53iuumu4Fm4iaFO2wR~bt1Me~u3iX84nGQLA6E6bRAeP817KgTf2aQNHTXySq6k8oBODuvkPH~rnIB6G1EpAsId94rS3nqs~2GFJOMqeDuvCRzNwURx4PNjgel9sdxajxCxPR7g~D-LlHK~juE5xffekNZSGSf00xLHVAfcPqiQCbgVwKt3gA6KdhMXov-WrqVxgL8IlZYpOP4lujlGfPBVp~ygUhbtkbTjvx30w-c4cpSvxbmgLipzICWaVKFF~6sMAvcpQUNNguWXSUb~cdlqRQbFqLZ3edNjW9i~T2uflpG7Q__"
                  alt=""
                  className="rounded-full"
                />
              </div>{" "}
              <div className=" -mr-4">
                <img
                  src="https://d3egfmvgqzu76k.cloudfront.net/twitterPfps/0x04b512fee25f8817f4546661ad7b6eb3e4fb8ab4.jpg?Expires=1820496862&Key-Pair-Id=K11ON08J8XW8N0&Signature=E~Z3nMRvyTIG3Jr1C5WZxqDk1FJtB7vPUnnJdhOvOH-EkYJjt7X1GABHTA9hix0sxbKAxwAWDq--koGpjv5SeUaJBP2tWK6C9m0uMv6Xco8Zc92s1lIhSI43XtOIIwdAra3T3sb4rw8uX67uVMTCzsagsdjaAifnPh9isMGwEJazymJ0~1ei1xcYCD7TRY0meS9AscHvCJAuQYeSbK9-eJCKj-QoaWi6QOw3mWHzWYX-Dfd29gozhR~lvX3hDHjm91qZb1xyTpFD0u-ECcccdE~oCsdAzbSS1Y7~rUPhdwtDHQP29XxyK7Pw~y5WCM-1KBkSNYHxFdcrDup3oJ8tzA__"
                  alt=""
                  className="rounded-full"
                />
              </div>
              <div className=" -mr-4">
                <img
                  src="https://d3egfmvgqzu76k.cloudfront.net/pfp-images/0x7b202496c103da5bedfe17ac8080b49bd0a333f1/35134801v4w26w52w8?Expires=1820498701&Key-Pair-Id=K11ON08J8XW8N0&Signature=SSokwE9d6ctnISt2BkWA6n2t5QyQcDUHhwRW2DKEhiL7jJmvvEW5XJXnhY5-BOF-b-6IZtXovJWm2W09efthos9lgxc2pmF4lwxWKXxlHf3fV2AODNYDVAv5wh9fnCl5mz-m-hcl07xlmaxMHIMwyifdo1L7bgSJJu-5abbW-oBp0SRWjxUAPLinSRXU27NJ82ElP41Km4GqiVw5vfrS8ZaWy4VqsF2qZDU1IvA-LLtTqqwwQ5SJoVXfcadcVQNptj5EKPey~5erLeZfTtnLT319yOLDUnsmATYMC6-PyzrKffocyx7R5-bxfn--IYRXvVGQGPIR1kE3P5Mnzr8jQg__"
                  alt=""
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
          <h3 className="text-stone-300 text-[13px] md:text-[12px] lg:text-[14px] mt-8 text-center">
            FrenMint offers a cost-effective way to mint ERC-1155 NFTs via
            Friend.Tech shares, providing up to 38% higher revenue for hosts.
          </h3>

          <div className="relative inline-flex  group mt-5 md:mt-10">
            <div className="absolute transitional-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <Link
              to={"/newswap"}
              title="Get quote now"
              className="relative inline-flex items-center justify-center px-8 py-2  font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 text-[10px]"
              role="button"
            >
              Begin Minting
            </Link>
          </div>
        </div>

        {/* 
        <div className=" p-4 md:p-5 md:me-10 place-content-center ">
          {heroData ? (
            <>
              <div className="">
                <CardBuilder data={heroData} isHero={true} />
              </div>
            </>
          ) : null}
        </div> */}
      </div>
      <div className=" hidden md:block p-10">
        <div className="text-center">
          <h3 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold text-[40px] break">
            SocialFi in the palm of your hands
          </h3>
          <h3 className="text-gray-500 font-mono font-bold text-[15px] break-words md:w-[80%] lg:w-[50%] mx-auto">
            FrenMint offers a cost-effective way to buy Friend.Tech shares as
            ERC-1155 NFTs. Pairing the NFTs with our native ERC-20 token GODDOG
            ($oooOOO) enables us to provide 31% lower fees for traders and at
            the same time 38% more revenue for hosts aka liquidity providers.
          </h3>
        </div>
        <div className=" mt-4 w-[50%] mx-auto">
          <div className="flex justify-center gap-2 text-[12px]">
            <Link
              to={"https://telegra.ph/What-is-FrenMint-06-03"}
              target="_blank"
              className="border border-stone-900  w-[130px] rounded-lg bg-stone-900 p-1"
            >
              <div className="flex justify-center gap-1">
                <LuFileSymlink className="mt-0.5" />
                <h3>Docs</h3>
              </div>
            </Link>
            <Link
              to={"/swap"}
              className="border border-stone-900  w-[130px] rounded-lg bg-stone-900 p-1"
            >
              <div className="flex justify-center gap-1">
                <HiArrowPath className="mt-0.5" />
                <h3>Mint</h3>
              </div>
            </Link>
            <Link
              to={"https://telegra.ph/GODDOG-Official-Whitepaper-06-01"}
              target="_blank"
              className="border border-stone-900  w-[130px] rounded-lg bg-stone-900 p-1"
            >
              <div className="flex justify-center gap-1">
                <LuFileSymlink className="mt-0.5" />
                <h3>Whitepaper</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <MiddleHome trending={trending} recentTxs={recentTxs} />
      </div>
    </div>
  );
}

export default Hero;
