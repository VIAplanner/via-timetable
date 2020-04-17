<template>
  <div>
    <v-row v-if="!$apollo.loading">
      <v-col class="py-0">
        <v-toolbar dark color="#012B5C">
          <v-icon class="mr-2">mdi-calendar</v-icon>
          <v-toolbar-title class="mr-4">Timetable Planner</v-toolbar-title>
          <course-search-bar :courses="formattedCourses" class="mx-4"/>
          <v-dialog width="420px" v-model="optimazationOpen">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on" @click.stop="dialog = true">Optimize</v-btn>
            </template>
            <optimization-settings />
          </v-dialog>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-progress-linear indeterminate color="#012B5C"></v-progress-linear>
        <!-- <v-skeleton-loader class="mx-auto" max-width="1200" type="list-item"></v-skeleton-loader> -->
      </v-col>
    </v-row>

    <v-container>
      <v-row>
        <v-col>
          <timetable-course-card
            class="my-4"
            v-for="(course, code) in selectedCourses"
            :key="code"
            :course="course"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mr-8">
          <timetable :timetable="timetable" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import Timetable from "../components/Timetable";
import OptimizationSettings from "../components/OptimizationSettings";
import TimetableCourseCard from "../components/TimetableCourseCard";
import COURSES_SEARCH_BAR_QUERY from "../graphql/CoursesSearchBar.gql";
import { mapGetters } from "vuex";
export default {
  components: {
    OptimizationSettings,
    CourseSearchBar,
    Timetable,
    TimetableCourseCard
  },
  computed: {
    ...mapGetters(["selectedCourses", "timetable"]),
    formattedCourses() {
      return this.courses.map(course => `${course.code}: ${course.name}`);
    }
  },
  data() {
    return {
      OptimizationOpen: false
    };
  },
  apollo: {
    courses: COURSES_SEARCH_BAR_QUERY
  },
  methods: {
    getFormattedCodeAndName(code, name) {
      return `${code} ${name}`;
    }
  }
};
</script>
