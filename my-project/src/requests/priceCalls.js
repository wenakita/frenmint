export async function getEthPrice() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/pairs/base/0xb4CB800910B228ED3d0834cF79D697127BBB00e5"
    );
    const data = await res.json();
    console.log(data.pairs[0].priceNative);
    return Number(data.pairs[0].priceNative);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getGoddogPrice() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/pairs/base/0x25E2DAe20f0b251a4cCF5AC1ff04C9A24E7c0140"
    );
    const data = await res.json();
    console.log(data.pairs[0].priceUsd);
    return Number(data.pairs[0].priceUsd);
  } catch (error) {
    console.log(error);
    return null;
  }
}
