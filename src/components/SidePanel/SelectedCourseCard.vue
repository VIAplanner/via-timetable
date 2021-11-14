<template>
  <v-expansion-panel
    style="min-width: 98%; border-radius: 5px !important;"
    class="mb-1"
  >
    <v-expansion-panel-header
      class="pa-0 pr-2"
      style="max-height: 50px !important; border-top-left-radius: 5px; border-bottom-left-radius: 5px;"
    >
      <div
        class="mr-3 card-header"
        :style="
          `background-color: ${course.color};  border-top-left-radius: 5px; border-bottom-left-radius: 5px;`
        "
      >
        <p></p>
      </div>
      <div style="color: #474747">
        <h3>{{ course.courseCode }}</h3>
      </div>
       <v-btn icon @click.native.stop @click="addOrRemoveConflictCourse({code: course.courseCode } )" color="#474747" max-width="40" max-height="40">
            <v-icon v-if="isConflict">mdi-book-multiple</v-icon>
            <v-icon v-else>mdi-book-variant</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" scrollable width="825px" @input="atInput">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" color="#474747" max-width="40" max-height="40">
            <v-icon>mdi-pencil-box-outline</v-icon>
          </v-btn>
        </template>
        <course-section-picker
          v-on:done="dialog = false"
          :code="course.courseCode"
          ref="popUp"
        />
      </v-dialog>
      <v-btn
        color="#474747"
        @click="deleteCourse({ code: course.courseCode })"
        max-width="40"
        max-height="40"
        icon
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <hr class="mb-1" />
      <div class="pa-3">
        <div v-for="(section, code) of meetingSections" :key="code">
          <v-row>
            <div style="font-size: 15px">
              {{ code }}
            </div>
          </v-row>
          <v-row
            v-for="time in section"
            :key="`${time.day}${time.start}`"
            class="ml-2"
            style="font-size: small"
          >
            <v-col class="pa-0" cols="3">
              <p>
                {{ getProperDayName(time.day) }}
              </p>
            </v-col>
            <v-col class="pa-0" cols="5">
              <p>
                {{ getFormattedTime(time.start, time.end) }}
              </p></v-col
            >
            <v-col cols="4" class="pa-0">
              <p style="text-align: center">
                {{ time.location }}
              </p>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import CourseSectionPicker from '../Popup/CourseSectionPicker.vue';

export default {
  name: 'selected-course-card',
  components: {
    CourseSectionPicker,
  },
  props: {
    course: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters(['timetable', 'selectedCourses', 'isConflictedCourse']),
    isConflict(){
      return this.isConflictedCourse(this.course.courseCode);
    },
    meetingSections() {
      const sections = {};
      for (const day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (const event of dayEvents) {
          if (event.code === this.course.courseCode) {
            const instructor =
              event.instructors.length === 0 ? 'TBA' : event.instructors[0];
            let loc;
            if (event.location.length > 0) {
              loc = event.location;
            } else if (event.method !== 'INPER') {
              loc = 'Online';
            } else {
              loc = 'TBA';
            }
            const info = {
              day,
              start: event.start,
              end: event.end,
              instructorName: instructor,
              location: loc,
            };
            if (event.sectionCode in sections) {
              sections[event.sectionCode].push(info);
            } else {
              sections[event.sectionCode] = [info];
            }
          }
        }
      }
      return sections;
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    ...mapActions(['deleteCourse']),
    ...mapMutations(['addOrRemoveConflictCourse']),
    getFormattedTime(start, end) {
      let s = (start / 3600) % 12;
      if (s === 0) {
        s = 12;
      }
      const startHalf = Number.isInteger(s) ? '00' : '30';
      let e = (end / 3600) % 12;
      if (e === 0) {
        e = 12;
      }
      const endHalf = Number.isInteger(e) ? '00' : '30';
      return `${s - startHalf / 6 / 10}:${startHalf} - ${e -
        endHalf / 6 / 10}:${endHalf}`;
    },
    getProperDayName(day) {
      return `${day.slice(0, 1)}${day.slice(1, 3).toLowerCase()}`;
    },
    atInput() {
      // console.log('pop up toggled')
      const courseSectionPicker = this.$refs.popUp;
      if (typeof courseSectionPicker !== 'undefined') {
        courseSectionPicker.resetSelectedMeetingSections();
      }
    },
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
* {
  font-family: 'Montserrat', sans-serif;
}
.card-header {
  max-width: 20px;
  min-width: 20px;
  height: 50px;
}
.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 50px !important;
}
</style>
