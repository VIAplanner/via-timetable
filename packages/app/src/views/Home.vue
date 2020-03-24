<template>
  <v-container>
    <v-row>
      <v-col>
        <course-search-bar v-if="!$apollo.loading" :courses="formattedCourses" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <timetable :timetable="timetable"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import Timetable from "../components/Timetable";
import COURSES_SEARCH_BAR_QUERY from "../graphql/CoursesSearchBar.gql";

export default {
  components: {
    CourseSearchBar,
    Timetable
  },
  data() {
    return {
      timetable: {
        Monday: [
          {
            courseCode: "CSC258H5S",
            section: "L0101",
            start: 32400,
            end: 39600,
            location: "IB 345"
          },
          {
            courseCode: "STA258H5S",
            section: "L0101",
            start: 54000,
            end: 61200,
            location: "MN 1210"
          }
        ],
        Tuesday: [
          {
            courseCode: "CSC207H5S",
            section: "L0101",
            start: 39600,
            end: 46800,
            location: "MN 1270"
          },
          {
            courseCode: "CSC258H5S",
            section: "P0109",
            start: 61200,
            end: 64800,
            location: "DH 2026"
          }
        ],
        Wednesday: [
          {
            courseCode: "CSC290H5S",
            section: "L0101",
            start: 50400,
            end: 57600,
            location: "MN 1270"
          },
          {
            courseCode: "STA258H5S",
            section: "T0105",
            start: 61200,
            end: 64800,
            location: "DH 2080"
          }
        ],
        Thursday: [
          {
            courseCode: "CSC290H5S",
            section: "T0101",
            start: 39600,
            end: 46800,
            location: "MN 1270"
          },
          {
            courseCode: "CSC209H5S",
            section: "P0111",
            start: 61200,
            end: 64800,
            location: "DH 2026"
          }
        ],
        Friday: [
          {
            courseCode: "CSC209H5S",
            section: "L0104",
            start: 50400,
            end: 57600,
            location: "MN 1270"
          }
        ]
      }
    };
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
