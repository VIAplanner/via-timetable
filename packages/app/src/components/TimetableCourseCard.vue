<template>
  <div>
    <div class="course-info-card">
      <div class="course-card-header" :style="{ background: course.color }">
        <h3 class="course-card-title">{{ course.code }} {{ course.name }}</h3>
        <div class="delete-button">
          <v-btn @click="removeCourse({code: course.code})" text>Delete</v-btn>
        </div>
      </div>
      <div class="course-info-header">
        <v-row>
          <v-col>
            <h4>Activity</h4>
          </v-col>
          <v-col>
            <h4>Time</h4>
          </v-col>
          <v-col>
            <h4>Location</h4>
          </v-col>
          <v-col>
            <h4>Instructor</h4>
          </v-col>
        </v-row>
      </div>
      <div class="sections-info">
        <v-row v-for="meetingsection in meetingSections" :key="meetingsection.section">
          <v-col cols="3">{{meetingsection.sectionCode}}</v-col>
          <v-col>{{meetingsection.day}}</v-col>
          <v-col>{{getFormattedTime(meetingsection.start, meetingsection.end)}}</v-col>
          <v-col cols="3">{{meetingsection.location}}</v-col>
          <v-col cols="3">{{meetingsection.instructorName}}</v-col>
        </v-row>
      </div>
      <v-dialog v-model="dialog" scrollable width="800px">
        <template v-slot:activator="{ on }">
          <v-btn icon class="edit-button" v-on="on">
            <v-icon>mdi-pencil-box-outline</v-icon>
          </v-btn>
        </template>
        <course-section-picker v-on:done="dialog = false" :code="course.code" />
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import CourseSectionPicker from "../components/CourseSectionPicker";

export default {
  name: "timetable-course-card",
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
      var ret = []
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          if (event.code == this.course.code) {
            ret.push({
              sectionCode: event.sectionCode,
              day: day,
              start: event.start,
              end: event.end,
              location: event.location,
              instructorName: event.instructors[0]
            })
          }
        }
      }
      return ret
    },
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    ...mapMutations([
      "removeCourse" //also supports payload `this.nameOfMutation(amount)`
    ]),
    getFormattedTime(start, end) {
      var s = (start / 3600) % 12;
      if (s == 0) {
        s = 12;
      }
      var e = (end / 3600) % 12;
      if (end == 0) {
        end = 12;
      }
      return `${s}:00 - ${e}:00`;
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
* {
  font-family: "Montserrat", sans-serif;
}

.course-info-card {
  position: relative;
}

.course-card-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: relative;
  height: 35px;
}

.course-card-title {
  position: absolute;
  top: 5px;
  left: 10px;
}

.delete-button {
  position: absolute;
  right: 10px;
}

.course-info-header {
  background: white;
  border-bottom: 1px solid black;
  padding-left: 10px;
}

.sections-info {
  padding-left: 10px;
  background: white;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.edit-button {
  position: absolute;
  top: 90px;
  right: 10px;
}
</style>
