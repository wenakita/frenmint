import React from "react";

function Faq() {
  return (
    <div className=" w-screen">
      <div className="collapse collapse-plus bg-neutral-950 border border-stone-900 ">
        <input type="radio" name="my-accordion-3" defaultChecked />
        <div className="collapse-title text-sm font-bold">What's Frenmint?</div>
        <div className="collapse-content">
          <p className="text-[10px] md:text-[14px] font-light font-mono text-white">
            FrenMint is an innovative platform that allows users to mint
            ERC-1155 NFTs through shares on the Friend.Tech platform. This
            article explores the features, benefits, and potential drawbacks of
            FrenMint, providing a comprehensive overview of its functionality
            and value proposition.
          </p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-neutral-950 border border-stone-900">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title text-sm font-bold">
          How do we benefit from Frenmint?
        </div>
        <div className="collapse-content">
          <p className="text-[10px] md:text-[14px] font-light font-mono text-white">
            FrenMint leverages the ERC-1155 token standard, which offers several
            advantages over traditional FriendTech shares while preserving
            features such as ETH backing and account verification through
            Twitter linkage . Using the ERC-1155 token standards, users can mint
            NFTs that are transferrable and tradable, providing greater
            flexibility and allowing users to interact with a broader ecosystem.
          </p>
        </div>
      </div>
      <div className="collapse collapse-plus bg-neutral-950 border border-stone-900">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title text-sm font-bold">Future Plans?</div>
        <div className="collapse-content text-[10px] md:text-[14px] font-light font-mono text-white">
          <p>
            As more defi protocols emerge our main goal is to increase $oooOOO
            holders overall liquidity through the interaction of other protocols
            that offer the best returns and profits
          </p>
        </div>
      </div>
    </div>
  );
}

export default Faq;
