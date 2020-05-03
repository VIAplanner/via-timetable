<template>
  <v-card v-if="!$apollo.loading">
    <v-toolbar :color="course.color" dark>
      <v-toolbar-title class="text-wrap">{{course.courseCode}} {{course.name}}</v-toolbar-title>
      <v-spacer />
      <v-btn text @click="onClickDone">Done</v-btn>
    </v-toolbar>
    <v-card-text height="600px">
      <v-list rounded subheader two-line flat>
        <v-container v-for="(meetingSections, activityType) in activities" :key="activityType">
          <div v-if="meetingSections.length > 0">
            <v-radio-group
              v-model="selectedMeetingSections[activityType]"
              :mandatory="false"
              style="top-margin: 0px;"
            >
              <v-subheader
                v-if="meetingSections.length > 0"
                class="activity-header"
              >{{activityType}}s</v-subheader>
              <v-row class="activity-label">
                <v-col>
                  <h4 style="margin-left: 70px;">Activity</h4>
                </v-col>
                <v-col class="activity-label">
                  <h4 style="margin-left: 50px">Time</h4>
                </v-col>
                <v-col class="activity-label">
                  <h4 style="margin-left: 25px">Location</h4>
                </v-col>
                <v-col class="activity-label">
                  <h4 style="margin-left: 5px">Instructor</h4>
                </v-col>
              </v-row>
              <v-divider class="activity-divider" />
              <v-list-item-group>
                <v-list-item
                  v-for="meetingSection in meetingSections"
                  :key="meetingSection.sectionCode"
                  style="margin-bottom: 0px;"
                >
                  <v-list-item-action>
                    <v-radio :value="meetingSection.sectionCode"></v-radio>
                  </v-list-item-action>

                  <v-list-item-content class="content-no-padding">
                    <v-row>
                      <v-col class="contain" cols="2">
                        <v-row class="center-vertical">
                          <v-col>
                            <v-list-item-title>{{meetingSection.sectionCode}}</v-list-item-title>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="4">
                        <v-row v-for="time in meetingSection.times" :key="time.day">
                          <v-col>
                            <v-tooltip
                              top
                              v-if="checkConflict(time.day, time.start, time.end) != null && 
                                  checkConflict(time.day, time.start, time.end).slice(7, 12) != timetableSelectedMeetingSections[activityType] &&
                                  meetingSection.sectionCode != timetableSelectedMeetingSections[activityType]"
                            >
                              <template v-slot:activator="{ on }">
                                <div
                                  class="conflicting-time-orange "
                                  v-on="on"
                                >{{getProperDayName(time.day)}} {{getFormattedTime(time.start, time.end)}}</div>
                              </template>
                              Conflicts with {{checkConflict(time.day,
                              time.start, time.end)}}
                            </v-tooltip>
                            <div v-else>
                              {{getProperDayName(time.day)}}
                              {{getFormattedTime(time.start, time.end)}}
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col>
                        <v-row v-for="time in meetingSection.times" :key="time.day">
                          <v-col>
                            <div>{{time.location}}</div>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col class="contain">
                        <v-row class="center-vertical">
                          <v-col>
                            <v-list-item-title
                              v-if="activityType === 'lecture'"
                            >{{meetingSection.instructors[0]}}</v-list-item-title>
                            <v-list-item-title v-else>TBA</v-list-item-title>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-radio-group>
          </div>
        </v-container>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations } from "vuex";
// import gql from "graphql-tag";
import { mapGetters } from "vuex";

export default {
  name: "course-section-picker",
  props: {
    code: {
      type: String
    }
  },
  mounted() {
    console.log('mounted')
    this.resetSelectedMeetingSections()
  },
  computed: {
    ...mapGetters([
      "timetable",
      "selectedCourses"
    ]),
    course() {
      return this.selectedCourses[this.code];
    },
    activities() {
      return {
        lecture: this.course.meeting_sections.filter(
          section => section.sectionCode.charAt(0) === "L"
        ),
        tutorial: this.course.meeting_sections.filter(
          section => section.sectionCode.charAt(0) === "T"
        ),
        practical: this.course.meeting_sections.filter(
          section => section.sectionCode.charAt(0) === "P"
        )
      };
    },
    timetableSelectedMeetingSections () {
      return this.getTimetableMeetingSections()
    }
  },

  methods: {
    ...mapMutations([
      "selectMeetingSection",
      "setTimetableSelectedMeetingSections"
    ]),
    getFormattedTime(start, end) {
      var s = (start / 3600) % 12;
      if (s == 0) {
        s = 12;
      }
      var e = (end / 3600) % 12;
      if (e == 0) {
        e = 12;
      }
      return `${s}:00 - ${e}:00`;
    },
    getProperDayName(day) {
      return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    },
    checkConflict(day, start, end) {
      const dayEvents = this.timetable[day];
      for (var x = 0; x < dayEvents.length; x++) {
        const event = dayEvents[x];
        const time = this.getFormattedTime(event.start, event.end);
        const ret = `${event.code.slice(0, 6)} ${event.sectionCode}\n${time}`;
        if (event.start < start && event.end > start) {
          return ret;
        } else if (start <= event.start && event.start < end) {
          return ret;
        }
      }
      return null;
    },
    onClickDone() {
      this.$emit("done");
      // updateTimetable()
    },
    // updateTimetable() {

    // },
    resetSelectedMeetingSections() {
      this.selectedMeetingSections = this.getTimetableMeetingSections()
    },
    getTimetableMeetingSections() {
      let selectedMeetingSections = {
        lecture: null,
        practical: null,
        tutorial: null
      };
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          if (event.code === this.course.courseCode) {
            if (event.sectionCode.charAt(0) == "L") {
              selectedMeetingSections.lecture = event.sectionCode;
            } else if (event.sectionCode.charAt(0) == "P") {
              selectedMeetingSections.practical = event.sectionCode;
            } else selectedMeetingSections.tutorial = event.sectionCode;
          }
        }
      }
      return selectedMeetingSections
    }
  },
  data() {
    return {
      selectedMeetingSections: {
        lecture: null,
        practical: null,
        tutorial: null
      },
      active: false,
      dialog: false
    };
  }
};
</script>

<style>
.contain {
  position: relative;
}

.center-vertical {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.content-no-padding {
  padding: 0px;
}

.container-no-padding {
  padding-left: 10px;
}

.activity-label {
  padding-bottom: 0px;
  font-weight: 200 !important;
  font-size: 20px;
}

.activity-header {
  font-size: 1.75rem;
  font-weight: bold;
  text-transform: capitalize;
}

.activity-divider {
  margin: 4px 72px;
}

.conflicting-time-orange {
  color: orange;
}

.bg-blue {
  background-color: #e1edfa;
}
</style>

