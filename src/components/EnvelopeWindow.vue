<template>
  <baidu-map-info-window
    :show="open"
    :position="envelope.location()"
    :offset="{ width: 0, height: -25 }"
    :width="250"
    :maxWidth="250"
    @close="syncEnvelopeWindowClose"
    @open="syncEnvelopeWindowOpen"
  >
    <envelope-title :user="envelope.user()"></envelope-title>
    <p>{{ envelope.message() || $t("envelope.defaultMessage") }}</p>
    <v-btn
      color="primary"
      small
      :ripple="false"
      @click="grab"
      :loading="grabbing"
      :disabled="
        stopGrabbing ||
          envelope.grabbed() ||
          $store.state.grab.grabbed.includes(envelope.id())
      "
      >{{
        envelope.grabbed() || $store.state.grab.grabbed.includes(envelope.id())
          ? $t("Grabbed")
          : $t("Grab")
      }}</v-btn
    >
  </baidu-map-info-window>
</template>

<script>
import BaiduMapInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
import EnvelopeTitle from "./EnvelopeTitle.vue";
import Envelope from "../utils/envelope.js";
import { grabEnvelope } from "../backend";
import { getCurrentLocation } from "../utils/location.js";
import { mapMutations } from "vuex";

export default {
  name: "EnvelopeWindow",
  components: {
    BaiduMapInfoWindow,
    EnvelopeTitle,
  },
  model: {
    prop: "open",
    event: "toggle",
  },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
    envelope: {
      type: Envelope,
      required: true,
    },
  },
  computed: {
    grabbing() {
      return this.$store.state.grab.grabbing === this.envelope.id();
    },
    stopGrabbing() {
      return (
        this.$store.state.grab.grabbing &&
        this.$store.state.grab.grabbing !== this.envelope.id()
      );
    },
  },
  methods: {
    ...mapMutations(["changeGrabbingEnvelope", "appendNewGrabbedEnvelope"]),
    syncEnvelopeWindowClose() {
      this.$emit("toggle", false);
    },
    syncEnvelopeWindowOpen() {
      this.$emit("toggle", true);
    },
    grab() {
      // check if user location is available
      if (!this.$store.state.geo.userCell) {
        // ask the user to provide location if it's not available
        this.$snackbar.showMessage(
          this.$t("fail2locate.grab"),
          this.$t("locationAction"),
          () => {
            getCurrentLocation().then(
              () => this.grab(), // try to pay the envelope again
              () => this.$snackbar.showMessage(this.$t("fail2locate.basic")) // catch location error, not grab error
            );
          }
        );
        return;
      }
      // use the previously saved user location
      const envelopeId = this.envelope.id();
      this.changeGrabbingEnvelope(envelopeId);
      grabEnvelope(envelopeId).then(data => {
        this.changeGrabbingEnvelope("");
        if (!data) return;
        this.appendNewGrabbedEnvelope(envelopeId);
        this.$snackbar.showMessage(
          this.$t("grabEnvelope.success", { coin: data.coin_type })
        );
      });
    },
  },
};
</script>
