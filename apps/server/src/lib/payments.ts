import { Polar } from "@polar-sh/sdk";
import { Env } from "@/env/schema";

export const polarClient = new Polar({
  accessToken: Env.POLAR_ACCESS_TOKEN,
  server: Env.POLAR_SERVER,
});
