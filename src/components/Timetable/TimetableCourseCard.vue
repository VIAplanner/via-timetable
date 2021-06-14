<template>
  <div>
    <div class="course-info-card">
      <div
        class="course-card-header pb-4"
        :style="{ background: course.color }"
      >
        <v-row class="pl-2 mb-2">
          <v-col class="ml-2" cols="10"
            >{{ course.courseCode }} {{ course.name }}</v-col
          >
          <v-spacer />
          <v-col cols="0.5" class="pr-0">
            <v-dialog
              v-model="dialog"
              scrollable
              width="825px"
              @input="atInput"
            >
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" color="white">
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
          <v-col cols="0.5" class="pl-0">
            <v-btn
              color="white"
              @click="deleteCourse({ code: course.courseCode })"
              icon
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="course-info-header">
        <v-row>
          <v-col>
            <h4>Activity</h4>
          </v-col>
          <v-col cols="4">
            <h4>Time</h4>
          </v-col>
          <v-col style="margin-left: 10px">
            <h4>Location</h4>
          </v-col>
          <v-col>
            <h4>Instructor</h4>
          </v-col>
        </v-row>
      </div>
      <div class="sections-info">
        <v-row
          v-for="meetingsection in meetingSections"
          :key="meetingsection.section"
        >
          <v-col>{{ meetingsection.sectionCode }}</v-col>
          <v-col cols="1">{{ getProperDayName(meetingsection.day) }}</v-col>
          <v-col cols="3" style="margin-left: 15px">{{
            getFormattedTime(meetingsection.start, meetingsection.end)
          }}</v-col>
          <v-col v-if="meetingsection.location.length > 0">
            {{ meetingsection.location }}
          </v-col>
          <v-col v-else-if="meetingsection.sectionCode[1] === '9'">
            Online
          </v-col>
          <v-col v-else>
            TBA
          </v-col>
          <v-col>{{ meetingsection.instructorName }}</v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CourseSectionPicker from '../Popup/CourseSectionPicker.vue';

export default {
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
    ...mapGetters(['timetable', 'selectedCourses']),
    meetingSections() {
      const sections = [];
      for (const day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (const event of dayEvents) {
          if (event.code === this.course.courseCode) {
            const instructor =
              event.instructors.length === 0 ? 'TBA' : event.instructors[0];
            sections.push({
              sectionCode: event.sectionCode,
              day,
              start: event.start,
              end: event.end,
              location: event.location,
              instructorName: instructor,
            });
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
    getFormattedTime(start, end) {
      let s = (start / 3600) % 12;
      if (s === 0) {
        s = 12;
      }
      const startPeriod = start / 3600 < 12 ? 'AM' : 'PM';
      const startHalf = Number.isInteger(s) ? '00' : '30';
      let e = (end / 3600) % 12;
      if (e === 0) {
        e = 12;
      }
      const endPeriod = end / 3600 < 12 ? 'AM' : 'PM';
      const endHalf = Number.isInteger(e) ? '00' : '30';
      return `${s - startHalf / 6 / 10}:${startHalf} ${startPeriod} - ${e -
        endHalf / 6 / 10}:${endHalf} ${endPeriod}`;
    },
    getProperDayName(day) {
      return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
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

.course-info-card {
  position: relative;
  box-shadow: 0 20px 50px #e5e5e5e5;
  border-radius: 12px;
}

.course-card-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  height: 56px;
  color: white;
  font-size: 20px;
}

.course-info-header {
  background: white;
  border-bottom: 1px solid black;
  padding-left: 15px;
}

.sections-info {
  padding-left: 15px;
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
