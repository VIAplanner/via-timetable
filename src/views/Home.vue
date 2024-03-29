<template>
  <v-row>
    <v-col class="ma-0 pt-0 pb-0">
      <!-- Popup tutorial -->
      <tutorial />
      <!--Exporting Progress Overlay-->
      <v-overlay :value="getExportOverlay">
        <v-row>
          <h1 class="ma-3">Exporting</h1>
          <h1 class='ma-3'>Exporting</h1>
        </v-row>
        <v-row justify="center">
          <v-progress-circular
            indeterminate
            size="64"
            style="margin-left: auto; margin-right: auto;"
          ></v-progress-circular>
        </v-row>
      </v-overlay>

      <v-toolbar dark color="#012B5C" height="75px" class="pa-1" elevation="0">
        <v-img
          src="../assets/VIA-Planner-White.png"
          max-width="130"
          contain
          class="ma-2 ml-1"
        />
        <v-btn icon @click='undo()'>
          <v-icon>mdi-undo</v-icon>
        </v-btn>
        <v-btn icon @click='redo()'>
          <v-icon>mdi-redo</v-icon>
        </v-btn>
        <course-search-bar style="margin: auto" />
        <switch-sem style="margin: auto" />
        <change-theme style="margin: auto"/>
        <delivery-method-setting />
      </v-toolbar>
      <v-row>
        <v-col class="pa-0">
          <router-view />
          <v-footer style='background:none'>
            <v-row>
              <v-col class="pa-0">
                <h1 style="text-align:center" class="text-subtitle-1">
                  Copyright © 2023 VIAplanner - Data updated for the 2023 - 2024
                  school year
                </h1>
              </v-col>
            </v-row>
          </v-footer>
        </v-col>
        <v-col cols='3' :class='$vuetify.theme.dark ? "darken-4": "lighten-4"'
               class='grey mr-2'>
          <side-bar />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import CourseSearchBar from '../components/AppBar/CourseSearchBar.vue';
import Tutorial from '../components/Popup/Tutorial.vue';
import SwitchSem from '../components/AppBar/SwitchSem.vue';
import SideBar from '../components/SidePanel/SideBar.vue';
import DeliveryMethodSetting
  from '../components/AppBar/DeliveryMethodSetting.vue';
import ChangeTheme from '../components/AppBar/ChangeTheme.vue';

export default {
  components: {
    ChangeTheme,
    SwitchSem,
    CourseSearchBar,
    Tutorial,
    SideBar,
    DeliveryMethodSetting,
  },
  async beforeCreate() {
    if (this.$route.query.timetable) {
      try {
        const res = await fetch(`https://api.mclo.gs/1/raw/${this.$route.query.timetable}`);
        const data = await res.text();
        ;
        this.loadState(data);
      } catch (err) {
        console.log(err);
        console.log('Error loading timetable');
      }
    }
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
      'getHistoryLength',
    ]),
  },
  created() {
    if (localStorage.darkMode === 'true') {
      this.$vuetify.theme.dark = true;
    }
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
    this.saveState();
  },
  methods: {
    ...mapActions(['clearStorage', 'undo', 'redo', 'saveState']),
    ...mapMutations(['loadState', 'regenerateColors']),
    // save the timetable data in the browser
    saveData() {
      if (this.getHistoryLength <= 1) {
        return;
      }
      localStorage.darkMode = this.$vuetify.theme.dark;
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
