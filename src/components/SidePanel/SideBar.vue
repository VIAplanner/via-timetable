<template>
  <div>
    <v-card :height="coursePanelHeight" class="pa-4 mt-3">
      <v-row class="px-4">
        <h1 class="text-h6 ma-3">{{ sideBarTitle }}</h1>
        <v-spacer class="ma-3" />
        <div class="ma-3">{{ Object.keys(filterCourses).length * 0.5 }} credit(s)</div>
      </v-row>
      <hr class="mb-1" />
      <v-row
        justify="center"
        align="center"
        :style="`height: ${coursePanelHeight * 0.85}px`"
        style="z-index: -1"
      >
        <img :src="imgSrc" style="position: absolute" :width="imgWidth" />
        <smooth-scrollbar class="right-scroll-area">
          <v-expansion-panels
            :v-model="whichCoursesExpanded"
            multiple
            hover
            class="pa-1"
          >
            <selected-course-card
              v-for="(course, code) in filterCourses"
              :key="code"
              :course="course"
            />
          </v-expansion-panels>
        </smooth-scrollbar>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SelectedCourseCard from './SelectedCourseCard.vue';

export default {
  components: {
    SelectedCourseCard,
  },
  data() {
    return {
      whichCoursesExpanded: [],
    };
  },
  computed: {
    ...mapGetters(['selectedCourses', 'getSemesterStatus', 'timetable']),
    sideBarTitle() {
      if (this.getSemesterStatus === 'F') {
        return 'Fall Courses';
      } else {
        return 'Winter Courses';
      }
    },
    coursePanelHeight() {
      return (window.innerHeight - 99) * 0.6;
    },
    programPanelHeight() {
      return (window.innerHeight - 99) * 0.4;
    },
    imgWidth() {
      return window.innerWidth * 0.17;
    },
    imgSrc() {
      if (this.getSemesterStatus === 'F') {
        return require('../../assets/fall-background.png');
      } else {
        return require('../../assets/winter-background.png');
      }
    },
    filterCourses() {
      // eslint-disable-next-line no-unused-expressions
      this.timetable; // force re-render the selected courses
      const filteredCourses = {};

      for (const code in this.selectedCourses('')) {
        if (!code.includes('Lock')) {
          filteredCourses[code] = this.selectedCourses('')[code];
        }
      }

      return filteredCourses;
    },
  },
};
</script>
<style scoped>
.right-scroll-area {
  position: relative;
  height: 90% !important;
  background-color: transparent;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
