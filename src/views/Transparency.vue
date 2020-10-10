<template>
  <v-content>
    <v-card class="data-card" elevation="2">
      <v-card-title class="justify-space-between"
        >{{ $t("transparency.directions") }}
        <v-btn icon @click="showDirection = !showDirection">
          <v-icon>{{
            showDirection ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-expand-transition>
        <!-- <div v-show="showDirection"> -->
        <!-- <v-divider></v-divider> -->
        <v-card-text class="directions" v-show="showDirection">
          <p v-text="$t('transparency.content0')"></p>
          <p v-text="$t('transparency.content1')"></p>
          <p v-text="$t('transparency.content2')"></p>
        </v-card-text>
        <!-- </div> -->
      </v-expand-transition>
    </v-card>
    <v-card class="data-card">
      <div class="actions">
        <div
          v-for="key in ['assets', 'snapshots']"
          :key="key"
          class="mb-8 d-flex align-center"
        >
          <div class="token-area">
            <v-card
              outlined
              :disabled="$data['asking_' + key]"
              height="56"
              class="d-flex align-center"
              ><span class="ml-4">{{
                $data[key + "Token"]
                  ? $data[key + "Token"].slice(0, 10) +
                    "..." +
                    $data[key + "Token"].slice(-10)
                  : $t("transparency." + key)
              }}</span>
            </v-card>
            <v-progress-linear
              class="progress"
              indeterminate
              v-if="$data['asking_' + key]"
            ></v-progress-linear>
          </div>
          <v-btn
            v-if="!$data[key + 'Token'] && !$data['asking_' + key]"
            icon
            color="primary"
            outlined
            height="40"
            width="40"
            @click="askToken(key)"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
          <v-btn
            v-else
            :disabled="$data['asking_' + key]"
            icon
            color="secondary"
            outlined
            height="40"
            width="40"
            @click="copyToken(key)"
            ><v-icon>mdi-content-copy</v-icon></v-btn
          >
        </div>
      </div>
    </v-card>
  </v-content>
</template>

<script>
import { getTransparencyToken } from "../backend";

export default {
  name: "Transparency",
  data() {
    return {
      showDirection: false,
      asking_assets: false,
      asking_snapshots: false,
      assetsToken: "",
      snapshotsToken: "",
    };
  },
  methods: {
    askToken(key) {
      this["asking_" + key] = true;
      getTransparencyToken(key).then(data => {
        this["asking_" + key] = false;
        if (!data) return;
        this[key + "Token"] = data.token;
      });
    },
    copyToken(key) {
      this.$copyText(this[key + "Token"]).then(
        () => this.$snackbar.showMessage(this.$t("Copied")),
        () => this.$snackbar.showMessage(this.$t("transparency.copyFailed"))
      );
    },
  },
};
</script>

<style scoped>
.directions {
  padding-top: 0;
  padding-block-end: 6px;
  color: black !important;
}
.actions {
  margin-top: 32px;
  padding: 32px 16px 8px 16px;
}
.progress {
  height: 3px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-top: -4px;
}
.token-area {
  display: inline-block;
  margin-right: 16px;
  width: calc(100% - 56px);
}
</style>
