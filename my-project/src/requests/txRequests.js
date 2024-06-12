export async function aprroveGoddog() {}

export async function wrapToken(
  shareContract,
  amountToBuy,
  finalAmount,
  shareAddress,
  parseEther
) {
  try {
    console.log(amountToBuy, shareAddress, finalAmount);

    const res = await shareContract.wrap(
      shareAddress,
      Number(amountToBuy),
      "0x",
      {
        value: parseEther(String(finalAmount)),
      }
    );
    const receipt = await res.wait();
    console.log(await receipt);
    return receipt;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getShareSupply(readContract, config, abi, shareAddress) {
  try {
    const supply = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: abi,
      functionName: "totalSupply",
      args: [shareAddress],
    });
    console.log(supply);
    return Number(supply);
  } catch (error) {
    console.log(error);
  }
}

export async function getShareBuyTotal(
  readContract,
  config,
  abi,
  shareAddress,
  amount
) {
  try {
    const buyTotal = await readContract(config, {
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      abi: abi,
      functionName: "getBuyPriceAfterFee",
      args: [shareAddress, amount],
    });

    console.log(Number(buyTotal) / 10 ** 18);
    return Number(buyTotal) / 10 ** 18;
  } catch (error) {
    console.log(error);
  }
}

export async function getShareSellTotal(
  readContract,
  config,
  abi,
  shareAddress,
  amount
) {
  try {
    const sellTotal = await readContract(config, {
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      abi: abi,
      functionName: "getSellPriceAfterFee",
      args: [shareAddress, amount],
    });
    console.log(sellTotal);
    console.log(Number(sellTotal) / 10 ** 18);
    return Number(sellTotal) / 10 ** 18;
  } catch (error) {
    console.log(error);
  }
}

export async function getShareBalance(readContract, config, abi, owner, nftId) {
  try {
    const balance = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: abi,
      functionName: "balanceOf",
      args: [owner, nftId],
    });
    console.log(balance);
    return Number(balance);
  } catch (error) {
    console.log(error);
  }
}

export async function getFinalWrapTotal(
  readContract,
  config,
  friendWrapperAbi,
  shareAddress,
  amountToBuy
) {
  try {
    console.log(shareAddress);
    console.log(String(amountToBuy * Math.pow(10, 18)));
    const finalToPay = await readContract(config, {
      abi: friendWrapperAbi,
      address: "0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4",
      functionName: "getBuyPriceAfterFee",
      args: [shareAddress, amountToBuy],
    });
    console.log(Number(finalToPay) / 10 ** 18);
    return Number(finalToPay) / 10 ** 18;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getShareUri(readContract, config, abi, nftId) {
  try {
    const uriResult = await readContract(config, {
      address: "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      abi: abi,
      functionName: "uri",
      args: [nftId],
    });
    return uriResult.slice(28, uriResult.length);
  } catch (error) {
    console.log(error);
  }
}

export async function getSingleBuyNftPrice(
  readContract,
  config,
  abi,
  nftId,
  poolAddress
) {
  try {
    const buyQuoteResult = await readContract(config, {
      address: poolAddress,
      abi: abi,
      functionName: "getSellNFTQuote",
      args: [nftId, "1"],
    });
    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
    const output = Number(buyQuoteResult[3]) / 10 ** 18;
    return Number(output.toFixed(2));
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getSingleSellNftPrice(
  readContract,
  config,
  abi,
  nftId,
  poolAddress
) {
  try {
    const buyQuoteResult = await readContract(config, {
      address: poolAddress,
      abi: abi,
      functionName: "getBuyNFTQuote",
      args: [nftId, "1"],
    });
    const output = Number(buyQuoteResult[3]) / 10 ** 18;

    //index 0 is the error (ignore), index 1, is the new spot price after the buy is complete, index 2 is the new delta, index 3 is the goddog price to buy the share currently, index 4 is the protocol fee charged, index 5 is the royalty amount is zero
    return output.toFixed(2);
  } catch (error) {
    console.log(error);
  }
}
