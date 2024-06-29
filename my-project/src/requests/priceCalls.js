const debankOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    AccessKey: "533a2166f29ab81d9b2a1148c77bd513939b1211",
  },
};

export async function getEthPrice() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/pairs/base/0xb4CB800910B228ED3d0834cF79D697127BBB00e5"
    );
    const data = await res.json();
    return Number(data.pairs[0].priceNative);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getGoddogPrice() {
  try {
    const res = await fetch(
      "https://pro-openapi.debank.com/v1/token?chain_id=base&id=0xDDf7d080C82b8048BAAe54e376a3406572429b4e",
      debankOptions
    );
    const data = await res.json();
    return data.price;
  } catch (error) {
    console.log(error);
    return null;
  }
}
