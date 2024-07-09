import { Contract, ethers } from "ethers";
import { parseEther } from "viem";
import friendTechABI from "../../../abi/FriendTechABi";
import SudoSwapPoolTXABI from "../../../abi/SudoSwapPoolTXABI";
import { uintFormat } from "../../../requests/friendCalls";
import {
  approveFriendSpending,
  approveGoddogSpending,
  approveShareSpending,
  checkShareApproval,
} from "../../../requests/txRequests";
import {
  postPoolTxData,
  postTransaction,
} from "../../../requests/supaBaseHandler";
import { useBalance } from "wagmi";
import SudoSwapABI from "../../../abi/SudoSwapABI";
import { getEthPrice } from "../../../requests/priceCalls";
const wrapperContract = "0xbeea45F16D512a01f7E2a3785458D4a7089c8514";
const failedTxMessage = {
  failed: true,
  receipt: null,
  type: "Wrap",
  message: `Transaction has been reverted please make sure to have enough gas to complete`,
  icon: "o",
};

//target for tommorow fix this files fucntion and make sure right parameters are passed into buy and sell types as well as mint and check each of the function it calls
//to make sure it calls the right things and properly calls the contract
export async function detectTxType(
  signer,
  type,
  params,
  owner,
  balance,
  poolGoddogbalance,
  wallet,
  share
) {
  console.log(share);
  console.log(params);
  console.log(wallet);
  let res;
  type = String(type).toLowerCase();

  switch (type) {
    case "mint":
      res = await wrap(signer, params, wallet?.address);
      console.log(res);

      console.log(params);
      break;
    case "burn":
      res = await unwrap(signer, params, wallet?.address);

      console.log(params);

      break;
    case "buy":
      //pool addy 0, amount 1,buy or sell price total 2, spot price[3],
      res = await checkTX(
        signer,
        type,
        params,
        owner,
        balance,
        poolGoddogbalance,
        wallet,
        share
      );

      break;
    case "sell":
      res = await checkTX(
        signer,
        type,
        params,
        owner,
        balance,
        poolGoddogbalance
      );

      break;
    case "pool":
      res = await checkTX(
        signer,
        type,
        params,
        owner,
        balance,
        poolGoddogbalance,
        wallet,
        share
      );
      break;
  }
  return res;
}

async function checkTX(
  signer,
  type,
  params,
  owner,
  balance,
  poolGoddogBalance,
  wallet,
  share
) {
  //idea for sell check thepool addresses goddog balance to see if it has enough goddog to give to user
  let output;
  if (type === "buy") {
    console.log(params[0]?.sudoSwapData?.tokenAddress);
    const ERC20Pair = await detectERC20(
      wallet,
      params[0]?.sudoSwapData?.tokenAddress
    );
    console.log(params);
    console.log(ERC20Pair);
    console.log(Number(balance), Number(params[2]));
    output = await buyPool(signer, type, params, owner, balance);
  }
  if (type === "sell") {
    output = await sellPool(signer, type, params, owner, balance);
  }
  if (type == "pool") {
    console.log(balance, params?.depositAmount);
    console.log(params);
    console.log(params?.ERC20Address);
    const ERC20Pair = await detectERC20(wallet, params?.ERC20Address);
    console.log(ERC20Pair);
    if (
      Number(balance) < Number(params?.depositAmount) &&
      Number(ERC20Pair?.balance) < Number(params?.LP)
    ) {
      console.log(true);
      output = failedTxMessage;
    } else {
      console.log("doing");
      output = await createPool(signer, type, ERC20Pair, params, owner, share);
    }
  }

  return output;
}

async function detectERC20(wallet, targetERC20) {
  console.log(targetERC20);
  let output;
  console.log(wallet?.goddogbalance);
  console.log(wallet?.friendBalance);

  const balances = [
    wallet?.friendBalance,
    wallet?.goddogbalance,
    wallet?.ethBalance,
  ];
  console.log(balances);
  console.log(targetERC20?.name);
  switch (targetERC20?.name) {
    case "Friend":
      console.log("friend");
      console.log(balances[0]);
      output = {
        balance: balances[0],
        ...targetERC20,
      };
      break;
    case "oooOOO":
      console.log("o");
      console.log(balances[1]);

      output = {
        balance: balances[1],
        ...targetERC20,
      };
      break;
  }
  console.log(output);
  return output;
}

