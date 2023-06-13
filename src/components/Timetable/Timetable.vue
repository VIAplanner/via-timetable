<template>
  <div>
    <v-container class="background" style="padding-top: 50px !important; padding-right: 50px !important;">
      <v-row>
        <NoTimetablePopup></NoTimetablePopup>
        <ShareLinkPopup></ShareLinkPopup>

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
                class="test"
                :style="`
              display: ${event.start > 0 ? 'flex': ''};
            `"
              >
                <template
                  :v-if="event.start > 0"
                >
                  <template
                    v-for="course in event.courses"
                  >
                    <template
                      :v-if="course.start > 0"
                    >
                      <timetable-event
                      :key="course.code"
                      :event="course"
                      :semester="semester"

                      />
                    </template>
                    <timetable-event
                      :key="course.start"
                      :event="course"
                      :semester="semester"
                      v-if="course.start < 0"
                    />
                  </template>
                </template>
                <timetable-event
                  :event="event"
                  :semester="semester"
                  v-if="event.start < 0"
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
import ShareLinkPopup from '../Popup/ShareLinkPopup.vue';
import HourSwitch from './HourSwitch.vue';
import WeekdaySwitch from './WeekdaySwitch.vue';
import TimetableCourseCard from './TimetableCourseCard.vue';

const convertSecondsToHours = seconds => seconds / 3600;
export default {
  name: 'Timetable',
  components: {
    ShareLinkPopup,
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
      // If the timetable is empty, then start is < 0, so flag would be true. 
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
     
      const meetingResults = meetingSections.map(m => {
        m.currStart = m.start;
        m.currEnd = m.end;
        return m;
      })
      // Sort every event by start time
      meetingResults.sort((a, b) => a.currStart - b.currStart);
      // Need to find the biggest overlapping section. 
      const sortedTimeEvents = [];
      // current start and end times. 
      let start, end;
      const HOUR_OFFSET = 3600;

      for(let i = 0; i < meetingResults.length; i+=1){
        if (meetingResults[i].code.includes('Lock')) {
          result.push({
            start: invalidStart,
            currStart: meetingResults[i].start,
            currEnd: meetingResults[i].start + HOUR_OFFSET,
          });
          invalidStart -= 1;
          // eslint-disable-next-line no-continue
          continue;
        }
        start = meetingResults[i].start;
        end = meetingResults[i].end;
        // Contains all courses overlapping from a given range (s, e)
        const overlappingCourses = [meetingResults[i]];
        // Loop through next course onwards to find max overlap.
        let j;
        for (j=i+1; j < meetingResults.length; j+=1) {
          // This course is not overlapping anymore, so get the out of this loop
          if (meetingResults[j].currStart >= end || meetingResults[j].end <= start){
            break;
          }
          // The course is overlapping. 
          // Update the end value to be the greater of current end or new end
          end = meetingResults[j].end > end ? meetingResults[j].end : end;
          start = meetingResults[j].currStart < start ? meetingResults[j].currStart : start;
          // Add this new overlapping course. 
          overlappingCourses.push({...meetingResults[j]});
        }
        // Update all of the courses' ends (overlap period's end) and currEnd (each courses' end)
        for (let k = 0; k < overlappingCourses.length; k+=1) {
          overlappingCourses[k].olap_end = end;
          overlappingCourses[k].olap_start = start;
        }

        // Push the new result. 
        sortedTimeEvents.push({
        currStart: start,
        currEnd: end,
        start,
        courses: overlappingCourses
        });
        // Update the i value, since we already looked at the next courses. 
        i = j-1;
      }
      // Add padding to sortedtimeEvents depending on currStart and currEnd 
      const finalResult = [];
      let sortedIndex = 0;
      currTime *= HOUR_OFFSET;
      // Loop through the entire time zones
      while (currTime < this.timetableEnd * HOUR_OFFSET) {
        if (sortedIndex < sortedTimeEvents.length && currTime === sortedTimeEvents[sortedIndex].currStart) {
          // Add event 
          finalResult.push(sortedTimeEvents[sortedIndex]);
          // Move currTime to end of this overlap section 
          currTime = sortedTimeEvents[sortedIndex].currEnd;
          sortedIndex+=1;
        }
        // If currTime is half an hour, extend it to full hour 
        else if (currTime - (HOUR_OFFSET/2) % HOUR_OFFSET === 0){
          finalResult.push({
              start: -invalidStart,
              currStart: currTime,
              currEnd: currTime + HOUR_OFFSET / 2,
            });
            invalidStart -= 1;
            currTime += HOUR_OFFSET / 2;
        }
        // Add hour padding
        else {
          finalResult.push({
              start: invalidStart,
              currStart: currTime,
              currEnd: currTime + HOUR_OFFSET,
            });
            invalidStart -= 1;
            currTime += HOUR_OFFSET;
        }
      }
      return finalResult;

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
