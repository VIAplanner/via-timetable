<template>
  <v-row>
    <v-col>
      <v-sheet :height="managerHeight">
        <!-- TODO MANAGER UI -->
        <h1>Course Manager</h1>
        <v-btn
          elevation="2"
        >Add a course</v-btn>
        <br>
        <CourseCard
          name="Intro to Computer Science"
          courseCode="CSC148"
        ></CourseCard>
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