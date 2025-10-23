import { CryptoHasher } from "bun";

export const getSha256Hash = (input: string): string => {
  const hasher = new CryptoHasher("sha256");
  hasher.update(input);
  return hasher.digest("hex");
};
