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
        <v-tab>TIMETABLE</v-tab>
        <v-tab>MANAGER</v-tab>  
        <v-tab>CALENDAR</v-tab>  
      </v-tabs>
      <course-search-bar style="margin: auto" />
      <switch-sem style="margin: auto" />
      <delivery-method-setting />
    </v-toolbar>
    <tabs-items v-model="tabs"/>
  </div>
</template>

<script>

import CourseSearchBar from './CourseSearchBar.vue';
import SwitchSem from './SwitchSem.vue';
import DeliveryMethodSetting from './DeliveryMethodSetting.vue';
import TabsItems from './TabsItems.vue';

export default {
  components: {
    CourseSearchBar,
    SwitchSem,
    DeliveryMethodSetting,
    TabsItems,
  },
  data() {
    return {
      tabs: null
    }
  }
}
</script>