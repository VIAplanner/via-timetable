<template>
  <div>
    <v-toolbar dark color="#012B5C" class="mt-3">
      <v-img
        src="../../assets/VIA-Planner-White.png"
        max-width="130"
        contain
        class="ma-2 ml-1"
      />
      <v-tabs
          grow
          style="max-width: 450px; min-width: 200px"
          v-model="tabs"
        >
        <v-tab key='timetable' to='/timetable'>
          TIMETABLE
        </v-tab>
        <v-tab key='calendar' to='/calendar'>
          CALENDAR
        </v-tab>
        <v-tab key='manager' to='/manager' @click="refresh">
          MANAGER
        </v-tab>
      </v-tabs>
      <course-search-bar style="margin: auto" />
      <switch-sem style="margin: auto" />
      <delivery-method-setting />
    </v-toolbar>
    <tabs-items v-model="tabs"/>
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>

import CourseSearchBar from './CourseSearchBar.vue';
import SwitchSem from './SwitchSem.vue';
import DeliveryMethodSetting from './DeliveryMethodSetting.vue';

export default {
  components: {
    CourseSearchBar,
    SwitchSem,
    DeliveryMethodSetting,
  },
  methods: {
    refresh() {
      window.location.reload()
    }
  },
}
</script>