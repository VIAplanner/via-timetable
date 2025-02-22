<template>
  <div @mouseover="hovered = true" @mouseleave="hovered = false">
    <v-tooltip left v-if="hovered">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="hovered"
          fab
          dark
          small
          color="blue"
          @click="$router.push({ name: 'about' })"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </template>
      <span>About</span>
    </v-tooltip>
    <v-btn v-else fab dark small color="blue">
      <v-icon>mdi-information</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hovered: true,
    };
  },
};
</script>
