<template>
  <v-row class="main">
    <v-col>
      <v-sheet>
        <h1 style="margin: 24px 0">Course Manager</h1>
        <div v-if="this.filterCourses.length !== 0">
          <div v-for="course in this.filterCourses" :key="course.courseCode">
            <course-card
              :name="course.name"
              :courseCode="course.courseCode"
            ></course-card>
          </div>
        </div>
        <p v-else>No assessment available for this course. Add your assessment manually or import it from your syllabus/template!</p>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import CourseCard from '../components/CourseManager/CourseCard.vue';

export default {
  components: {
    CourseCard,
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  data() {
    return {
      height: window.innerHeight,
    };
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight;
    },
  },
  computed: {
    ...mapGetters(['fallSelectedCourses', 'winterSelectedCourses', 'getSemesterStatus', 'timetable']),
    filterCourses() {
      // eslint-disable-next-line no-unused-expressions
      this.timetable // force re-render the selected courses
      if (this.getSemesterStatus === 'F') {
        const courses = [];
        for (const course in this.fallSelectedCourses) {
          if (course.length === 9) {
            courses.push(this.fallSelectedCourses[course]);
          }
        }
        return courses;
      } else {
        const courses = [];
        for (const course in this.winterSelectedCourses) {
          if (course.length === 9) {
            courses.push(this.winterSelectedCourses[course]);
          }
        }
        return courses;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  margin: 56px;
}
</style>
