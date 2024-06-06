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
