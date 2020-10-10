<template>
  <v-card>
    <v-card-title class="title">{{ $t("firstGuide.title") }}</v-card-title>
    <v-card-text class="subtitle-1">{{ $t("firstGuide.guide") }}</v-card-text>
    <v-card-actions class="pb-4 pr-6">
      <v-spacer></v-spacer>
      <v-btn color="primary" text height="28" @click="$emit('toggle', false)">{{
        $t("firstGuide.cancel")
      }}</v-btn>
      <v-btn
        color="primary"
        height="28"
        class="ml-4"
        :loading="locating"
        @click="locate"
        >{{ $t("firstGuide.locate") }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { getCurrentLocation } from "../utils/location.js";

export default {
  name: "FirstTimeUserGuide",
  model: {
    prop: "show",
    event: "toggle",
  },
  props: {
    show: Boolean,
  },
  data() {
    return {
      locating: false,
    };
  },
  methods: {
    locate() {
      this.locating = true;
      getCurrentLocation()
        .then(
          geo => {
            this.$store.commit("changeMapCenter", {
              lng: geo.coords.longitude,
              lat: geo.coords.latitude,
            });
            this.$snackbar.showMessage(this.$t("firstGuide.located"));
          },
          () => this.$snackbar.showMessage(this.$t("firstGuide.locationFailed"))
        )
        .then(() => {
          this.locating = false;
          this.$emit("toggle", false);
        });
    },
  },
};
</script>
