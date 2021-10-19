<template>
  <div>
    <v-container class="background" style="padding-top: 50px !important; padding-right: 50px !important;">
      <v-row>
        <NoTimetablePopup></NoTimetablePopup>
        <v-col class="time-axis">
          <div class="top-margin"></div>
          <v-row
            v-for="(time, index) in timeRange"
            :key="index"
            class="time-axis-number"
            :style="{ height: oneHourHeight }"
          >
            <hour-switch
              v-if="index != timeRange.length - 1"
              :time="time"
              :last="false"
              :semester="semester"
            ></hour-switch>
            <hour-switch
              v-else
              :time="time"
              :last="true"
              :semester="semester"
            ></hour-switch>
          </v-row>
        </v-col>
        <v-col cols="11">
          <v-row name="week-days-axis">
            <v-col v-for="weekday in weekdays" :key="weekday">
              <weekday-switch
                :weekday="weekday"
                :semester="semester"
              ></weekday-switch>
            </v-col>
          </v-row>
          <v-row name="timetable-content" style="padding-top: 20px !important;">
            <v-col v-for="(meetingSections, day) in timetable" :key="day">
              <div
                v-for="event in getEventsForDay(meetingSections)"
                :key="event.start"
              >
                <timetable-event
                  :event="event"
                  :semester="semester"
                  v-if="event.start > 0"
                />
                <timetable-event
                  :event="event"
                  :semester="semester"
                  v-else
                  :currDay="day"
                />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="getExportOverlay">
      <timetable-course-card
        class="my-4 mr-7 ml-11"
        v-for="(course, code) in getSelectedCourses"
        :key="code"
        :course="course"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import TimetableEvent from './TimetableEvent.vue';
import NoTimetablePopup from '../Popup/NoTimetablePopup.vue';
import HourSwitch from './HourSwitch.vue';
import WeekdaySwitch from './WeekdaySwitch.vue';
import TimetableCourseCard from './TimetableCourseCard.vue';

