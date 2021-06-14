<template>
  <vue-custom-scrollbar class="scroll-area" :settings="scrollBarSettings">
    {{ selectedCourses }}
    <v-expansion-panels :v-model="whichCoursesExpanded" multiple focusable>
      <selected-course-card
        v-for="(course, code) in filterCourses(selectedCourses)"
        :key="code"
        :course="course"
      />
    </v-expansion-panels>
  </vue-custom-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
// eslint-disable-next-line import/no-unresolved
import VueCustomScrollbar from 'vue-custom-scrollbar';
import SelectedCourseCard from './SelectedCourseCard.vue';

export default {
  name: 'selected-courses-panel',
  components: {
    SelectedCourseCard,
    VueCustomScrollbar,
  },
  data() {
    return {
      whichCoursesExpanded: [],
      scrollBarSettings: {
        wheelPropagation: false,
        maxScrollbarLength: 100,
        swipeEasing: true,
      },
    };
  },
  computed: {
    ...mapGetters(['selectedCourses']),
  },
  methods: {
    // filters user locked timeslots
    filterCourses(selectedCourses) {
      const filteredCourses = {};

      for (const code in selectedCourses) {
        if (!code.includes('Lock')) {
          filteredCourses[code] = selectedCourses[code];
        }
      }

      return filteredCourses;
    },
  },
};
</script>

<style scoped>
.scroll-area {
  position: relative;
  margin: auto;
  height: 500px;
}
</style>
