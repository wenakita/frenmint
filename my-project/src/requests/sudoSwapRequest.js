export async function getSGoddogPools(
  Quoter,
  API_KEY,
  wrapperContract,
  chainId
) {
  const sudoInstance = new Quoter(API_KEY, chainId);
  const existingPools =
    await sudoInstance.getPoolsForCollection(wrapperContract);
  console.log(existingPools);
}
