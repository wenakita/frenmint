import { supabase } from "../client";
import { SearchByContract } from "./friendCalls";
import { getEthPrice, getGoddogPrice, getTokenPrice } from "./priceCalls";
const goddogCA = "0xDDf7d080C82b8048BAAe54e376a3406572429b4e";
const friendCA = "0x0bD4887f7D41B35CD75DFF9FfeE2856106f86670";
export async function postTransaction(
  shareData,
  shareAmount,
  buyer,
  isBuy,
  ethValue
) {
  const username = await fetchUsers(buyer);
  console.log(buyer);
  const currentDate = new Date();
  const stringDate = String(currentDate);
  try {
    await supabase
      .from("txs")
      .insert([
        {
          created_at: stringDate,
          share_address: shareData?.address,
          buyer_address: buyer,
          purchase_amount: shareAmount,
          frenmint_username: username?.username,
          share_pfp: shareData?.ftPfpUrl,
          share_name: shareData?.ftName,
          is_buy: true,
          eth_val: ethValue,
        },
      ])
      .single();
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}

export async function createUserName(supabase, userNameInput, address) {
  console.log("making");
  try {
    await supabase
      .from("usernames")
      .insert([
        {
          user_address: address,
          username: userNameInput,
        },
      ])
      .single();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function postMessageData(supabase, message, userName) {
  const currentDate = new Date();
  const stringDate = String(currentDate).slice(0, 24);
  console.log(stringDate);
  console.log(message);
  console.log(userName);
  try {
    await supabase
      .from("messages")
      .insert([
        {
          created_at: stringDate,
          frenmint_username: userName,
          message: message,
        },
      ])
      .single();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
//table data to post created_at, buyer_address, share_amount, share_address, eth_vval, share_name,is_buy, pool_address

export async function postPoolTxData(params, owner, isBuy) {
  const username = await fetchUsers(owner);

  const currentDate = new Date();
  const stringDate = String(currentDate);
  console.log(params);
  let ethVal = await detectPair(
    params[0]?.sudoSwapData?.tokenAddress,
    params[1],
    params[2]
  );
  console.log(ethVal?.price);
  await supabase
    .from("pool-txs")
    .insert([
      {
        created_at: stringDate,
        buyer_address: owner,
        share_amount: String(params[1]),
        share_address: params[0]?.address,
        eth_val: String(ethVal?.res),
        is_buy: isBuy,
        pool_address: params[0]?.sudoSwapData?.address,
        share_name: params[0]?.ftName,
        username: username,
        ERC20_Token: ethVal?.token,
        token_price: String(ethVal?.price),
      },
    ])
    .single();
}
detectPair(goddogCA, "1", "20000");
async function detectPair(ERC20, amount, tokenAmount) {
  let output;
  const goddogPrice = await getGoddogPrice();
  const friendPrice = await getTokenPrice(friendCA);
  const ethPrice = await getEthPrice();

  console.log(ERC20);
  switch (ERC20) {
    case goddogCA.toLowerCase():
      console.log(true);
      output = {
        res: (Number(tokenAmount) * Number(goddogPrice)) / ethPrice,
        token: "$oooOOO",
        price: goddogPrice,
      };
      break;
    case friendCA.toLowerCase():
      output = {
        res: (Number(tokenAmount) * Number(friendPrice)) / ethPrice,
        token: "$Friend",
        price: friendPrice,
      };
      break;
  }
  console.log(output?.price);
  return output;
}

export async function getRecentTx() {
  const { data, error } = await supabase.from("txs").select();
  if (error) {
    console.log(error);
  }
  if (data) {
    const formattedData = [];
    console.log(data);
    for (const key in data) {
      const res = await SearchByContract(data[key]?.share_address);
      formattedData.push(res);
    }

    return formattedData;
  }
  return null;
}
//table name tx
// {
//   id: 1,
//   created_at: 'may 30 2024 8:53pm',
//   share_address: '0x62068011609b0718baefd63daf84d82d98f228b5',
//   buyer_address: '0xa24e1426Bc37d0D1a9e7037f5De3322E800F2D7d',
//   purchase_amount: '1',
//   frenmint_username: 'iHuntJeegs',
//  share_pfp: https://pbs.twimg.com/profile_images/1654918866693414913/GVH2mAFd.jpg
// }

async function fetchUsers(userAddress) {
  try {
    const { data, error } = await supabase.from("usernames").select();
    if (error) {
      console.error("Error fetching usernames:", error.message);
      return;
    }

    if (data) {
      console.log("Fetched usernames:", data);
      for (const key in data) {
        if (data[key]?.user_address === userAddress) {
          return data[key].username;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
}
