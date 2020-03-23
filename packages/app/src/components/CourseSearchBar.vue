<template>
  <v-autocomplete v-model="selectedCourse" :items="courses" dense label="Search Course"></v-autocomplete>
</template>

<script>
export default {
  name: "course-search-bar",
  props: {
    courses: {
      type: Array
    }
  },
  data() {
    return {
      selectedCourse: null
    };
  }
};
</script>

<style>
</style>