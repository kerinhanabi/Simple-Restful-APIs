import { createApp } from "vue"
import App from "./app.vue"
import "./assets/global.css" // <-- Mounts Bootstrap and your custom style choices

// createApp(App).mount("#app")
const app = createApp(App)

// app.use(router) // <-- Tell Vue to use the router
app.mount("#app")
