import store from "./store.js";

function getCurrentLocation() {
  return new Promise(function(resolve, reject) {
    window.navigator.geolocation.getCurrentPosition(
      geo => {
        // update user location by default
        store.commit("changeUserLocation", {
          lng: geo.coords.longitude,
          lat: geo.coords.latitude,
          timestamp: geo.timestamp,
        });
        resolve(geo);
      },
      err => {
        console.log(err.code);
        console.log(err.message);
        reject(err);
      }
    );
  });
}

export { getCurrentLocation };
