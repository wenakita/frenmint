// Create an object to store special information and owner address
const WrappedSudoPool = {
  specialStuff: new Map(),
  owner: null,
};

// Function to set the owner address
function setOwner(address) {
  WrappedSudoPool.owner = address;
}

// Function to check if the address is the owner
function isOwner(address) {
  return address === WrappedSudoPool.owner;
}

// Function to set special information if the address is the owner
function setSpecial(address, specialString) {
  if (isOwner(address)) {
    WrappedSudoPool.specialStuff.set(address, specialString);
    console.log(`Special information set for ${address}`);
  } else {
    throw new Error("Only the owner can set special information");
  }
}

// Function to get special information using an ID
function getSpecial(id) {
  // In a real implementation, you'd need to get the NFT address from the id
  // For this example, we'll just use the id as the address
  return WrappedSudoPool.specialStuff.get(id) || "";
}

// Function to generate SVG including special information
//we build the svg here
function getSVG(id) {
  // This is a simplified version of the SVG generation
  return `<svg>
    <image href="${id}" height="100%" width="100%" />
  </svg>`;
}

// Example usage:
setOwner("0x1234..."); // Set the owner's address

try {
  setSpecial("0x1234...", "Special info for NFT 1");
  console.log(
    getSVG(`
  https://d3egfmvgqzu76k.cloudfront.net/pfp-images/0x6fbe3f7d2f39c8ab96042dd7300caff924533f20/77454605ph98a0tuohs?Expires=1819727536&Key-Pair-Id=K11ON08J8XW8N0&Signature=V4sCeonUbEBaPO9h9GyMHLS~p0YrBkPDiUkQci6KIX8mdeCQ7ukg3ojz4t2~49MVUC4QZkvHbpwCr0xBnsgFgPWUo-11VPkWo2ArAwSBl6sqGp892-GckHUzASPe0r7cThMdR0lAhNFPFvZI2hGC5ouCN6oO3NegVOCbz5ZsDUBeiQWysJDe~OiB1IewudVr4uMY1w-pFevtCDjfPXHA-SBRQO5U6AVw~DALpPZGCNqx11xk6HcA0u2a-HHOjv2~m-YaBtF1BOhAdlSblRZAaMZcmBKSjidbtVm-x5wHl83GGNBc4u0thPfdLC00cxJO36~OIrV8XpEA2Oah0~skWg__
  `)
  ); // This will include the special info
} catch (error) {
  console.error(error.message);
}

// Trying to set special info with a non-owner address
try {
  setSpecial("0x5678...", "This should fail");
} catch (error) {
  console.error(error.message);
}
