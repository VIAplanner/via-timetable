<template>
  <v-row class="main">
    <v-col>
      <v-sheet :height="managerHeight">
        <h1 style="margin: 24px 0">Course Manager</h1>
        <div v-for="course in this.filterCourses" :key="course.courseCode">
          <course-card
            :name="course.name"
            :courseCode="course.courseCode"
          ></course-card>
        </div>
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
        return this.fallSelectedCourses
      } else {
        return this.winterSelectedCourses
      }
    },
    managerHeight() {
      return this.height - 104;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  margin: 56px;
}
</style>
