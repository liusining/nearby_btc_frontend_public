const fs = require("fs");
module.exports = {
  transpileDependencies: ["vuetify"],
  // TODO: limit components build size may be needed. See https://vuetifyjs.com/en/customization/a-la-carte/
  pluginOptions: {
    i18n: {
      locale: "zhHans",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false,
    },
  },
  devServer: {
    https: true,
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost-cert.pem"),
    proxy: {
      "^/api": {
        target: "https://nearby-dev.sining.io",
        changeOrigin: true,
      },
      "/documents": {
        target: "https://nearby-dev.sining.io",
        changeOrigin: true,
      },
    },
  },
};
