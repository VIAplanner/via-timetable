<template>
  <div @mouseover="hovered = true" @mouseleave="hovered = false">
    <v-tooltip left v-if="hovered">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="hovered"
          fab
          dark
          small
          color="green"
          @click="exportTimetables"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </template>
      <span>Export Timetable as ICS</span>
    </v-tooltip>
    <v-btn v-else fab dark small color="green">
      <v-icon>mdi-calendar</v-icon>
    </v-btn>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapGetters, mapMutations } from 'vuex';

/*
  Vue-ICS uses Javascript's Date class, so unfortunately we have to translate
  our relative dates to absolute dates (i.e. Monday 36400 -> Date(2021, 09, 9)).
  This means that updating this feature will be a manual chore each year.

  Updating Procedure:
  1. Go to UTM Important Dates and figure out the start/end dates for Fall & Winter
  2. Replace until with the end date
  3. Update createDate so dates are created on the first day of each semester
*/
export default {
  data() {
    return {
      hovered: true,
      exportURL: null,
    };
  },
  computed: {
    fallTimetable() {
      return this.$store.state.fallTimetable;
    },
    winterTimetable() {
      return this.$store.state.winterTimetable;
    },
    ...mapGetters(['getSemesterStatus']),
  },
  methods: {
    ...mapMutations(['setSemesterStatus', 'setExportOverlay']),
    async exportTimetables() {
      this.setExportOverlay(true);
      this.$ics.removeAllEvents(); // fresh slate in case user updated timetable since using prev.
      this.saveTimetable(this.fallTimetable, 'F');
      this.saveTimetable(this.winterTimetable, 'W');
      this.$ics.download('ViaPlanner Timetable');
      this.setExportOverlay(false);
    },
    createDate(semester, weekday, time) {
      let year = 2023;
      let month = 8;
      let startingDay = 6;
      let weekdayToDayIndex = {
        MONDAY: 5,
        TUESDAY: 6,
        WEDNESDAY: 0,
        THURSDAY: 1,
        FRIDAY: 2,
      };

      if (semester === 'W') {
        year = 2024;
        month = 0;
        startingDay = 8;
        weekdayToDayIndex = {
          MONDAY: 0,
          TUESDAY: 1,
          WEDNESDAY: 2,
          THURSDAY: 3,
          FRIDAY: 4,
        };
      }
      return new Date(
        year,
        month,
        startingDay + weekdayToDayIndex[weekday],
        time / 3600,
      );
    },
    saveTimetable(timetable, semester) {
      const until =
        semester === 'F' ? new Date(2023, 12, 5) : new Date(2024, 4, 5);
      Object.entries(timetable).forEach((day) => {
        const weekday = day[0],
          sections = day[1];
        sections.forEach((section) => {
          const start = this.createDate(semester, weekday, section.start);
          const end = this.createDate(semester, weekday, section.end);
          this.$ics.addEvent(
            'en-us',
            `${section.code} ${section.sectionCode}`,
            '',
            section.location,
            start,
            end,
            '',
            null,
            {
              freq: 'WEEKLY',
              until,
              interval: 1,
            },
          );
        });
      });
    },
  },
};
</script>
