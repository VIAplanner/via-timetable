<template>
  <v-col
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    justify="center"
  >
    <h2 class="hour-label">{{ time }}</h2>
    <div v-if="!last && (hovered || locked)">
      <v-btn @click="unlockHour" v-if="locked" icon>
        <v-icon>mdi-lock</v-icon>
      </v-btn>
      <v-btn @click="lockHour" v-else icon>
        <v-icon>mdi-lock-open</v-icon>
      </v-btn>
    </div>
  </v-col>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  data() {
    return {
      hovered: false,
      currStart: 28800,
    };
  },
  props: {
    time: String,
    last: Boolean,
    semester: String,
  },
  computed: {
    ...mapGetters([
      'timetable',
      'getNoTimetablePopup',
      'getLockedHourStatus',
      'getLockedSections',
    ]),
    locked() {
      return this.getLockedHourStatus[this.time];
    },
  },
  methods: {
    ...mapActions([
      'selectCourse',
      'deleteCourse',
      'saveTimetable',
      'resetTimetable',
      'saveLockedHourStatus',
      'saveState'
    ]),
    ...mapMutations(['lockSection', 'setLockedHourStatus', 'addCourse']),
    currSecData(weekday) {
      return {
        name: `Locked Section`,
        courseCode: `Lock${this.semester}${weekday}${this.currStart}`,
        meeting_sections: [
          {
            sectionCode: 'L0001',
            instructors: ['NA'],
            times: [
              {
                day: weekday,
                start: this.currStart,
                end: this.currStart + 3600,
                location: 'NA',
              },
            ],
          },
        ],
      };
    },

    // Return the hour this switch is trying to lock
    converter() {
      let partsOfTheDay, hours, parts;
      if (this.time.length === 4) {
        partsOfTheDay = this.time.slice(2, 4);
        hours = this.time.slice(0, 1);
        parts = partsOfTheDay === 'AM' ? 0 : 12;
        if (parseInt(hours) === 12) {
          hours = parseInt(hours) - 12;
        }
        hours = parseInt(hours) + parts;
      } else {
        partsOfTheDay = this.time.slice(3, 5);
        hours = this.time.slice(0, 2);
        parts = partsOfTheDay === 'AM' ? 0 : 12;
        if (parseInt(hours) === 12) {
          hours = parseInt(hours) - 12;
        }
        hours = parseInt(hours) + parts;
      }
      return hours * 3600;
    },
    // Returns all sections occupying the hour to be locked excluding locked sections
    courseAtTheHour() {
      const courses = [];
      const weekdays = Object.keys(this.timetable);
      for (const weekday of weekdays) {
        this.timetable[weekday].forEach(element => {
          if (!element.code.includes('Lock')) {
            if (
              element.start < this.converter() &&
              element.end > this.converter()
            ) {
              courses.push(element);
            } else if (
              this.converter() <= element.start &&
              element.start < this.converter() + 3600
            ) {
              courses.push(element);
            }
          }
        });
      }
      return courses;
    },
    lockHour() {
      this.saveLockedHourStatus();
      this.setLockedHourStatus(this.time);
      this.saveTimetable();
      const weekdays = Object.keys(this.timetable);
      // console.log(this.courseAtTheHour())
      const flag = this.courseAtTheHour().some(
        element =>
          !this.getLockedSections.includes(
            `${element.code}${element.sectionCode}`,
          ),
      );

      this.currStart = this.converter();
      for (const weekday of weekdays) {
        if (this.validLockSection(weekday)) {
          this.lockSection(
            `${this.currSecData(weekday).courseCode}${
              this.currSecData(weekday).meeting_sections[0].sectionCode
            }`,
          );
          this.addCourse({ course: this.currSecData(weekday) });
        }
      }

      if (flag) {
        this.resetTimetable(true);
      }
    },
    unlockHour() {
      this.setLockedHourStatus(this.time);
      for (let i = 0; i < 4; i += 1) {
        this.currStart = this.converter();
        for (const lockedCourse of this.getLockedSections) {
          if (lockedCourse.includes(this.currStart)) {
            this.deleteCourse({
              code: lockedCourse.slice(0, lockedCourse.length - 5),
            });
          }
        }
      }
      this.saveState()
    },
    validLockSection(weekday) {
      for (const course of this.courseAtTheHour()) {
        if (
          course.day === weekday &&
          this.getLockedSections.includes(`${course.code}${course.sectionCode}`)
        ) {
          return false;
        }
      }

      return true;
    },
  },
};
</script>

<style scoped>
.hour-label {
  margin-right: 10px;
  font-size: 16px;
}
</style>
