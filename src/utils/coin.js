import { MIXIN_COIN_ICON_DEFAULT } from "./constants.js";

const coinIcons = {
  BTC:
    "https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128",
  BOX:
    "https://mixin-images.zeromesh.net/ml7tg1ZGrQt6IJSvEusWFfthosOB98GWN7r4EkmgSP8tbJHxK7OWki9zfZFFDCDOJE0nlLBR6dc4nbUguXE3Bg4=s128",
  get: function(symbol) {
    return this[symbol] || MIXIN_COIN_ICON_DEFAULT;
  },
  install: function(Vue) {
    Vue.prototype.$coinIcons = coinIcons;
  },
};

export { coinIcons };
