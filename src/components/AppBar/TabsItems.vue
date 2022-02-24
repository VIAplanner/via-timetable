<template>
  <v-tabs-items 
    :value="value"
    @change="$emit('update:value', $event.target.value)"
  >
    <v-tab-item>
      <v-row>
        <v-col class="pa-0">
          <router-view />
        </v-col>
        <v-col cols="3" class="grey lighten-4 mr-2">
          <side-bar />
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item>
      <v-row>
        <v-col>
          <manager />
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item>
      <v-row>
        <v-col class="pa-0">
          <calendar />
        </v-col>
      </v-row>
    </v-tab-item>
  </v-tabs-items>
</template>

<script>

import Calendar from '../Calendar/Calendar.vue';
import SideBar from '../SidePanel/SideBar.vue';
import Manager from '../CourseManager/Manager.vue'

export default {
  components: {
    Calendar,
    SideBar,
    Manager,
  },
  props: {
    value: Number
  },
}
</script>