<template>
  <!-- TODO: may use map label -->
  <baidu-map-marker
    :position="newEnvelope.location"
    animation="BMAP_ANIMATION_DROP"
    :dragging="true"
    :raiseOnDrag="true"
    @dragend="syncNewEnvelopeLocation"
    @click="showInfoWindow"
  >
    <!-- TODO: after some draging and clicking, more and more clickclose events would be received -->
    <baidu-map-info-window
      :show="showingInfoWindow"
      :position="newEnvelope.location"
      :closeOnClick="false"
      :width="250"
      :maxWidth="250"
      @clickclose="syncInfoWindowClose"
    >
      <envelope-title
        v-if="isNewEnvelopeContentSaved"
        :user="user"
      ></envelope-title>
      <p v-else class="envelope-window-title">
        <span>{{ $t("newEnvelope.guideEditTitle") }}</span
        ><v-divider></v-divider>
      </p>
      <p v-if="isNewEnvelopeContentSaved">
        {{ newEnvelope.message || $t("envelope.defaultMessage") }}
      </p>
      <p v-else>{{ $t("newEnvelope.guideEdit") }}</p>
      <!-- TODO: enable to pay the envelope here -->
      <!-- <v-btn
        v-if="isNewEnvelopeContentSaved"
        small
        :ripple="false"
        color="primary"
        :loading="false"
        >{{ $t("newEnvelope.payBtn") }}</v-btn
      > -->
      <!-- :text="isNewEnvelopeContentSaved" -->
      <v-btn
        small
        :ripple="false"
        color="primary"
        @click.stop="toggleNewEnvelopeEditor"
        >{{ $t("Edit") }}</v-btn
      >
      <!-- NOTE: Stop propagation as suggested by the vuetify document: https://vuetifyjs.com/en/components/dialogs/#without-activator -->
    </baidu-map-info-window>
  </baidu-map-marker>
</template>

<script>
import BaiduMapMarker from "vue-baidu-map/components/overlays/Marker.vue";
import BaiduMapInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
import EnvelopeTitle from "./EnvelopeTitle.vue";

export default {
  name: "NewEnvelopeMarker",
  components: {
    BaiduMapMarker,
    // MapInfoWindow,
    EnvelopeTitle,
    BaiduMapInfoWindow,
  },
  data() {
    return {
      showingInfoWindow: true,
    };
  },
  computed: {
    newEnvelope() {
      return this.$store.state.newEnvelope;
    },
    isNewEnvelopeContentSaved() {
      return this.$store.getters.isNewEnvelopeContantSaved;
    },
    user() {
      // avatar, name, mixin_id, user_id
      let displayInfo = this.newEnvelope.displayInfo;
      if (displayInfo && displayInfo.length !== 0) {
        let u = {};
        displayInfo.forEach(e => {
          u[e] = this.$store.state.user[e];
          if (e === "mixin_id") {
            u["user_id"] = this.$store.state.user["user_id"];
          }
        });
        return u;
      }
      return {}; // NOTE: anonymous
    },
  },
  methods: {
    toggleNewEnvelopeEditor() {
      this.$store.commit("toggleNewEnvelopeEditor");
    },
    showInfoWindow() {
      this.showingInfoWindow = true;
    },
    syncNewEnvelopeLocation(event) {
      this.showInfoWindow();
      this.$store.commit("changeNewEnvelopeLocation", event.point);
    },
    syncInfoWindowClose(event) {
      console.log(event);

      this.showingInfoWindow = false;
    },
  },
};
</script>
