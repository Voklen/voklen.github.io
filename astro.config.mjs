// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://www.voklen.com",
	image: {
		responsiveStyles: true,
		layout: "full-width",
	},
});
