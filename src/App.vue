<template>
  <v-app light>
    <v-app-bar app color="white" :elevation="2">
      <v-badge
        v-if="$route.name === 'Explore'"
        :value="showAvatarBadge"
        color="secondary"
        dot
        bordered
        offset-x="7"
        offset-y="12"
        avatar
      >
        <v-avatar
          size="40"
          :color="avatarURL ? 'white' : 'primary'"
          @click.native="$router.push({ name: 'Me' })"
        >
          <img v-if="avatarURL" :src="avatarURL" />
          <v-icon v-else dark>mdi-account</v-icon>
        </v-avatar>
      </v-badge>
      <v-btn icon v-else @click="routeBack" elevation="0" color="black">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <!-- <div class="d-flex align-center"></div> -->
      <div class="app-bar-center-title">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </div>
    </v-app-bar>

    <router-view></router-view>

    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      style="letter-spacing: 0.15px"
    >
      {{ snackbarMsg }}
      <v-btn
        v-if="snackbarAction"
        color="secondary"
        text
        @click="snackbarActionFunc"
      >
        {{ snackbarAction }}
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { LAST_LOCATION_RECORD_KEY } from "./utils/constants.js";
import { redirectToAuth } from "./backend/auth.js";
import { getUserMe } from "./backend";

export default {
  name: "App",
  data() {
    return {
      snackbar: false,
      snackbarMsg: "",
      snackbarAction: "",
      snackbarActionFunc: null,
      showAvatarBadge: false,
    };
  },
  created() {
    // snackbar configuration
    this.$snackbar.showMessage = (msg, action, actionFunc) => {
      this.snackbar = false; // close existed snackbar
      this.$nextTick(() => {
        this.snackbarMsg = msg;
        this.snackbarAction = action;
        this.snackbarActionFunc = () => {
          actionFunc();
          this.snackbar = false; // NOTE: close the snackbar after the action is clicked
        };
        this.snackbar = true;
      });
    };
    // check if the session is authorized
    if (this.$route.name !== "NewSession") {
      this.validateSession();
    }
    // check if last location
    this.restoreLastLocation();
  },
  computed: {
    title() {
      let route = this.$route.name;
      if (route === "Explore") {
        return this.$t("Nearby BTC");
      } else if (route == "NewSession") {
        return this.$t("Logining In");
      } else if (route === "Me") {
        return this.$t("My Info");
      } else if (route === "CreatedEnvelopes") {
        return this.$t("Created Envelopes");
      } else if (route === "GrabbedEnvelopes") {
        return this.$t("Grabbed Envelopes");
      } else if (route === "Transparency") {
        return this.$t("Transparency");
      } else if (route === "FAQ") {
        return this.$t("FAQ");
      }
      return "";
    },
    avatarURL() {
      return this.$store.state.user.avatar_url;
    },
  },
  watch: {
    "$store.state.user.isNew": function(isNew) {
      if (isNew) {
        this.showAvatarBadge = true;
      }
    },
  },
  methods: {
    routeBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    validateSession() {
      let user = localStorage.getItem("user");
      if (!user) {
        redirectToAuth();
        return;
      }
      let data;
      try {
        data = JSON.parse(user);
      } catch (err) {
        console.log(err);
        redirectToAuth();
        return;
      }

      this.$store.commit("changeUserInfo", data);
      // update user info and check whether the authorization is valid
      getUserMe().then(data => {
        if (!data) return;
        window.localStorage.setItem("user", JSON.stringify(data));
        this.$store.commit("changeUserInfo", data);
      });
    },
    restoreLastLocation() {
      let loc = localStorage.getItem(LAST_LOCATION_RECORD_KEY);
      if (!loc) {
        return;
      }
      let [lat, lng] = loc.split(",");
      if (lat && lng) {
        this.$store.commit("changeMapCenter", {
          lat: Number.parseFloat(lat),
          lng: Number.parseFloat(lng),
        });
      }
    },
  },
};
</script>

<style>
.app-bar-center-title {
  position: absolute;
  width: 100%;
  text-align: center;
  margin-left: -16px;
  z-index: -1;
  letter-spacing: 0.15px;
}
.data-card {
  margin: 16px;
}
.data-card .v-card__title {
  font-size: 18px;
}
</style>
