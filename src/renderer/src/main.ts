import { createApp } from "vue";
import App from "./App.vue";
import "@renderer/assets/css/styles.scss";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import AppTitle from "@renderer/base-ui/appTitle.vue";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
app.component("AppTitle", AppTitle);

app.mount("#app");
