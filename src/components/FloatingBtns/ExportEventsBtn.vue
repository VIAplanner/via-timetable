<template>
  <v-row @mouseover="hovered = true" @mouseleave="hovered = false">
    <v-tooltip left v-if="hovered">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="hovered"
          fab
          dark
          small
          color="green"
          @click="exportEvents"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-calendar-star</v-icon>
        </v-btn>
      </template>
      <span>Export Assessments as ICS</span>
    </v-tooltip>
    <v-btn v-else fab dark small color="green">
      <v-icon>mdi-calendar-star</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
/* eslint-disable no-console */
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      hovered: true,
      exportURL: null,
    };
  },
  computed: {
    events() {
      const events = {};
      for (const [key, value] of Object.entries(this.$store.state.fallSelectedCourses)){
        events[key] = value.assessments
      }
      for (const [key, value] of Object.entries(this.$store.state.winterSelectedCourses)){
        events[key] = value.assessments
      }
      return events
    },
  },
  methods: {
    ...mapMutations(['setExportOverlay']),
    async exportEvents() {
      this.setExportOverlay(true);  
      this.$ics.removeAllEvents(); // fresh slate in case user updated events since using prev.
      this.saveEvents();
      this.$ics.download("ViaPlanner Assessments");
      this.setExportOverlay(false);
    },
    saveEvents() {
      for (const [course, events] of Object.entries(this.events)){
        if (typeof events !== 'undefined') {
          for (let i = 0; i < events.length; i += 1){
            const splitDate = events[i].deadline.split("-", 3)
            const date = new Date(splitDate[0], parseInt(splitDate[1]) - 1, splitDate[2])
            this.$ics.addEvent("en-us", `(${course}) ${events[i].type}`, `${events[i].description}`, "", date, date, "", null, null)
          }
        }
      }
    },
  },
};
</script>