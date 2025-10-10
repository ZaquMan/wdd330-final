import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	root: "src/",

	build: {
		outDir: "../dist",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "src/index.html"),
				starred: resolve(__dirname, "src/starred/index.html"),
			},
		},
	},
});
