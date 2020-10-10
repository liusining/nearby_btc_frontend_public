import Vue from "vue";
import Vuex from "vuex";
import {
  NEW_ENVELOPE_STAGE,
  NEW_ENVELOPE_DEFAULT_CONTENT,
  LAST_LOCATION_RECORD_KEY,
  MAP_CENTER_ATOMICITY_LEVEL,
  USER_GEO_CELL_LEVEL,
} from "./constants";
import { S2 } from "s2-geometry";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: {
      access_token: "",
      user_id: "",
      session_id: "",
      mixin_id: "",
      name: "",
      avatar_url: "",
      device_status: "",
      created_at: "",
      isNew: false,
    },
    map: {
      isSatelliteMap: false,
      showingBoundery: false,
      centerLng: 116.401366,
      centerLat: 39.929319,
      centerCell: "1/22332002212", // WARN: the centerCell should match centerLng and centerLat
      zoom: 13,
    },
    newEnvelope: {
      stage: NEW_ENVELOPE_STAGE.INACTIVE,
      showingEditor: false,
      location: null,
      ...NEW_ENVELOPE_DEFAULT_CONTENT,
    },
    geo: {
      userLocation: null,
      userCell: "",
      timestamp: 0,
    },
    grab: {
      grabbing: "",
      grabbed: [],
    },
  },
  getters: {
    isNewEnvelopeActive: state =>
      state.newEnvelope.stage !== NEW_ENVELOPE_STAGE.INACTIVE,
    isNewEnvelopeContantSaved: state => state.newEnvelope.coinType !== "",
    newEnvelopeContent: state => {
      return {
        coinType: state.newEnvelope.coinType,
        amount: state.newEnvelope.amount,
        people: state.newEnvelope.people,
        displayInfo: state.newEnvelope.displayInfo,
        message: state.newEnvelope.message,
      };
    },
  },

  mutations: {
    // mutate user info
    changeUserInfo(state, data) {
      // save the user to localStorage
      Object.assign(state.user, data);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + data.access_token;
    },
    changeNewUserStatus(state) {
      state.user.isNew = false;
    },
    // mutate map states
    changeMapStyle(state) {
      state.map.isSatelliteMap = !state.map.isSatelliteMap;
    },
    toggleMapBoundery(state) {
      state.map.showingBoundery = !state.map.showingBoundery;
    },
    changeMapCenter(state, center) {
      if (
        state.map.centerLng === center.lng &&
        state.map.centerLat === center.lat
      ) {
        // ignore redundant changes which are emited by baidu map
        return;
      }
      state.map.centerLng = center.lng;
      state.map.centerLat = center.lat;
      state.map.centerCell = S2.latLngToKey(
        center.lat,
        center.lng,
        MAP_CENTER_ATOMICITY_LEVEL
      );
    },
    changeMapZoom(state, zoom) {
      state.map.zoom = zoom;
    },
    // mutate states of a new envelope
    toggleNewEnvelopeEditor(state) {
      state.newEnvelope.showingEditor = !state.newEnvelope.showingEditor;
    },
    changeNewEnvelopeStage(state, newStage) {
      state.newEnvelope.stage = newStage;
    },
    changeNewEnvelopeLocation(state, location) {
      if (location) {
        state.newEnvelope.location = {
          lat: location.lat,
          lng: location.lng,
          // NOTE: this is in order to ignore the "of" key that baidu map will pass in
        };
        return;
      }
      state.newEnvelope.location = null;
    },
    changeNewEnvelopeContent(
      state,
      { coinType, amount, people, displayInfo, message }
    ) {
      state.newEnvelope.coinType = coinType;
      state.newEnvelope.amount = amount;
      state.newEnvelope.people = people;
      state.newEnvelope.displayInfo = displayInfo;
      state.newEnvelope.message = message;
    },
    clearNewEnvelopeContent(state) {
      Object.assign(state.newEnvelope, NEW_ENVELOPE_DEFAULT_CONTENT);
    },
    // mutate geolocation
    changeUserLocation(state, { lng, lat, timestamp }) {
      // NOTE: geo is a GeolocationPosition object
      let t = timestamp.valueOf();
      if (t < state.geo.timestamp) {
        return;
      }
      state.geo.userLocation = {
        lng: lng,
        lat: lat,
      };
      state.geo.userCell = S2.keyToId(
        S2.latLngToKey(lat, lng, USER_GEO_CELL_LEVEL)
      );
      state.geo.timestamp = t;
      localStorage.setItem(LAST_LOCATION_RECORD_KEY, `${lat},${lng}`);
    },
    changeGrabbingEnvelope(state, envelopeId) {
      state.grab.grabbing = envelopeId;
    },
    appendNewGrabbedEnvelope(state, envelopeId) {
      state.grab.grabbed.push(envelopeId);
    },
  },
});

export default store;
