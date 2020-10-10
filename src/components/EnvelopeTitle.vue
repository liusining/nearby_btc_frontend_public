<template>
  <p class="envelope-window-title">
    <span>{{ $t("envelope.title") }}</span>
    <span class="name-segment">
      <a
        :href="userURL"
        v-if="user.mixin_id && user.user_id"
        target="_blank"
        rel="noopener noreferrer"
        >{{ name }}</a
      >
      <span v-else>{{ name }}</span>
    </span>
    <v-avatar v-if="user.avatar_url" size="20">
      <img :src="user.avatar_url" />
    </v-avatar>
    <v-divider></v-divider>
  </p>
</template>

<script>
import { MIXIN_USER_PATH } from "../utils/constants.js";

export default {
  name: "EnvelopeTitle",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    name() {
      return (
        this.user.name || this.user.mixin_id || this.$t("envelope.anonymous")
      );
    },
    userURL() {
      return MIXIN_USER_PATH + this.user.user_id;
    },
  },
};
</script>

<style scoped>
.name-segment {
  margin: 0 3px;
}
</style>

<style>
.envelope-window-title span {
  font-weight: 500;
}
.envelope-window-title .v-avatar {
  vertical-align: top;
}
</style>
