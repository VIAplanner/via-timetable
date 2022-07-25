<template>
  <div @mouseover="hovered = true" @mouseleave="hovered = false">
    <v-tooltip left v-if="hovered">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          color="orange"
          @click="setTutorialPopup(true)"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-teach</v-icon>
        </v-btn>
      </template>
      <span>Tutorial</span>
    </v-tooltip>
    <v-btn v-else fab dark small color="orange">
      <v-icon>mdi-teach</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      hovered: false,
    };
  },
  methods: {
    ...mapMutations(['setTutorialPopup']),
  },
};
</script>

<style scoped>
.tooltip {
  position: absolute;
  z-index: 1;
  top: 22%;
  right: 105%;
}
</style>
