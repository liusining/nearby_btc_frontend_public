<template>
  <baidu-map-marker :position="location" @click="syncWindowOpen">
    <baidu-map-info-window
      :show="showingWindow"
      :position="location"
      :closeOnClick="false"
      :width="250"
      :maxWidth="250"
      @close="syncWindowClose"
      @open="syncWindowOpen"
    >
      <p class="envelope-window-title">
        <span>{{ $t("welcomeEnvelope.title") }}</span
        ><v-divider></v-divider>
      </p>
      <p>{{ $t("welcomeEnvelope.content", { amount: "0.00000001" }) }}</p>
      <v-btn
        color="primary"
        small
        :ripple="false"
        @click="welcome"
        :loading="loading"
        ><v-icon small>mdi-bitcoin</v-icon
        ><span v-text="$t('Grab')" style="margin-left: 5px;"></span
      ></v-btn>
    </baidu-map-info-window>
  </baidu-map-marker>
</template>

<script>
import BaiduMapMarker from "vue-baidu-map/components/overlays/Marker.vue";
import BaiduMapInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
import { welcomeNewUser } from "../backend";

export default {
  name: "WelcomeNewUser",
  components: {
    BaiduMapMarker,
    BaiduMapInfoWindow,
  },
  props: {
    location: Object,
  },
  data() {
    return {
      showingWindow: true,
      loading: false,
    };
  },
  methods: {
    syncWindowClose() {
      this.showingWindow = false;
    },
    syncWindowOpen() {
      this.showingWindow = true;
    },
    welcome() {
      this.loading = true;
      welcomeNewUser().then(data => {
        this.loading = false;
        if (!data) return;
        this.$emit("done");
      });
    },
  },
};
</script>
