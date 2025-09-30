import alchemy from "alchemy";
import { Nextjs } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });

const app = await alchemy("social-image-maker");

export const web = await Nextjs("web", {
	bindings: {
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || "",
	},
	dev: {
		command: "bun run dev",
	},
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
