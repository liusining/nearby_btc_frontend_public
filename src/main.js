import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import "./sass/main.scss"; // NOTE: reduce build size. See https://vuetifyjs.com/en/styles/colors/
import snackbar from "./utils/snackbar";
import store from "./utils/store";
import SvgIcon from "vue-svgicon";
import VueClipboard from "vue-clipboard2";
import { coinIcons } from "./utils/coin.js";

if (process.env.NODE_ENV === "production") {
  Vue.config.productionTip = false;
  Vue.config.devtools = false;
  Vue.config.debug = false;
  Vue.config.silent = true;
}

Vue.use(snackbar);
Vue.use(SvgIcon, {
  tagName: "svgicon",
});
Vue.prototype.$baiduMapAK = process.env.VUE_APP_BAIDU_MAP_AK;
Vue.use(VueClipboard);
Vue.use(coinIcons);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount("#app");
