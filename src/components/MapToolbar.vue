<template>
  <v-app-bar light bottom app color="white" :elevation="8">
    <div class="d-flex align-center map-icon-controls">
      <v-btn elevation="0" color="white" light @click="changeMapStyle"
        ><svgicon v-if="isSatelliteMap" name="flat-map"></svgicon
        ><svgicon v-else name="global"></svgicon
      ></v-btn>

      <v-btn elevation="0" color="white" light @click="locateUser"
        ><svgicon name="locate"></svgicon
      ></v-btn>

      <v-btn elevation="0" color="white" light @click="toggleMapBoundery"
        ><svgicon name="ruler"></svgicon
      ></v-btn>
    </div>

    <v-btn
      color="primary"
      dark
      absolute
      bottom
      right
      fab
      class="new-envelope-fab"
      @click="toggleNewEnvelopeActiveness"
    >
      <v-icon v-if="isNewEnvelopeActive">mdi-close</v-icon>
      <v-icon v-else>mdi-plus</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import "@/icons/global";
import "@/icons/locate";
import "@/icons/ruler";
import "@/icons/flat-map";
import { mapMutations, mapState, mapGetters } from "vuex";
import { NEW_ENVELOPE_STAGE, BOUNDERY_RADIUS_KM } from "../utils/constants";
import { getCurrentLocation } from "../utils/location.js";

export default {
  name: "MapToolbar",
  data() {
    return {
      firstLocated: true,
    };
  },
  computed: {
    ...mapState({
      isSatelliteMap: state => state.map.isSatelliteMap,
    }),
    ...mapGetters(["isNewEnvelopeActive", "isNewEnvelopeContantSaved"]),
  },
  methods: {
    ...mapMutations([
      "changeMapStyle",
      "toggleMapBoundery",
      "changeNewEnvelopeStage",
      "changeMapCenter",
      "changeMapZoom",
      "changeNewEnvelopeLocation",
      "clearNewEnvelopeContent",
    ]),
    toggleNewEnvelopeActiveness() {
      // NOTE: the main fab is the single source of activating a new envelope
      if (this.isNewEnvelopeActive) {
        //  active -> inactive
        // TODO: confirm the user is sure to close this new envelope
        // if (this.isNewEnvelopeContantSaved) {
        //   return;
        // }
        this.clearNewEnvelopeContent();
        this.changeNewEnvelopeLocation(null);
        this.changeNewEnvelopeStage(NEW_ENVELOPE_STAGE.INACTIVE);
      } else {
        // NOTE: make sure location is available
        // TODO: show overlay when getting location, maybe
        this.changeMapZoom(10);
        getCurrentLocation().then(
          geo => {
            this.changeMapCenter({
              lng: geo.coords.longitude,
              lat: geo.coords.latitude,
            });
            this.$snackbar.showMessage(
              this.$t("newEnvelope.distanceLimit", {
                radius: BOUNDERY_RADIUS_KM,
              })
            );
          },
          () => {
            this.$snackbar.showMessage(
              this.$t("fail2locate.placeNewEnvelope"),
              this.$t("locationAction"),
              () => {
                getCurrentLocation()
                  .then(geo => {
                    this.changeMapCenter({
                      lng: geo.coords.longitude,
                      lat: geo.coords.latitude,
                    });
                  })
                  .catch(() =>
                    this.$snackbar.showMessage(this.$t("fail2locate.basic"))
                  );
              }
            );
          }
        );
        // inactive -> active
        this.changeNewEnvelopeStage(NEW_ENVELOPE_STAGE.INITIALIZING_LOCATION);
      }
    },
    locateUser() {
      getCurrentLocation().then(
        geo => {
          this.changeMapCenter({
            lng: geo.coords.longitude,
            lat: geo.coords.latitude,
          });
          if (this.firstLocated) {
            this.$snackbar.showMessage(this.$t("locationMarker:people"));
            this.firstLocated = false;
          }
        },
        () => {
          //   if (mixinContext.environment() === MIXIN_CONTEXT_PLATFORM_ANDROID) {
          //     this.$snackbar.showMessage(this.$t("fail2locate:Android"));
          //     return;
          //   }
          this.$snackbar.showMessage(this.$t("fail2locate.activelyLocate"));
          //   this.$snackbar.showMessage(`${err.code}, ${err.message}`);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.new-envelope-fab {
  bottom: 28px !important;
}
</style>

<style scoped>
.map-icon-controls .svg-icon {
  width: 24px;
  height: 24px;
}
</style>
