<template>
  <v-autocomplete
    ref="searchBarComponent"
    @change="onCourseSelected"
    v-model="selectedCourse"
    :items="allCourses"
    flat
    class="ml-2 mr-2"
    hide-no-data
    hide-details
    :placeholder="!loading ? 'Search for a Course' : 'Loading . . .'"
    :loading="loading"
    :autofocus="false"
    solo-inverted
    style='color:#5F5F5F'
  ></v-autocomplete>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      allCourses: [],
    };
  },
  async mounted() {
    // load from cache if it exists
    if (localStorage.searchBar) {
      this.allCourses = JSON.parse(localStorage.searchBar);
    }

    let rawCourses = [];
    let campus = '';

    try {
      rawCourses = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/courses/searchbar`,
      );
      rawCourses = rawCourses.data;
    } catch (e) {
      // eslint-disable-next-line
      console.log(e.message);
    }

    if (rawCourses.length !== 0) {
      // sort the search bar
      rawCourses.sort((a, b) => {
        if (a.courseCode < b.courseCode) {
          return -1;
        } else {
          return 1;
        }
      });

      this.allCourses = rawCourses.map(course => {
        if (course.courseCode[7] === '1') {
          campus = 'UTSG';
        } else if (course.courseCode[7] === '3') {
          campus = 'UTSC';
        } else if (course.courseCode[7] === '5') {
          campus = 'UTM';
        }

        if (course.courseCode[8] === 'F') {
          return `🍂   ${course.courseCode}: ${course.name} (${campus}) (2023-2024)`;
        } else if (course.courseCode[8] === 'S') {
          return `❄️   ${course.courseCode}: ${course.name} (${campus}) (2023-2024)`;
        } else {
          return `🍂❄️ ${course.courseCode}: ${course.name} (${campus}) (2023-2024)`;
        }
      });
    }

    localStorage.searchBar = JSON.stringify(this.allCourses);
    this.loading = false;
  },
  computed: {
    ...mapGetters([
      'getSearchBarValue',
      'getSemesterStatus',
      'selectedCourses',
    ]),
    selectedCourse: {
      // used as v-model for the search bar
      get() {
        return this.getSearchBarValue;
      },
      set(value) {
        this.setSearchBarValue(value);
      },
    },
    semCourses() {
      return this.allCourses.filter(courseString => courseString[14] === ':');
    },
  },
  methods: {
    ...mapActions(['selectCourse']),
    ...mapMutations(['setSearchBarValue', 'setSemesterStatus']),
    async onCourseSelected() {
      if (!this.selectedCourse) return;

      // Switch the semester based on the course
      if (this.selectedCourse[13] === 'F') {
        this.setSemesterStatus('F');
      } else if (this.selectedCourse[13] === 'S'){
        this.setSemesterStatus('S');
      }

      // Checks if the course is already added
      for (const courseCode in this.selectedCourses) {
        if (this.selectedCourse.includes(courseCode)) return;
      }

      // unfocus the search bar
      this.$refs.searchBarComponent.blur();
      this.loading = true;

      let course = {};
      const courseCode = this.selectedCourse.slice(
        5,
        this.selectedCourse.indexOf(':'),
      );

      try {
        course = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/courses/${courseCode}`,
        );
        course = course.data;
      } catch (e) {
        // eslint-disable-next-line
        console.log(e.message);
      }

      if (course) {
        this.selectCourse({ course });
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped>
.styles {
  border: 5px solid #012b5c;
}
</style>
