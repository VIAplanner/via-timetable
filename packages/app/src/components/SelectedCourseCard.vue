<template>
  <v-row>
    <v-col class="pa-1">
      <v-expansion-panel>
        <v-expansion-panel-header class="pa-0" style="max-height: 50px !important ">
          <div class="mr-3 card-header" :style="`background-color: ${course.color}`">
            <p></p>
          </div>
          <div style="color: #474747">
            <h3>{{course.courseCode}}</h3>
          </div>
          <v-spacer />
          <v-btn color="#474747" @click="deleteCourse({code: course.courseCode})" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <div class="sections-info">
                <v-row v-for="meetingsection in meetingSections" :key="meetingsection.section">
                  <v-col>{{meetingsection.sectionCode}}</v-col>
                  <v-col>{{meetingsection.instructorName}}</v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="3">
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
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-col>
  </v-row>
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
.card-header {
  min-width: 10px;
  height: 50px;
}
.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 50px !important;
}
</style>