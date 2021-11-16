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

      <v-toolbar dark color="#012B5C" height="65px" class="pa-1" elevation="0">
        <v-img
          src="../assets/VIA-Planner-White.png"
          max-width="130"
          contain
          class="ma-2 ml-1"
        />
        <v-tabs
          grow
          style="max-width: 250px; min-width: 250px"
        >
          <v-tab>TIMETABLE</v-tab>
        </v-tabs>
        <course-search-bar style="margin: auto" />
        <switch-sem style="margin: auto" />
        <delivery-method-setting />
      </v-toolbar>
      <v-row>
        <v-col class="pa-0">
          <router-view />
          <v-footer class="white">
            <v-row>
              <v-col class="pa-0">
                <h1 style="text-align:center" class="text-subtitle-1">
                  Copyright © 2021 VIAplanner - Data updated for the 2021 - 2022
                  school year
                </h1>
              </v-col>
            </v-row>
          </v-footer>
        </v-col>
        <v-col cols="3" class="grey lighten-4 mr-2">
          <side-bar />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CourseSearchBar from '../components/AppBar/CourseSearchBar.vue';
import Tutorial from '../components/Popup/Tutorial.vue';
import SwitchSem from '../components/AppBar/SwitchSem.vue';
import SideBar from '../components/SidePanel/SideBar.vue';
import DeliveryMethodSetting from '../components/AppBar/DeliveryMethodSetting.vue';

export default {
  components: {
    SwitchSem,
    CourseSearchBar,
    Tutorial,
    SideBar,
    DeliveryMethodSetting,
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
      localStorage.fallSelectedCourses = JSON.stringify(
        this.fallSelectedCourses,
      );
      localStorage.fallTimetable = JSON.stringify(this.fallTimetable);
      localStorage.fallLockedDayStatus = JSON.stringify(
        this.getFallLockedDayStatus,
      );
      localStorage.fallLockedHourStatus = JSON.stringify(
        this.getFallLockedHourStatus,
      );
      localStorage.winterLockedSections = JSON.stringify(
        this.winterLockedSections,
      );
      localStorage.winterSelectedCourses = JSON.stringify(
        this.winterSelectedCourses,
      );
      localStorage.winterTimetable = JSON.stringify(this.winterTimetable);
      localStorage.winterLockedDayStatus = JSON.stringify(
        this.getWinterLockedDayStatus,
      );
      localStorage.winterLockedHourStatus = JSON.stringify(
        this.getWinterLockedHourStatus,
      );
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
