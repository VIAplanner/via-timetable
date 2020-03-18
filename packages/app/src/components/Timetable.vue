<template>
  <v-container>
    <v-row>
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
  </v-container>
</template>

<script>
import TimetableEvent from "./TimetableEvent";

const TIMETABLE_START = 9;
const TIMETABLE_END = 22;

const convertSecondsToHours = seconds => {
  return seconds / 3600;
};

export default {
  name: "timetable",
  components: {
    TimetableEvent
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
    }
  },
  data() {
    return {
      colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
      timetable: {
        Monday: [
          {
            courseCode: "CSC258H5S",
            section: "L0101",
            start: 32400,
            end: 39600
          },
          {
            courseCode: "STA258H5S",
            section: "L0101",
            start: 54000,
            end: 61200
          }
        ],
        Tuesday: [
          {
            courseCode: "CSC207H5S",
            section: "L0101",
            start: 39600,
            end: 46800
          },
          {
            courseCode: "CSC258H5S",
            section: "P0109",
            start: 61200,
            end: 64800
          }
        ],
        Wednesday: [
          {
            courseCode: "CSC290H5S",
            section: "L0101",
            start: 50400,
            end: 57600
          },
          {
            courseCode: "STA258H5S",
            section: "T0105",
            start: 61200,
            end: 64800
          }
        ],
        Thursday: [
          {
            courseCode: "CSC290H5S",
            section: "T0101",
            start: 39600,
            end: 46800
          },
          {
            courseCode: "CSC209H5S",
            section: "P0111",
            start: 61200,
            end: 64800
          }
        ],
        Friday: [
          {
            courseCode: "CSC209H5S",
            section: "L0104",
            start: 50400,
            end: 57600
          }
        ]
      },
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    };
  },
  methods: {
    getEventsForDay(meetingSections) {
      const result = [];
      let currTime = TIMETABLE_START;
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
          for (let k = 0; k < TIMETABLE_END - currTime; k++) {
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

<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");

body {
  font-family: "Montserrat", sans-serif;
}

.col {
  padding: 0px !important;
}
</style>