const convertSecondsToHours = seconds => seconds / 3600;
export default {
  name: 'Timetable',
  components: {
    TimetableEvent,
    WeekdaySwitch,
    HourSwitch,
    NoTimetablePopup,
    TimetableCourseCard,
  },
  props: {
    timetable: {
      type: Object,
    },
    semester: {
      type: String,
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  computed: {
    ...mapGetters(['getLockedSections', 'selectedCourses', 'getExportOverlay']),
    timetableStart() {
      let earliest = 9;
      for (const day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (const event of dayEvents) {
          const start = convertSecondsToHours(event.start);
          if (start < earliest) {
            earliest = start;
          }
        }
      }
      return earliest;
    },
    oneHourHeight() {
      // the height of the axis will be be at least 65 px
      if ((this.height - 168) / 9 > 65) {
        return `${(this.height - 168) / 9}px`;
      } else {
        return `65px`;
      }
    },
    timetableEnd() {
      let latest = 18;
      for (const day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (const event of dayEvents) {
          const end = convertSecondsToHours(event.end);
          if (end > latest) {
            latest = end;
          }
        }
      }
      return latest;
    },
    timeRange() {
      const result = [];
      for (let i = this.timetableStart; i <= this.timetableEnd; i += 1) {
        if (i > 12) {
          result.push(`${i % 12} PM`);
        } else if (i === 12) {
          result.push(`${12} PM`);
        } else {
          result.push(`${i % 12} AM`);
        }
      }
      return result;
    },
    // filters user lock timeslots
    getSelectedCourses() {
      // eslint-disable-next-line no-unused-expressions
      this.timetable; // force re-render the selected courses
      const filteredCourses = {};
      for (const code in this.selectedCourses(this.semester)) {
        if (!code.includes('Lock')) {
          filteredCourses[code] = this.selectedCourses(this.semester)[code];
        }
      }
      return filteredCourses;
    },
  },
  data() {
    return {
      colors: ['#FBB347', '#83CC77', '#4C91F9', '#F26B83', '#5CD1EB'],
      weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      height: window.innerHeight,
    };
  },
  methods: {
    ...mapMutations(['lockSection', 'unlockSection']),
    handleResize() {
      this.height = window.innerHeight;
    },
    getEventsForDay(meetingSections) {
      const result = [];
      let currTime = this.timetableStart;
      let invalidStart = -1;
      const flag = meetingSections.every(event => {
        const eventStart = convertSecondsToHours(event.start);
        const eventEnd = convertSecondsToHours(event.end);

        return eventStart < this.timetableStart || eventEnd > this.timetableEnd;
      });
      if (meetingSections.length === 0 || flag) {
        for (let j = 0; j < this.timetableEnd - this.timetableStart; j += 1) {
          result.push({
            start: invalidStart,
            currStart: (currTime + j) * 3600,
            currEnd: (currTime + j + 1) * 3600,
          });
          invalidStart -= 1;
        }
        return result;
      }
      for (let i = 0; i < meetingSections.length; i += 1) {
        const event = meetingSections[i];
        const eventStart = convertSecondsToHours(event.start);
        const eventEnd = convertSecondsToHours(event.end);

        // if the current locked event starts before the timetable start time
        if (eventStart < this.timetableStart) {
          // eslint-disable-next-line no-continue
          continue;
        } else if (eventStart >= this.timetableEnd) {
          break;
        }

        // Pad empty hour or half hours before the event
        // If event starts at whole hour
        if (Number.isInteger(eventStart - currTime)) {
          for (let j = 0; j < eventStart - currTime; j += 1) {
            result.push({
              start: invalidStart,
              currStart: (currTime + j) * 3600,
              currEnd: (currTime + j + 1) * 3600,
            });
            invalidStart -= 1;
          }
        }
        // If event starts at half hour
        else {
          // there is half hour exist
          // previous end time is one hour
          // eslint-disable-next-line no-lonely-if
          if (Number.isInteger(currTime)) {
            for (let j = 0; j < eventStart - currTime - 1; j += 1) {
              result.push({
                start: invalidStart,
                currStart: (currTime + j) * 3600,
                currEnd: (currTime + j + 1) * 3600,
              });
              invalidStart -= 1;
            } // pushing in half hour
            result.push({
              start: invalidStart,
              currStart: (eventStart - 0.5) * 3600,
              currEnd: eventStart * 3600,
            });
            invalidStart -= 1;
            // previous end time is full hour
          } else {
            result.push({
              start: invalidStart,
              currStart: currTime * 3600,
              currEnd: (currTime + 0.5) * 3600,
            });
            invalidStart -= 1;
            for (let j = 0; j < eventStart - (currTime + 0.5); j += 1) {
              result.push({
                start: invalidStart,
                currStart: (currTime + 0.5 + j) * 3600,
                currEnd: (currTime + 0.5 + j + 1) * 3600,
              });
              invalidStart -= 1;
            }
          }
        }

        // Make a block for the current event
        // if the section is a user locked section, pass it in as a locked event
        if (event.code.includes('Lock')) {
          result.push({
            start: invalidStart,
            currStart: event.start,
            currEnd: event.start + 3600,
          });
          invalidStart -= 1;
        } else {
          event.currStart = event.start;
          result.push(event);
        }

        currTime = eventEnd;

        // If last event, pad empty events after it
        if (
          i === meetingSections.length - 1 ||
          convertSecondsToHours(meetingSections[i + 1].start) >=
            this.timetableEnd
        ) {
          // half hour
          if (!Number.isInteger(currTime)) {
            result.push({
              start: invalidStart,
              currStart: currTime * 3600,
              currEnd: (currTime + 0.5) * 3600,
            });
            invalidStart -= 1;
            currTime += 0.5;
          }
          for (let k = 0; k < this.timetableEnd - currTime; k += 1) {
            result.push({
              start: invalidStart,
              currStart: (currTime + k) * 3600,
              currEnd: (currTime + k + 1) * 3600,
            });
            invalidStart -= 1;
          }
        }
      }
      return result;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
* {
  font-family: 'Montserrat', sans-serif;
}
.col {
  padding: 0px !important;
}

.background {
  background-color: white;
}

.container {
  padding-left: 24px !important;
  padding-right: 70px !important;
  padding-top: 20px !important;
  padding-bottom: 0px !important;
}

.time-axis-number {
  text-align: right;
}
.top-margin {
  margin-bottom: 25px;
}

.time-axis {
  margin-right: 20px;
}

.time-label {
  text-align: right;
}
</style>
