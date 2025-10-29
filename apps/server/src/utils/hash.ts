import { CryptoHasher } from "bun";

export const getSha256Hash = (input: string): string => {
  const textEncoder = new TextEncoder();
  const encodedInput = textEncoder.encode(input);
  const hasher = new CryptoHasher("sha256");
  hasher.update(encodedInput);
  return hasher.digest("hex");
};
