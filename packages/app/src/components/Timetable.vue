<template>
  <div>
    <v-container class="background">
      <v-row>
        <v-col class="time-axis">
          <div class="top-margin"></div>
          <div v-for="time in timeRange" :key="time" class="time-axis-number">
            <h3 class="time-label">{{time}}</h3>
          </div>
        </v-col>
        <v-col cols="11">
          <v-row name="week-days-axis">
            <v-col v-for="weekday in weekdays" :key="weekday">
              <h2 style="margin-bottom:16px;">{{weekday}}</h2>
            </v-col>
          </v-row>
          <v-row name="timetable-content">
            <v-col v-for="(meetingSections, day) in timetable" :key="day">
              <div v-for="event in getEventsForDay(meetingSections)" :key="event.start">
                <timetable-event :event="event" :color="courseCodeColorMap.get(event.courseCode)" />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TimetableEvent from "./TimetableEvent";

const convertSecondsToHours = seconds => {
  return seconds / 3600;
};

export default {
  name: "Timetable",
  components: {
    TimetableEvent
  },
  props: {
    timetable: {
      type: Object,
    },
  },
  computed: {
    courseCodeColorMap() {
      const codeColorMap = new Map();
      var index = 0;
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          if (!codeColorMap.has(event.courseCode)) {
            codeColorMap.set(event.courseCode, this.colors[index]);
            index++;
          }
        }
      }
      return codeColorMap;
    },
    timetableStart() {
      var earliest = 9;
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          const start = convertSecondsToHours(event.start);
          if (start < earliest) {
            earliest = start;
          }
        }
      }
      return earliest;
    },
    timetableEnd() {
      var latest = 18;
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
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
      for (let i = this.timetableStart; i <= this.timetableEnd; i++) {
        if (i > 12) {
          result.push(`${i % 12} PM`);
        } else if (i == 12) {
          result.push(`${12} PM`);
        } else {
          result.push(`${i % 12} AM`);
        }
      }
      return result;
    }
  },
  data() {
    return {
      colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    };
  },
  methods: {
    getEventsForDay(meetingSections) {
      const result = [];
      let currTime = this.timetableStart;
      let invalidStart = -1;

      for (let i = 0; i < meetingSections.length; i++) {
        const event = meetingSections[i];
        const eventStart = convertSecondsToHours(event.start);
        const eventEnd = convertSecondsToHours(event.end);
        // Pad empty events before the start of the first class
        for (let j = 0; j < eventStart - currTime; j++) {
          result.push({ start: invalidStart });
          invalidStart--;
        }
        result.push(event);
        currTime = eventEnd;

        //If last event, pad empty events after it
        if (i === meetingSections.length - 1) {
          for (let k = 0; k < this.timetableEnd - currTime; k++) {
            result.push({ start: invalidStart });
            invalidStart--;
          }
        }
      }
      return result;
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
* {
font-family: "Montserrat", sans-serif;
}
.col {
  padding: 0px !important;
}

.background {
    border: 0.2px solid gray;
    background-color: white;
}

.container {
  padding: 24px !important;
}

.time-axis-number {
  height: 84px;
}

.top-margin {
  margin-bottom: 35px;
}

.time-axis {
  margin-right: 25px;
}

.time-label {
  text-align: right;
}
</style>