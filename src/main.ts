// import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'highlight.js/styles/github-dark-dimmed.css';
import "@/assets/main.css"
import "@/assets/coin.css"
import "@/assets/table.css"
import { createApp,ref } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// import VuePapaParse from 'vue-papa-parse'
import VueApexCharts from "vue3-apexcharts";

// Import the functions you need from the SDKs you need


const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(VuePapaParse)
app.use(VueApexCharts);
app.mount('#app')


