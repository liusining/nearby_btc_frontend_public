<template>
  <v-content>
    <created-envelope-card
      v-for="e in envelopes"
      :key="e.id"
      :envelope="e"
      @update="syncEnvelopeUpdate(e, $event)"
    ></created-envelope-card>
    <data-loading v-if="loading"></data-loading>
  </v-content>
</template>

<script>
import DataLoading from "../components/DataLoading.vue";
import CreatedEnvelopeCard from "../components/CreatedEnvelopeCard";
import { getCreatedEnvelopes } from "../backend";

export default {
  name: "CreatedEnvelopes",
  components: {
    DataLoading,
    CreatedEnvelopeCard,
  },
  data() {
    return {
      loading: true,
      // coinIcons: {},
      envelopes: [],
    };
  },
  created() {
    this.getEnvelopes();
  },
  methods: {
    getEnvelopes() {
      getCreatedEnvelopes().then(data => {
        this.loading = false;
        if (!data) return;
        // if (data.coin_icons) {
        //   this.coinIcons = data.coin_icons;
        // }
        this.envelopes = this.envelopes.concat(data.envelopes);
      });
    },
    syncEnvelopeUpdate(envelope, event) {
      Object.assign(envelope, event);
    },
  },
};
</script>
