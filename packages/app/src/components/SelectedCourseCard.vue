<template>
    <v-expansion-panel>
        <v-expansion-panel-header :style="{ background: course.color }">
            <div style="color: white">
                <h3>{{course.courseCode}}</h3>
            </div>
            <v-spacer/>
            <v-dialog v-model="dialog" scrollable width="825px" @input="atInput">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="#474747">
                  <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
              </template>
              <course-section-picker
                v-on:done="dialog = false"
                :code="course.courseCode"
                ref="popUp"
              />
            </v-dialog>
            <v-btn color="#474747" @click="deleteCourse({code: course.courseCode})" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Content
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CourseSectionPicker from "../components/CourseSectionPicker";

export default {
  name: "selected-course-card",
  components: {
    CourseSectionPicker
  },
  props: {
    course: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(["timetable", "selectedCourses"]),
    meetingSections() {
      const sections = [];
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          if (event.code == this.course.courseCode) {
            const instructor =
              event.instructors.length === 0 ? "TBA" : event.instructors[0];
            sections.push({
              sectionCode: event.sectionCode,
              day: day,
              start: event.start,
              end: event.end,
              location: event.location,
              instructorName: instructor
            });
          }
        }
      }
      return sections;
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    ...mapActions(["deleteCourse"]),
    getFormattedTime(start, end) {
      var s = (start / 3600) % 12;
      if (s == 0) {
        s = 12;
      }
      var startPeriod = start / 3600 < 12 ? "AM" : "PM";
      let startHalf = Number.isInteger(s) ? "00":"30"
      var e = (end / 3600) % 12;
      if (e == 0) {
        e = 12;
      }
      var endPeriod = end / 3600 < 12 ? "AM" : "PM";
      let endHalf = Number.isInteger(e) ? "00":"30"
      return `${s-((startHalf/6)/10)}:${startHalf} ${startPeriod} - ${e-((endHalf/6)/10)}:${endHalf} ${endPeriod}`;
    },
    getProperDayName(day) {
      return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    },
    atInput() {
      // console.log('pop up toggled')
      var courseSectionPicker = this.$refs.popUp;
      if (typeof courseSectionPicker != "undefined") {
        courseSectionPicker.resetSelectedMeetingSections();
      }
    }
  }
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
* {
  font-family: "Montserrat", sans-serif;
}
</style>