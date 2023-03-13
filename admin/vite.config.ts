import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
	base: "/admin/",
	resolve: {
		alias: {
			"@": resolve(__dirname, "src")
		},
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
	},
	server: {
		// proxy: {
		// 	"/api": {
    //     target: "http://1.13.20.29:8080",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
		// }
	},
	plugins: [vue()]
})
