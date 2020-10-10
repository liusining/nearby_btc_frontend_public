import axios from "axios";
import snackbar from "../utils/snackbar";
import i18n from "../i18n";
import store from "../utils/store.js";
import { v4 as uuidv4 } from "uuid";
import { redirectToAuth } from "./auth.js";

axios.defaults.headers.common["X-Access-ID"] = uuidv4();
axios.defaults.timeout = 15000; // 15 seconds

function promptRequestError(error) {
  console.log(error);
  let msg;
  if (error.response && error.response.data.error) {
    if (error.response.data.error.code === 401) {
      redirectToAuth();
      return;
    }
    msg = error.response.data.error.message;
    if (!msg) {
      msg = "Unexpected error";
    }
  } else {
    msg = error.message;
  }
  snackbar.showMessage(i18n.t(msg));
}

function getData(response) {
  return response.data.data;
}

function authorizeNewSession(code) {
  return axios
    .post("/api/v1/sessions", {
      // data
      code,
    })
    .then(getData, promptRequestError);
}

function getUserMe() {
  return axios.get("/api/v1/me").then(getData, promptRequestError);
}

function initNewEnvelope() {
  return axios
    .post("/api/v1/envelopes", {
      // data
      envelope: {
        ...store.getters.newEnvelopeContent,
        location: store.state.newEnvelope.location,
      },
      ulc: store.state.geo.userCell,
    })
    .then(getData, promptRequestError); // TODO: how to remove repeated thens, catches
}

function verifyEnvelopePayment(envelopeId) {
  return axios
    .post("/api/v1/envelopes/pay", {
      envelope_id: envelopeId,
    })
    .then(getData)
    .catch(err => console.log(err));
}

function searchEnvelopes() {
  return axios
    .post("/api/v1/envelopes/search", {
      // TODO: change to use get method, maybe
      ulc: store.state.geo.userCell,
      mc: [store.state.map.centerLat, store.state.map.centerLng],
      mz: store.state.map.zoom,
      t: Date.now(),
    })
    .then(getData)
    .catch(err => console.log(err)); // TODO: count errors, if too many, report some
}

function grabEnvelope(envelopeId) {
  return axios
    .post("/api/v1/envelopes/grab", {
      id: envelopeId,
      ulc: store.state.geo.userCell,
    })
    .then(getData, promptRequestError);
}

function getTransparencyToken(key) {
  return axios
    .get("/api/v1/me/transparency", {
      params: {
        key,
      },
    })
    .then(getData, promptRequestError);
}

function getTotalGrabs() {
  return axios
    .get("/api/v1/me/grabbed/total")
    .then(getData, promptRequestError);
}

function getGrabbedEnvelopes(offset) {
  return axios
    .get("/api/v1/me/grabbed", {
      params: {
        offset,
      },
    })
    .then(getData, promptRequestError);
}

function getCreatedEnvelopes(offset) {
  return axios
    .get("/api/v1/me/created", {
      params: {
        offset,
      },
    })
    .then(getData, promptRequestError);
}

function recallEnvelope(id) {
  return axios
    .put(`/api/v1/me/created/recall`, {
      id,
    })
    .then(getData, promptRequestError);
}

function welcomeNewUser() {
  return axios.post("/api/v1/me/welcome").then(getData, promptRequestError);
}

export {
  authorizeNewSession,
  getUserMe,
  initNewEnvelope,
  verifyEnvelopePayment,
  searchEnvelopes,
  grabEnvelope,
  getTransparencyToken,
  getTotalGrabs,
  getGrabbedEnvelopes,
  getCreatedEnvelopes,
  welcomeNewUser,
  recallEnvelope,
};
