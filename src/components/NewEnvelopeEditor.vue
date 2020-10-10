<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="toggleNewEnvelopeEditor" :disabled="paying">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="app-bar-center-title">
        <v-toolbar-title>{{ $t("newEnvelope.dialogTitle") }}</v-toolbar-title>
      </div>
    </v-toolbar>
    <v-subheader>{{ $t("Fill out the form") }}</v-subheader>
    <v-form class="new-envelope-form" ref="newEnvelopeForm">
      <v-select
        :disabled="paying"
        required
        :rules="[() => !!coinType]"
        color="primary lighten-2"
        v-model="coinType"
        :items="['BTC', 'BOX']"
        outlined
        :label="$t('newEnvelope.coinType.label')"
        :hint="$t('newEnvelope.coinType.msg', { coin: coinType })"
      >
        <template v-slot:selection="{ item }">
          <v-avatar size="20">
            <img :src="$coinIcons.get(item)" />
          </v-avatar>
          <span class="selected-coin-name">{{ item }}</span>
        </template>
        <template v-slot:item="data">
          <v-list-item v-bind="data.attrs" v-on="data.on">
            <v-list-item-avatar size="20">
              <v-img :src="$coinIcons.get(data.item)"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="data.item"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-text-field
        :disabled="paying"
        required
        :rules="[
          () => {
            if (amount < amountMin) {
              return $t('newEnvelope.coinAmount.minLimit', { min: amountMin });
            }
            return true;
          },
          validateDecimalPlaces,
        ]"
        color="primary lighten-2"
        outlined
        v-model="amount"
        type="number"
        :label="$t('newEnvelope.coinAmount.label')"
        :hint="
          $t('newEnvelope.coinAmount.msg', { coin: coinType, min: amountMin })
        "
      ></v-text-field>
      <v-slider
        :disabled="paying"
        required
        :rules="[() => people <= ENVELOPE_MAX_SHARES]"
        color="primary lighten-2"
        track-color="primary lighten-4"
        v-model="people"
        outlined
        :label="$t('newEnvelope.peopleCount.label')"
        :max="ENVELOPE_MAX_SHARES"
        :min="1"
      >
        <template v-slot:append>
          <v-text-field
            :disabled="paying"
            v-model="people"
            color="primary lighten-2"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 50px"
          ></v-text-field>
        </template>
      </v-slider>
      <v-select
        :disabled="paying"
        required
        :rules="[() => !!displayInfo]"
        color="primary lighten-2"
        v-model="displayInfo"
        :items="[
          {
            text: $t('newEnvelope.displayInfo.basicOpt'),
            value: ['avatar_url', 'mixin_id', 'name'],
          },
          { text: $t('newEnvelope.displayInfo.noneOpt'), value: [] },
        ]"
        outlined
        :label="$t('newEnvelope.displayInfo.label')"
        :hint="$t('newEnvelope.displayInfo.msg')"
      ></v-select>
      <v-textarea
        :disabled="paying"
        color="primary lighten-2"
        v-model="message"
        outlined
        no-resize
        :counter="140"
        :rules="[() => message.length <= 140]"
        :label="$t('newEnvelope.message.label')"
        :messages="$t('newEnvelope.message.msg')"
      ></v-textarea>
      <div class="d-flex justify-end">
        <v-btn
          :disabled="paying"
          color="primary"
          text
          @click="saveAndPreview"
          >{{ $t("newEnvelope.previewBtn") }}</v-btn
        >
        <v-btn
          color="primary"
          class="ml-4"
          @click="saveAndPay"
          :loading="paying"
          :min-width="100"
          >{{ $t("newEnvelope.payBtn") }}</v-btn
        >
      </div>
    </v-form>
  </v-card>
</template>

<script>
import { mapMutations } from "vuex";
import {
  ENVELOPE_MAX_SHARES,
  ENVELOPE_DECIMAL_PLACES_MAX,
  NEW_ENVELOPE_STAGE,
} from "../utils/constants.js";
import { initNewEnvelope } from "../backend";
import { triggerPayment, waitForEnvelopePayment } from "../utils/pay.js";
import { getCurrentLocation } from "../utils/location.js";

export default {
  name: "NewEnvelopeEditor",
  data() {
    return {
      coinType: "",
      amount: null,
      people: 50,
      displayInfo: null,
      message: "",
      ENVELOPE_MAX_SHARES,
      paying: false,
    };
  },
  computed: {
    amountMin() {
      if (this.coinType === "BOX") {
        return 0.8;
      } else {
        return 0.0001;
      }
    },
  },
  methods: {
    ...mapMutations([
      "toggleNewEnvelopeEditor",
      "changeNewEnvelopeContent",
      "clearNewEnvelopeContent",
      "changeNewEnvelopeLocation",
      "changeNewEnvelopeStage",
    ]),
    validateDecimalPlaces() {
      // decimal places
      if (!this.amount) return false;
      const amount = this.amount.toString();
      if (!amount.includes(".")) return true; // decimal places: 0
      if (amount.split(".")[1].length > ENVELOPE_DECIMAL_PLACES_MAX) {
        return this.$t("newEnvelope.coinAmount.decimalPlaces", {
          places: ENVELOPE_DECIMAL_PLACES_MAX,
        });
      }
      return true;
    },
    save() {
      if (this.$refs.newEnvelopeForm.validate()) {
        this.changeNewEnvelopeContent(this.$data);
        return true;
      }
      return false;
    },
    saveAndPreview() {
      if (this.save()) {
        this.toggleNewEnvelopeEditor();
      }
    },
    saveAndPay() {
      // TODO: add captcha
      if (!this.save()) return;
      // check if user location is available
      if (!this.$store.state.geo.userCell) {
        // ask the user to provide location if it's not available
        this.$snackbar.showMessage(
          this.$t("fail2locate.pay"),
          this.$t("locationAction"),
          () => {
            getCurrentLocation().then(
              () => this.saveAndPay(), // try to pay the envelope again
              () => this.$snackbar.showMessage(this.$t("fail2locate.basic"))
            );
          }
        );
        return;
      }
      // use the previously saved user location
      this.paying = true;
      initNewEnvelope().then(data => {
        if (!data) return;
        waitForEnvelopePayment(data.envelope_id, () => {
          if (this.$store.getters.isNewEnvelopeContantSaved) {
            // check if the new envelope still exists
            // user may have created another new envelope before some response of higher latency return, but it must be very rare
            this.$snackbar.showMessage(this.$t("newEnvelope.success"));
            this.toggleNewEnvelopeEditor();
            this.paying = false;
            this.clearNewEnvelopeContent();
            this.changeNewEnvelopeLocation(null);
            this.changeNewEnvelopeStage(NEW_ENVELOPE_STAGE.INACTIVE); // this will lead to refresh envelopes on the map
          }
        });
        triggerPayment(data);
      });
    },
  },
};
</script>

<style scoped>
.new-envelope-form {
  margin: 20px 16px 0 16px;
  padding-bottom: 40px;
}
.new-envelope-form .v-input {
  margin-bottom: 20px;
}
.selected-coin-name {
  color: black;
  position: relative;
  top: 1px;
  margin-left: 10px;
}
</style>
