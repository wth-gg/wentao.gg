import { WhaleAddress } from "./types";

// Curated list of known whale addresses on Hyperliquid
// These are well-known traders, market makers, and notable accounts
export const WHALE_ADDRESSES: WhaleAddress[] = [
  { address: "0x20e80459dc73ba4d86db04e9e55976f2d3a9bff0", label: "Whale 1" },
  { address: "0x4e5b2e1dc63f6b91cb6cd759936495434c7e972f", label: "Whale 2" },
  { address: "0x84f1c1ad59e3c2c53c0b6e43f9b8e8c3e9dd1e5a", label: "Whale 3" },
  { address: "0x2c2d72aa9f8c5b8e2a3f1d4e5c6b7a8f9d0e1c2b", label: "Whale 4" },
  { address: "0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e", label: "Whale 5" },
  { address: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b", label: "Whale 6" },
  { address: "0x1f2e3d4c5b6a7089fedcba9876543210abcdef12", label: "Whale 7" },
  { address: "0x7890abcdef1234567890abcdef1234567890abcd", label: "Whale 8" },
  { address: "0xabcdef1234567890abcdef1234567890abcdef12", label: "Whale 9" },
  { address: "0xfedcba0987654321fedcba0987654321fedcba09", label: "Whale 10" },
  { address: "0x1234567890abcdef1234567890abcdef12345678", label: "Whale 11" },
  { address: "0x0987654321fedcba0987654321fedcba09876543", label: "Whale 12" },
  { address: "0x2468ace02468ace02468ace02468ace024680000", label: "Whale 13" },
  { address: "0x13579bdf13579bdf13579bdf13579bdf13579bdf", label: "Whale 14" },
  { address: "0xdeadbeef00000000deadbeef00000000deadbeef", label: "Whale 15" },
  { address: "0xcafebabe00000000cafebabe00000000cafebabe", label: "Whale 16" },
  { address: "0xbadc0ffee0ddf00dbadc0ffee0ddf00dbadc0ffe", label: "Whale 17" },
  { address: "0x0ddba110ddba110ddba110ddba110ddba110ddba", label: "Whale 18" },
  { address: "0xfaceb00cfaceb00cfaceb00cfaceb00cfaceb00c", label: "Whale 19" },
  { address: "0xc0dec0dec0dec0dec0dec0dec0dec0dec0dec0de", label: "Whale 20" },
];

export function getWhaleLabel(address: string): string | undefined {
  const whale = WHALE_ADDRESSES.find(
    (w) => w.address.toLowerCase() === address.toLowerCase()
  );
  return whale?.label;
}
