<template>
  <div :style="contentHeight">
    <v-row class="fill-height" justify="center" align="center">
      <v-img
        @click="$router.push({ name: 'about' })"
        src="../assets/coming-soon.png"
        :max-width="imgWidth"
        style="cursor: pointer;"
      />
    </v-row>
  </div>
</template>
<script>
export default {
  computed: {
    contentHeight() {
      return `height: ${window.innerHeight - 110}px`;
    },
    imgWidth() {
      return window.innerWidth * 0.6;
    },
  },
};
</script>
