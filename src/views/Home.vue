<template>
  <v-row>
    <v-col class="ma-0 pt-0 pb-0">
      <!-- Popup tutorial -->
      <tutorial />
      <!--Exporting Progress Overlay-->
      <v-overlay :value="getExportOverlay">
        <v-row>
          <h1 class="ma-3">Exporting</h1>
        </v-row>
        <v-row justify="center">
          <v-progress-circular
            indeterminate
            size="64"
            style="margin-left: auto; margin-right: auto;"
          ></v-progress-circular>
        </v-row>
      </v-overlay>
      <toolbar />
      <Footer />
      <help-dial />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Tutorial from '../components/Popup/Tutorial.vue';
import Toolbar from '../components/AppBar/Toolbar.vue';
import HelpDial from '../components/FloatingBtns/HelpDial.vue';
import Footer from '../components/Footer/Footer.vue';

export default {
  components: {
    Tutorial,
    Toolbar,
    HelpDial,
    Footer,
  },
  data() {
    return {
      scrollBarSettings: {
        wheelPropagation: false,
        maxScrollbarLength: 240,
        swipeEasing: true,
        wheelSpeed: 0.1,
      },
    };
  },
  computed: {
    ...mapGetters([
      'getSemesterStatus',
      'getExportOverlay',
      'fallTimetable',
      'winterTimetable',
      'fallSelectedCourses',
      'winterSelectedCourses',
      'fallLockedSections',
      'allowedConflictCourses',
      'winterLockedSections',
      'getFallLockedDayStatus',
      'getWinterLockedDayStatus',
      'getFallLockedHourStatus',
      'getWinterLockedHourStatus',
      'getClearStorage',
      'getCalendarCurrId',
      'getCalendarEvents',
    ]),
  },
  created() {
    if (localStorage.clearStorage !== this.getClearStorage) {
      localStorage.clear();
      this.clearStorage();
      localStorage.clearStorage = this.getClearStorage;
    }
    if (this.$isMobile()) {
      this.$router.push({ name: 'about' });
    } else {
      window.addEventListener('beforeunload', this.saveData);
    }
  },
  methods: {
    ...mapActions(['clearStorage']),
    // save the timetable data in the browser
    saveData() {
      localStorage.fallLockedSections = JSON.stringify(this.fallLockedSections);
      localStorage.allowedConflictCourses = JSON.stringify(this.allowedConflictCourses);
      localStorage.fallSelectedCourses = JSON.stringify(this.fallSelectedCourses);
      localStorage.fallTimetable = JSON.stringify(this.fallTimetable);
      localStorage.fallLockedDayStatus = JSON.stringify(this.getFallLockedDayStatus);
      localStorage.fallLockedHourStatus = JSON.stringify(this.getFallLockedHourStatus);
      localStorage.winterLockedSections = JSON.stringify(this.winterLockedSections);
      localStorage.winterSelectedCourses = JSON.stringify(this.winterSelectedCourses);
      localStorage.winterTimetable = JSON.stringify(this.winterTimetable);
      localStorage.winterLockedDayStatus = JSON.stringify(this.getWinterLockedDayStatus);
      localStorage.winterLockedHourStatus = JSON.stringify(this.getWinterLockedHourStatus);
      localStorage.calendarCurrId = JSON.stringify(this.getCalendarCurrId);
      localStorage.calendarEvents = JSON.stringify(this.getCalendarEvents);
    },
  },
};
</script>
<style scoped>
.timetableColumn {
  padding-top: 0px;
  height: 100%;
}
</style>
