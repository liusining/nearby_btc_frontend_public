<template>
  <div>
    <v-content class="map-wrap">
      <!-- TODO: prevent users from clicking on the Baidu logo -->
      <baidu-map
        class="map-view"
        :ak="$baiduMapAK"
        :center="mapCenter"
        :zoom="map.zoom"
        :map-type="map.isSatelliteMap ? 'BMAP_HYBRID_MAP' : 'BMAP_NORMAL_MAP'"
        @moveend="syncMapCenterAndZoom"
        @zoomend="syncMapCenterAndZoom"
        @longpress="placeNewEnvelopeMarker"
      >
        <baidu-map-marker
          v-for="e in envelopes"
          :key="e.id()"
          :position="e.location()"
          @click="showEnvelopeDetail(e)"
        ></baidu-map-marker>
        <envelope-window
          v-if="currentEnvelope"
          :envelope="currentEnvelope"
          v-model="envelopeWindowOpening"
        ></envelope-window>
        <baidu-map-scale
          anchor="BMAP_ANCHOR_TOP_RIGHT"
          :offset="{ width: 10, height: 10 }"
        ></baidu-map-scale>
        <!-- the cirle ruler -->
        <baidu-map-circle
          v-if="map.showingBoundery && notMovingMap"
          :center="mapCenter"
          :radius="rulerRadius"
          :strokeColor="$vuetify.theme.themes.light.primary"
          :strokeWeight="2"
          :strokeOpacity="0.8"
          fillColor="white"
          :fillOpacity="0.1"
        ></baidu-map-circle>
        <!-- overlays drawn by the map, control whether to show them using v-if -->
        <user-location-marker
          v-if="$store.state.geo.userLocation"
        ></user-location-marker>
        <new-envelope-marker
          v-if="$store.state.newEnvelope.location"
        ></new-envelope-marker>
        <!-- TODO: make welcome-new-user self-contained, i.e. no need to accept arguments -->
        <welcome-new-user
          :location="mapCenter"
          v-if="$store.state.user.isNew"
          @done="firstTimeUserGuide"
        ></welcome-new-user>
      </baidu-map>
    </v-content>
    <!-- overlays not drawn by the map, over the map -->
    <map-toolbar></map-toolbar>
    <v-dialog
      v-model="showingNewEnvelopeEditor"
      hide-overlay
      fullscreen
      transition="dialog-bottom-transition"
    >
      <new-envelope-editor v-if="renderEnvelopeEditor"></new-envelope-editor>
    </v-dialog>
    <!-- NOTE: control whether to create a component in the parent component -->
    <new-envelope-indicator
      v-if="$store.getters.isNewEnvelopeActive"
    ></new-envelope-indicator>
    <v-dialog
      v-if="renderUserGuide"
      v-model="showUserGuide"
      persistent
      transition="dialog-bottom-transition"
    >
      <first-time-user-guide v-model="showUserGuide"></first-time-user-guide>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import MapToolbar from "../components/MapToolbar.vue";
// TODO: use google map as an alternative; control building using an environment variable
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BaiduMapScale from "vue-baidu-map/components/controls/Scale.vue";
import BaiduMapCircle from "vue-baidu-map/components/overlays/Circle.vue";
import BaiduMapMarker from "vue-baidu-map/components/overlays/Marker.vue";
import { mapState, mapMutations } from "vuex";
import WelcomeNewUser from "../components/WelcomeNewUser.vue";
import NewEnvelopeEditor from "../components/NewEnvelopeEditor.vue";
import NewEnvelopeIndicator from "../components/NewEnvelopeIndicator.vue";
import UserLocationMarker from "../components/UserLocationMarker.vue";
import { NEW_ENVELOPE_STAGE, BOUNDERY_RADIUS_KM } from "../utils/constants.js";
import NewEnvelopeMarker from "../components/NewEnvelopeMarker.vue";
import { searchEnvelopes } from "../backend";
import EnvelopeWindow from "../components/EnvelopeWindow.vue";
import Envelope from "../utils/envelope.js";
import FirstTimeUserGuide from "../components/FirstTimeUserGuide.vue";

