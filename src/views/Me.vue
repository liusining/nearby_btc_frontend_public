<template>
  <v-content>
    <v-img :src="earthImg" class="top-background-image" :aspect-ratio="2">
      <template v-slot:placeholder>
        <div
          :style="
            `background-color: ${$vuetify.theme.themes.light.secondary}; width: 100%; height: 100%`
          "
        ></div>
      </template>
    </v-img>
    <div class="overlap-background">
      <v-avatar
        :color="avatarURL ? 'white' : 'primary'"
        width="110"
        height="110"
      >
        <img v-if="avatarURL" :src="avatarURL" />
        <v-icon v-else dark x-large>mdi-account</v-icon></v-avatar
      >
      <p class="user-info-name">{{ userName }}</p>
      <p class="user-info-mixin-id">{{ mixinID }}</p>
    </div>

    <centered-divider></centered-divider>
    <v-list flat class="pt-0 pb-12">
      <action-list-item
        icon="mdi-plus-circle"
        :title="$t('New Envelope')"
        @click="introduceNewEnvelope"
      ></action-list-item>
      <action-list-item
        icon="mdi-map-marker"
        :title="$t('Created Envelopes')"
        @click="$router.push({ name: 'CreatedEnvelopes' })"
      ></action-list-item>
      <action-list-item
        icon="mdi-bitcoin"
        :title="$t('Grabbed Envelopes')"
        @click="$router.push({ name: 'GrabbedEnvelopes' })"
      ></action-list-item>
      <centered-divider></centered-divider>
      <action-list-item
        icon="mdi-account-box"
        :title="$t('Transparency')"
        @click="$router.push({ name: 'Transparency' })"
      ></action-list-item>
      <action-list-item
        icon="mdi-android-messages"
        :title="$t('FAQ')"
        @click="$router.push({ name: 'FAQ' })"
      ></action-list-item>
    </v-list>
  </v-content>
</template>

<script>
import "../icons/locate";
import ActionListItem from "../components/ActionListItem.vue";
import CenteredDivider from "../components/CenteredDivider.vue";
import earthDayImg from "../assets/nasa-earth-day-june-map.jpg";
import earthNightImg from "../assets/nasa-earth-night-map.jpg";
import { mapState } from "vuex";

export default {
  name: "Me",
  components: {
    ActionListItem,
    CenteredDivider,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      avatarURL: state => state.user.avatar_url,
      mixinID: state => state.user.mixin_id,
      userName: state => state.user.name,
    }),
  },
  created() {
    let hour = new Date().getHours();
    if (hour > 20 || hour < 4) {
      this.earthImg = earthNightImg;
    } else {
      this.earthImg = earthDayImg;
    }
  },
  methods: {
    introduceNewEnvelope() {
      this.$router.push({ name: "Explore" });
      if (this.$store.getters.isNewEnvelopeActive) {
        return;
      }
      this.$snackbar.showMessage(this.$t("newEnvelope.introduceFAB"));
    },
  },
};
</script>

<style scoped>
.top-background-image {
  border-radius: 8px;
  margin: 13px 16px 0 16px;
}
.v-avatar {
  border-width: 3px;
  border-style: solid;
  border-color: white !important;
}
.overlap-background {
  margin-top: -75px;
  text-align: center;
}
.user-info-name {
  margin-top: 8px;
  margin-bottom: 0;
  line-height: 25px;
  font-size: 18px;
  letter-spacing: 0.5px;
}
.user-info-mixin-id {
  margin: 0;
  line-height: 20px;
  font-size: 14px;
  color: #909090;
}
</style>
