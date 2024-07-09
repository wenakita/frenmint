import { supabase } from "../client";
import { SearchByContract } from "./friendCalls";

export async function postTransaction(
  supabase,
  shareData,
  shareAmount,
  buyer,
  isBuy,
  ethValue,
  username
) {
  const currentDate = new Date();
  const stringDate = String(currentDate);
  try {
    if (isBuy) {
      console.log("is buy");
      await supabase
        .from("txs")
        .insert([
          {
            created_at: stringDate,
            share_address: shareData?.address,
            buyer_address: buyer,
            purchase_amount: shareAmount,
            frenmint_username: username,
            share_pfp: shareData?.ftPfpUrl,
            share_name: shareData?.ftName,
            is_buy: true,
            eth_val: ethValue,
          },
        ])
        .single();
    } else {
      await supabase
        .from("txs")
        .insert([
          {
            created_at: stringDate,
            share_address: shareData?.address,
            buyer_address: buyer,
            purchase_amount: shareAmount,
            frenmint_username: username,
            share_pfp: shareData?.ftPfpUrl,
            share_name: shareData?.ftName,
            is_buy: false,
            eth_val: ethValue,
          },
        ])
        .single();
    }
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

export async function getRecentTx() {
  const { data, error } = await supabase.from("txs").select();
  if (error) {
    console.log(error);
  }
  if (data) {
    const formattedData = [];
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
