<template>
  <v-container>
    <v-row>
      <v-col>
        <optimization-settings />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <course-search-bar v-if="!$apollo.loading" :courses="formattedCourses" />
      </v-col>
    </v-row>
    <v-row style="background: #E5E5E5;">
      <v-col>
        <timetable :timetable="timetable" :courseCodeColorMap="courseCodeColorMap" />
      </v-col>
    </v-row>
    <v-row style="background: #E5E5E5;">
      <v-col>
        <timetable-course-card
          class="my-4"
          v-for="(courseInfo, courseCode) in formattedCoursesForCourseCards"
          :key="courseCode"
          :course="courseInfo"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import Timetable from "../components/Timetable";
import OptimizationSettings from "../components/OptimizationSettings";
import TimetableCourseCard from "../components/TimetableCourseCard";
import COURSES_SEARCH_BAR_QUERY from "../graphql/CoursesSearchBar.gql";
import { mapState } from 'vuex'

export default {
  components: {
    OptimizationSettings,
    CourseSearchBar,
    Timetable,
    TimetableCourseCard,
  },
  computed: {
    ...mapState([
      'timetable',
    ]),
    formattedCourses() {
      return this.courses.map(course => `${course.code}: ${course.name}`);
    },
    courseCodeColorMap() {
      const codeColorMap = new Map();
      var index = 0;
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          if (!codeColorMap.has(event.courseCode)) {
            codeColorMap.set(event.courseCode, this.colors[index]);
            index++;
          }
        }
      }
      return codeColorMap;
    },
    formattedCoursesForCourseCards() {
      const result = {};
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          //If result doesn't already have event.courseCode
          if (!(event.courseCode in result)) {
            result[event.courseCode] = {
              codeAndName: this.getFormattedCodeAndName(
                event.courseCode,
                event.courseName
              ),
              color: this.courseCodeColorMap.get(event.courseCode),
              meetingSections: [
                {
                  section: event.section,
                  day: day,
                  start: event.start,
                  end: event.end,
                  location: event.location,
                  instructorName: event.instructorName
                }
              ]
            };
          } else {
            result[event.courseCode].meetingSections.push({
              section: event.section,
              day: day,
              start: event.start,
              end: event.end,
              location: event.location,
              instructorName: event.instructorName
            });
          }
        }
      }
      return result;
    }
  },
  data() {
    return {
      colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
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
