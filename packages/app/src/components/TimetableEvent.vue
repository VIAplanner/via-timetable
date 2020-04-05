<template>
  <div>
    <div v-if="event.start > 0">
      <v-dialog v-model="dialog" width="800px">
        <template v-slot:activator="{ on }">
          <div
            @mouseover="hovered = true"
            @mouseleave="hovered = false"
            v-on="on"
            class="event"
            :class="durationClass(event.start, event.end)"
            :style=" { background: color }"
          >
            <h4 class="course-code">{{courseCodeWithoutTerm(event.courseCode)}}</h4>

            <div class="lock-button">
              <v-btn dark @click.stop="reverseLockStatus" v-if="locked" icon>
                <v-icon>mdi-lock</v-icon>
              </v-btn>
              <v-btn dark @click.stop="reverseLockStatus" v-if="!locked && hovered" icon>
                <v-icon>mdi-lock-open</v-icon>
              </v-btn>
            </div>

            <div style="margin-left: 3px;">{{event.section}}</div>

            <div style="position: relative;">
              <div class="align-left">{{getFormattedTime(event.start, event.end)}}</div>
              <div class="align-right">{{event.location}}</div>
            </div>
          </div>
        </template>
        <course-section-picker v-on:done="dialog=false" :timetable="timetable" :code="event.courseCode"/>
      </v-dialog>
    </div>
    <div class="event empty-event one-hour" v-else></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CourseSectionPicker from "../components/CourseSectionPicker";

const convertSecondsToHours = seconds => {
  return seconds / 3600;
};
export default {
  name: "timetable-event",
  props: {
    event: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default: "#83CC77"
    }
  },
  components: {
    CourseSectionPicker,
  },
  data() {
    return {
      locked: false,
      hovered: false,
      dialog: false
    };
  },
  computed: {
    ...mapState([
      'timetable',
    ])
  },
  methods: {
    reverseLockStatus() {
      this.locked = !this.locked;
    },
    durationClass(start, end) {
      const duration = convertSecondsToHours(end - start);
      if (duration === 1) {
        return "one-hour";
      } else if (duration === 2) {
        return "two-hours";
      } else if (duration === 3) {
        return "three-hours";
      }
    },
    getFormattedTime(start, end) {
      return `${(start / 3600) % 12}:00 - ${(end / 3600) % 12}:00`;
    },
    courseCodeWithoutTerm(code) {
      return code.substring(0, code.length - 1);
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
* {
  font-family: "Montserrat", sans-serif;
}

.event {
  border: 0.2px solid gray;
  color: white;
  padding: 8px;
  position: relative;
  cursor: pointer;
}
.empty-event {
  background: white !important;
  border: 0.2px solid gray;
  cursor: default;
}
.one-hour {
  height: 84px;
}

.two-hours {
  height: 168px;
}

.three-hours {
  height: 252px;
}

.course-code {
  margin-bottom: 3px;
  margin-left: 3px;
}

.align-left {
  position: absolute;
  left: 3px;
}

.align-right {
  position: absolute;
  right: 5px;
}

.lock-button {
  position: absolute;
  right: 3px;
  top: 3px;
  z-index: 1;
}
</style>