async function unwrap(signer, params, caller) {
  console.log(params);
  const ca = new Contract(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    friendTechABI,
    signer
  );
  try {
    const res = await ca.unwrap(params[0]?.address, params[1]);
    const receipt = await res.wait();
    await postTransaction(
      params[0],
      params[1],
      caller,
      false,
      uintFormat(params[0]?.displayPrice) * Number(params[1])
    );
    return {
      failed: false,
      receipt: receipt,
      message: `${params[1]} ${params[0]?.ftName} has been burned successfully`,
      icon: true,
    };
  } catch (error) {
    console.log(error);
    return {
      failed: true,
      receipt: null,
      type: "Unwrap",
      message: `Transaction has been reverted please make sure to have enough gas to complete`,
      icon: false,
    };
  }
}

async function wrap(signer, params, caller) {
  console.log(params);
  const ca = new Contract(
    "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
    friendTechABI,
    signer
  );
  try {
    const res = await ca.wrap(params[0]?.address, Number(params[1]), "0x", {
      value: parseEther(String(params[2])),
    });
    const receipt = await res.wait();
    await postTransaction(
      params[0],
      params[1],
      caller,
      true,
      uintFormat(params[0]?.displayPrice) * Number(params[1])
    );
    return {
      failed: false,
      receipt: receipt,
      message: `${params[1]} ${params[0]?.ftName} has been minted successfully`,
      icon: true,
    };
  } catch (error) {
    console.log(error);
    return {
      failed: true,
      receipt: null,
      type: "Wrap",
      message: `Transaction has been reverted please make sure to have enough gas to complete`,
      variant: "red",
      icon: false,
    };
  }
}

export async function sellPool(signer, type, params, owner) {
  const constructedParam = await constructParam(type, params, owner);
  console.log(params, owner);
  const isAppoved = await checkShareApproval(
    owner,
    "0xa07eBD56b361Fe79AF706A2bF6d8097091225548"
  );
  console.log(isAppoved);
  if (!isAppoved) {
    await approveShareSpending(
      signer,
      "0xa07eBD56b361Fe79AF706A2bF6d8097091225548"
    );
  }
  const sudoSwapContract = new Contract(
    "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
    SudoSwapPoolTXABI,
    signer
  );
  try {
    const res = await sudoSwapContract.swap(constructedParam, {
      gasLimit: 350000,
    });
    const reciept = await res.wait();
    console.log(reciept);
    await postPoolTxData(params, owner, false);
    return {
      failed: false,
      receipt: reciept,
      message: `${params[1]} ${params[0]?.ftName} has been sold successfully`,
      icon: true,
    };
  } catch (error) {
    console.log(error);
    return {
      failed: false,
      receipt: null,
      message: `The sale of ${params[0]?.ftName} has been reverted`,
      icon: false,
    };
  }
}

export async function buyPool(signer, type, params, owner) {
  const constructedParam = await constructParam(type, params, owner);
  console.log(params[0]?.sudoSwapData?.tokenAddress);

  if (
    params[0]?.sudoSwapData?.tokenAddress ===
    "0x0bd4887f7d41b35cd75dff9ffee2856106f86670"
  ) {
    await approveFriendSpending(
      signer,
      "0xa07eBD56b361Fe79AF706A2bF6d8097091225548"
    );
  } else {
    console.log("ooo");
    await approveGoddogSpending(
      signer,
      "0xa07eBD56b361Fe79AF706A2bF6d8097091225548"
    );
  }

  console.log(constructedParam);

  const sudoSwapContract = new Contract(
    "0xa07eBD56b361Fe79AF706A2bF6d8097091225548",
    SudoSwapPoolTXABI,
    signer
  );
  try {
    console.log("doing");
    const res = await sudoSwapContract.swap(constructedParam, {
      gasLimit: 350000,
    });
    const reciept = await res.wait();
    console.log(reciept);
    await postPoolTxData(params, owner, true);

    return {
      failed: false,
      receipt: reciept,
      message: `${params[1]} ${params[0]?.ftName} has been bought successfully`,
      icon: true,
    };
  } catch (error) {
    console.log(error);
    return {
      failed: false,
      receipt: null,
      message: `The purchase of ${params[0]?.ftName} has been reverted`,
      icon: false,
    };
  }
}

