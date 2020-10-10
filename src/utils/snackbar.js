let snackbar = {};

snackbar.install = function(Vue) {
  Vue.prototype.$snackbar = snackbar;
};

export default snackbar;
