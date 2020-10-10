
<template>
  <v-card class="data-card envelope">
    <div class="first-line">
      <v-avatar size="32">
        <img :src="$coinIcons.get(envelope.coin_type)" />
      </v-avatar>
      <div class="place-time">
        <div class="place">{{ envelope.place || $t("defaultPlace") }}</div>
        <div class="secondary-info">{{ createdAt(envelope.created_at) }}</div>
      </div>
    </div>
    <v-divider></v-divider>
    <v-row class="mt-1">
      <v-col cols="5" class="d-flex flex-column">
        <div class="secondary-info">{{ $t("created.amount") }}</div>
        <div class="hide-overflow">{{ envelope.amount }}</div>
      </v-col>
      <v-col cols="4" class="d-flex flex-column">
        <div class="secondary-info">{{ $t("created.left") }}</div>
        <div>{{ `${envelope.left}/${envelope.total}` }}</div></v-col
      >
      <v-col cols="3" class="d-flex flex-column">
        <div class="secondary-info">{{ $t("created.status") }}</div>
        <div class="hide-overflow">
          {{ $t("created." + envelope.status) }}
        </div></v-col
      >
    </v-row>
    <div class="actions">
      <v-btn
        v-if="envelope.status === 'INITIALIZED'"
        small
        color="primary"
        @click="developing"
        >{{ $t("created.payment") }}</v-btn
      >
      <v-btn
        v-if="envelope.status === 'LISTING'"
        small
        color="primary"
        text
        :loading="recalling"
        @click="recall"
        >{{ $t("created.recall") }}</v-btn
      >
      <v-btn
        v-if="envelope.status === 'LISTING'"
        small
        elevation="1"
        color="primary"
        :disabled="recalling"
        @click="developing"
        >{{ $t("created.share") }}</v-btn
      >
      <v-btn
        v-if="envelope.status === 'RECALLING'"
        small
        elevation="1"
        color="primary"
        :loading="recalling"
        @click="recall"
      >
        {{ $t("created.doubleCheck") }}
      </v-btn>
      <v-btn
        v-if="['DONE', 'RECALLED', 'PAY_EXPIRED'].includes(envelope.status)"
        small
        color="primary"
        @click="developing"
        >{{ $t("created.detail") }}</v-btn
      >
    </div>
  </v-card>
</template>

<script>
import { formatDate } from "../utils/date.js";
import { recallEnvelope } from "../backend";

export default {
  name: "CreatedEnvelopeCard",
  model: {
    prop: "envelope",
    event: "change",
  },
  props: {
    envelope: Object,
  },
  data() {
    return {
      recalling: false,
    };
  },
  methods: {
    createdAt(timeSecs) {
      return formatDate(new Date(timeSecs * 1000));
    },
    developing() {
      this.$snackbar.showMessage(this.$t("developing"));
    },
    recall() {
      this.recalling = true;
      recallEnvelope(this.envelope.id).then(data => {
        this.recalling = false;
        if (!data) return;
        if (data.status === "RECALLING") {
          this.$snackbar.showMessage(this.$t("created.recalling"));
        }
        this.$emit("update", data);
      });
    },
  },
};
</script>

<style scoped>
.envelope {
  padding: 16px;
}
.envelope .first-line {
  display: flex;
  margin-bottom: 3px;
}
.envelope .first-line .place-time {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}
.envelope .first-line .place-time .place {
  height: 24px;
  max-width: 120px;
  overflow-x: auto;
  white-space: nowrap;
}
.hide-overflow {
  overflow-wrap: normal;
  overflow: hidden;
}
.envelope .actions {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
}
.envelope .actions .v-btn {
  margin-left: 12px;
}
</style>
