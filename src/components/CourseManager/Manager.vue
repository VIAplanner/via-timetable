<template>
  <v-row>
    <v-col>
      <v-sheet :height="managerHeight">
        <!-- TODO MANAGER UI -->
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    created() {
      window.addEventListener('resize', this.handleResize);
    },
    data() {
      return {
        height: window.innerHeight,
      }
    },
    methods: {
      handleResize() {
        this.height = window.innerHeight;
      },
    },
    computed: {
      managerHeight() {
        return this.height - 104;
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>