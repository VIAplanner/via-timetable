<template>
  <v-container>
    <v-row>
      <v-col>
        <course-search-bar v-if="!$apollo.loading" :courses="formattedCourses" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import COURSES_SEARCH_BAR_QUERY from "../graphql/CoursesSearchBar.gql";


export default {
  components: {
    CourseSearchBar
  },
  apollo: {
    courses: COURSES_SEARCH_BAR_QUERY
  },
  computed: {
    formattedCourses() {
      return this.courses.map(course => `${course.code}: ${course.name}`);
    }
  }
};
</script>