//pool addy 0, amount 1,buy or sell price total 2, spot price[3],
async function constructParam(type, params, caller) {
  console.log(params);
  console.log(params[0]?.sudoSwapData?.spotPrice);
  let deformattedTotal;
  console.log(params[2]);
  console.log(params[0]?.sudoSwapData?.address);
  console.log(caller);
  console.log(uintFormat(deformattedTotal));
  let param;
  if (type === "buy") {
    deformattedTotal = BigInt(Number(params[2]) * 10 ** 18);

    console.log(
      params[1],
      params[2],
      params[0]?.sudoSwapData?.address,
      uintFormat(params[0]?.sudoSwapData?.spotPrice)
    );
    param = [
      [
        [
          params[0]?.sudoSwapData?.address, // pool address
          false,
          [String(params[1])], //amount to buy
          ethers.BigNumber.from(String(deformattedTotal)), //buy price total
          "0",
          ethers.BigNumber.from(String(params[0]?.sudoSwapData?.spotPrice)), //pools current spot price
          [ethers.BigNumber.from(String(deformattedTotal))], //buy price total
        ],
      ],
      [],
      String(caller), //userAddy
      String(caller), //userAddy
      false,
    ];
  } else if (type === "sell") {
    deformattedTotal = BigInt(Number(params[2]) * 10 ** 18);
    console.log(params[0]?.sudoSwapData?.address, params[1], params[2]);
    param = [
      [],
      [
        [
          params[0]?.sudoSwapData?.address, // pool address
          false,
          false,
          [String(params[1])],
          false,
          "0x",
          ethers.BigNumber.from(String(deformattedTotal)), //sell price
          ethers.BigNumber.from(String(params[0]?.sudoSwapData?.spotPrice)),
          [ethers.BigNumber.from(String(deformattedTotal))], // sell price
        ],
      ],
      String(caller),
      String(caller),
      false,
    ];
  } else if (type === "pool") {
    const spotPrice = BigInt(params?.spotPrice * 10 ** 18);
    const tokenBalance = BigInt(params?.intialTokenBalance * 10 ** 18);
    console.log(params?.ERC20?.address);

    param = [
      params?.ERC20?.address,
      "0xbeea45F16D512a01f7E2a3785458D4a7089c8514",
      "0xd0A2f4ae5E816ec09374c67F6532063B60dE037B",
      caller,
      2,
      ethers.BigNumber.from(String(params?.delta)),
      "69000000000000000",
      ethers.BigNumber.from(String(spotPrice)),
      params?.share?.nftID,
      ethers.BigNumber.from(params?.depositAmount),
      ethers.BigNumber.from(tokenBalance),
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
    ];
  }
  return param;
}

async function createPool(signer, type, ERC20Pair, params, owner, share) {
  const parameters = await constructParam(
    type,
    { ...params, ERC20: ERC20Pair, share },
    owner
  );
  const SudoSwapContract = new Contract(
    "0x605145D263482684590f630E9e581B21E4938eb8",
    SudoSwapABI,
    signer
  );
  try {
    console.log(ERC20Pair?.name);
    await approveShareSpending(
      signer,
      "0x605145D263482684590f630E9e581B21E4938eb8"
    );
    switch (ERC20Pair?.name) {
      case "oooOOO":
        await approveGoddogSpending(
          signer,
          "0x605145D263482684590f630E9e581B21E4938eb8"
        );
        break;
      case "Friend":
        await approveFriendSpending(
          signer,
          "0x605145D263482684590f630E9e581B21E4938eb8"
        );
        break;
    }
    const res = await SudoSwapContract.createPairERC1155ERC20(parameters, {
      gasLimit: 350000,
    });
    const reciept = await res.wait();
    return {
      failed: false,
      receipt: reciept,
      message: `${params[1]} ${share?.ftName} has been bought successfully`,
      icon: true,
    };
  } catch (error) {
    console.log(error);
    return {
      failed: false,
      receipt: null,
      message: `${params[1]} ${share?.ftName} has been reverted`,
      icon: false,
    };
  }
}
