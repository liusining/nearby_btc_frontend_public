import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

import zhHans from "vuetify/es5/locale/zh-Hans";

export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: "zhHans", // NOTE: change $vuetify.lang programmatically if needed. See https://vuetifyjs.com/en/customization/internationalization/#custom-components
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: "#F4511E",
        secondary: "#00BCD4",
      },
    },
  },
  // icons: {
  //   iconfont: "mdi",
  // },
});
