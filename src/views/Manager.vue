<template>
  <v-row class="main">
    <v-col>
      <v-sheet :height="managerHeight">
        <h1>Course Manager</h1>
        <v-btn elevation="2" style="margin: 24px 0">Add a course</v-btn>
        <div v-for="course in courses" :key="course.courseCode">
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
import CourseCard from '../components/CourseManager/CourseCard.vue';

export default {
  components: {
    CourseCard,
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  data() {
    const currDate = new Date();
    let courses;
    if (currDate.getMonth() <= 11 && currDate.getMonth() >= 8) {
      courses = JSON.parse(localStorage.get("fallSelectedCourses"));
    }
    else if (currDate.getMonth() >= 0 && currDate.getMonth() <= 4) {
      courses = JSON.parse(localStorage.getItem("winterSelectedCourses"));
    }
    const timetable = [];
    for (const course of Object.keys(courses)) {
      timetable.push({ name: courses[course].name, courseCode: courses[course].courseCode });
    }
    return {
      height: window.innerHeight,
      courses: timetable
    };
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
};
</script>

<style lang="scss" scoped>
.main {
  margin: 56px;
}
</style>
