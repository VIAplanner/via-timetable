<template>
  <div>
    <div class="course-info-card">
      <div class="course-card-header" :style="{ background: course.color }">
        <h3 class="course-card-title">{{course.codeAndName}}</h3>
        <div class="details-button">
          <v-btn text>Details</v-btn>
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
        <v-row v-for="meetingsection in course.meetingSections" :key="meetingsection.section">
          <v-col cols="3">{{meetingsection.section}}</v-col>
          <v-col>{{meetingsection.day}}</v-col>
          <v-col>{{getFormattedTime(meetingsection.start, meetingsection.end)}}</v-col>
          <v-col cols="3">{{meetingsection.location}}</v-col>
          <v-col cols="3">{{meetingsection.instructorName}}</v-col>
        </v-row>
      </div>
      <v-dialog v-model="dialog" width="800px">
        <template v-slot:activator="{ on }">
          <v-btn icon class="edit-button" v-on="on">
            <v-icon>mdi-pencil-box-outline</v-icon>
          </v-btn>
        </template>
        <course-section-picker v-on:done="dialog=false" :timetable="timetable"/>
      </v-dialog>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import CourseSectionPicker from "../components/CourseSectionPicker";

export default {
  name: "timetable-course-card",
  components: {
    CourseSectionPicker,
  },
  props: {
    course: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState([
      'timetable',
    ])
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
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

.details-button {
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