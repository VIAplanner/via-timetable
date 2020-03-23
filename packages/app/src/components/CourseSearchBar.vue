<template>
  <v-autocomplete
    v-model="value"
    :items="formattedCourses"
    dense
    label="Search Course"
  ></v-autocomplete>
</template>

<script>
import COURSES_SEARCH_BAR_QUERY from "../graphql/CoursesSearchBar.gql";

export default {
  name: "course-search-bar",
  data() {
    return {
      value: null
    };
  },
  computed: {
    formattedCourses() {
      return this.courses.map(course => `${course.code}: ${course.name}`);
    }
  },
  apollo: {
    courses: COURSES_SEARCH_BAR_QUERY
  }
};
</script>

<style>
</style>