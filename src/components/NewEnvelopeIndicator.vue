<template>
  <!-- NOTE: directly controlled by the toolbar, no need to use props to accept arguments from Explore; but use v-if outside the component to control whether to create it -->
  <div class="new-envelope-indicator">
    <span>{{ content }}</span>
  </div>
</template>

<script>
import { NEW_ENVELOPE_STAGE } from "../utils/constants.js";

export default {
  name: "NewEnvelopeIndicator",
  computed: {
    content() {
      let stage = this.$store.state.newEnvelope.stage;
      if (stage === NEW_ENVELOPE_STAGE.INITIALIZING_LOCATION) {
        return this.$t("Long press the map to place a new envelope");
      } else {
        return this.$t("Edit your new envelope");
      }
    },
  },
};
</script>

<style scoped>
.new-envelope-indicator {
  /* overflow: visible; */
  /* line-height: 0; */
  display: block;
  width: 100%;
  /* z-index: 1; */
  position: absolute;
  top: 16vh;
  text-align: center;
}
.new-envelope-indicator span {
  display: inline-block;
  line-height: 40px;
  width: 60%;
  color: white;
  background-color: rgba(0, 0, 0, 0.46);
}
</style>
