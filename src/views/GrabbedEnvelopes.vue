<template>
  <v-content>
    <v-card class="data-card" elevation="2">
      <v-card-title>{{ $t("grabbed.total") }} </v-card-title>
      <div class="total-coins">
        <div v-for="coin in total" :key="coin.coinType" class="total-item">
          <v-avatar size="20">
            <img :src="$coinIcons.get(coin.coinType)" />
          </v-avatar>
          <div style="margin-left: 10px; line-height: 18px;">
            <v-skeleton-loader
              v-if="totalLoading"
              type="text"
              width="86"
              height="16"
            ></v-skeleton-loader>
            <span v-else>{{ coin.amount }}</span>
          </div>
        </div>
      </div>
    </v-card>
    <v-card class="data-card envelopes" elevation="2" min-height="40">
      <div v-for="g in grabs" :key="g.grabbed_at">
        <div class="envelope">
          <v-avatar
            size="45"
            :color="g.owner && g.owner.avatar_url ? 'white' : 'primary'"
            @click="openUser(g.owner)"
          >
            <img
              v-if="g.owner && g.owner.avatar_url"
              :src="g.owner.avatar_url"
            />
            <span style="color: white;" v-else-if="g.owner && g.owner.name">{{
              g.owner.name[0]
            }}</span>
            <v-icon v-else dark>mdi-account</v-icon>
          </v-avatar>
          <div class="geo-info">
            <div class="place">
              {{ g.place || $t("defaultPlace") }}
            </div>
            <div class="secondary-info">
              via {{ $t("grabbed." + g.claim_type) }}
            </div>
          </div>
          <div class="grab-info">
            <div>{{ g.amount + " " + g.coin_type }}</div>
            <div class="secondary-info">
              {{ grabbedAt(g.grabbed_at) }}
            </div>
          </div>
        </div>

        <v-divider class="mb-4"></v-divider>
      </div>
      <data-loading v-if="grabsLoading"></data-loading>
    </v-card>
  </v-content>
</template>

<script>
import { getTotalGrabs, getGrabbedEnvelopes } from "../backend";
import { formatDate } from "../utils/date.js";
import { MIXIN_USER_PATH } from "../utils/constants.js";
import DataLoading from "../components/DataLoading.vue";

export default {
  name: "GrabbedEnvelopes",
  components: {
    DataLoading,
  },
  data() {
    return {
      grabsLoading: true,
      totalLoading: true,
      total: [
        {
          coinType: "BTC", // BTC must be the first
          amount: "0",
        },
        {
          coinType: "BOX", // BOX should be the second
          amount: "0",
        },
      ],
      grabs: [],
    };
  },
  created() {
    getTotalGrabs().then(data => {
      this.totalLoading = false;
      if (!data) return;
      for (const key in data) {
        if (key === "BTC") {
          this.total[0].amount = data.BTC;
        } else if (key === "BOX") {
          this.total[1].amount = data.BOX;
        } else {
          this.total.push({
            coinType: key,
            amount: data[key],
          });
        }
      }
    });
    this.getGrabbedEnvelopes();
  },
  methods: {
    getGrabbedEnvelopes() {
      let offset = "";
      if (this.grabs.length) {
        offset = this.grabs[this.grabs.length - 1].grabbed_at;
      }
      getGrabbedEnvelopes(offset).then(data => {
        this.grabsLoading = false;
        if (!data) return;
        this.grabs = this.grabs.concat(data);
      });
    },
    grabbedAt(timeNano) {
      return formatDate(new Date(timeNano / 1000000));
    },
    openUser(owner) {
      if (owner && owner.user_id) {
        window.open(MIXIN_USER_PATH + owner.user_id, "_blank");
      }
    },
  },
};
</script>

<style scoped>
.total-coins {
  padding: 0 16px 8px 16px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.total-item {
  flex: 1 1 auto;
  width: 50%;
  display: flex;
  align-items: flex-end;
  margin-bottom: 16px;
}
.envelopes {
  margin-top: 32px;
  padding: 24px 16px 16px 16px;
}
.envelopes > div:last-child .v-divider {
  display: none;
}
.envelope {
  display: flex;
  margin-bottom: 16px;
}
.envelope .geo-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 28px;
}
.envelope .geo-info .place {
  height: 24px;
  width: 80px;
  overflow-x: auto;
  white-space: nowrap;
}
.envelope .grab-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