export default {
  name: "Explore",
  components: {
    MapToolbar,
    BaiduMap,
    BaiduMapScale, // 比例尺
    BaiduMapCircle,
    BaiduMapMarker,
    WelcomeNewUser,
    NewEnvelopeEditor,
    NewEnvelopeIndicator,
    UserLocationMarker,
    NewEnvelopeMarker,
    EnvelopeWindow,
    FirstTimeUserGuide,
  },
  data() {
    return {
      rulerUsed: false,
      rulerRadius: BOUNDERY_RADIUS_KM * 1000,
      notMovingMap: true,
      envelopeWindowOpening: false,
      envelopes: [],
      searchTimestamp: Date.now(),
      currentEnvelope: null,
      renderUserGuide: false,
      showUserGuide: false,
      renderEnvelopeEditor: false,
    };
  },
  computed: {
    ...mapState({
      mapCenter: state => {
        return { lng: state.map.centerLng, lat: state.map.centerLat };
      },
      showingNewEnvelopeEditor: state => state.newEnvelope.showingEditor,
      map: "map",
      newEnvelopeStage: state => state.newEnvelope.stage,
    }),
  },
  watch: {
    "map.showingBoundery": function(show) {
      if (show) {
        this.changeMapZoom(9);
        // NOTE: display instrument only once
        if (this.rulerUsed) {
          return;
        }
        this.toggleMapBoundery(); // NOTE: the first time would probably fail to diaply the circle due to unknown reason, so refresh it
        this.$nextTick(() => this.toggleMapBoundery());
        this.rulerUsed = true;
        this.$snackbar.showMessage(
          this.$t("rulerInstruction", { radius: BOUNDERY_RADIUS_KM })
        );
      }
    },
    "map.centerCell": function() {
      this.fillInEnvelopes();
    },
    newEnvelopeStage: function(newVal) {
      if (newVal === NEW_ENVELOPE_STAGE.EDITING) {
        this.renderEnvelopeEditor = true;
      } else if (newVal === NEW_ENVELOPE_STAGE.INACTIVE) {
        // force to refresh the search results, since a new envelope may be created
        this.fillInEnvelopes();
        this.renderEnvelopeEditor = false;
      }
    },
  },
  created() {
    this.fillInEnvelopes();
  },
  methods: {
    ...mapMutations([
      "changeMapCenter",
      "changeMapZoom",
      "toggleMapBoundery",
      "changeNewEnvelopeLocation",
      "changeNewEnvelopeStage",
      "changeNewUserStatus",
    ]),
    syncMapCenterAndZoom(e) {
      let boundery = this.map.showingBoundery;
      // NOTE: refresh the ruler circle; otherwise, duplicated circles may appear
      if (boundery) {
        this.notMovingMap = false;
      }
      this.changeMapCenter(e.target.getCenter());
      this.changeMapZoom(e.target.getZoom());
      if (boundery) {
        this.$nextTick(() => {
          this.notMovingMap = true;
        });
      }
    },
    placeNewEnvelopeMarker(event) {
      if (this.newEnvelopeStage !== NEW_ENVELOPE_STAGE.INITIALIZING_LOCATION) {
        return;
      }
      this.changeNewEnvelopeLocation(event.point);
      this.changeNewEnvelopeStage(NEW_ENVELOPE_STAGE.EDITING);
    },
    showEnvelopeDetail(envelope) {
      this.currentEnvelope = envelope;
      this.envelopeWindowOpening = true;
    },
    fillInEnvelopes() {
      searchEnvelopes().then(data => {
        if (!data) return;
        if (data.t < this.searchTimestamp) return; // the response comes too late
        this.searchTimestamp = data.t;
        let newCollection = [];
        if (data.envelopes) {
          data.envelopes.forEach(item => {
            newCollection.push(new Envelope(item));
          });
        }
        this.envelopes = newCollection;
      });
    },
    firstTimeUserGuide() {
      this.changeNewUserStatus();
      this.renderUserGuide = true; // This will give time to show transition
      this.$nextTick(() => {
        this.showUserGuide = true;
      });
    },
  },
};
</script>
