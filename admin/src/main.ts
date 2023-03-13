import { createApp } from "vue"
import pinia from "@/store/index"
import router from "./router"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import App from "./App.vue"
import elementPlus from "element-plus"
import "element-plus/dist/index.css"
import "./style/index.css"

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(elementPlus)
app.mount("#app")

// el icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
