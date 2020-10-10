<template>
  <v-list-item ripple @click="$emit('click', $event)">
    <v-list-item-icon>
      <v-icon v-text="icon"></v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon>
        <v-icon color="grey">mdi-chevron-right</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
export default {
  name: "ActionListItem",
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.v-list-item {
  height: 56px;
}
</style>
