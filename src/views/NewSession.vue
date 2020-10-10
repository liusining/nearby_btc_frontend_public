<template>
  <v-content class="map-wrap">
    <baidu-map
      class="map-view"
      :ak="$baiduMapAK"
      :center="{ lat: 30.929319, lng: 116.401366 }"
      :zoom="1"
    ></baidu-map>
    <v-overlay opacity="0.6">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
  </v-content>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import { authorizeNewSession } from "../backend";
import { redirectToAuth } from "../backend/auth.js";
import { ENVELOPE_ID_URL_QUERY_KEY } from "../utils/constants";

export default {
  name: "NewSession",
  components: {
    BaiduMap,
  },
  beforeCreate() {
    let code = this.$route.query.code;
    if (!code) {
      // TODO: let people know that they should authorize the access, intead of redirecting without saying anything
      redirectToAuth();
      return;
    }
    authorizeNewSession(code).then(data => {
      if (!data) return;
      window.localStorage.setItem("user", JSON.stringify(data.user));
      if (data.is_new) {
        data.user.isNew = true;
      }
      this.$store.commit("changeUserInfo", data.user);
      // redirect
      let returnTo = this.$route.query.return_to;
      if (returnTo && returnTo.includes(ENVELOPE_ID_URL_QUERY_KEY + "=")) {
        window.location.hash = returnTo;
        return;
      }
      this.$router.push({ path: "/" });
    });
  },
};
</script>
