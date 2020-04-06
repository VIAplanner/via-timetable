<template>
  <div v-if="!$apollo.loading">
    <v-toolbar color="teal" dark>
      <v-toolbar-title>{{course.code}} {{course.name}}</v-toolbar-title>
      <v-spacer />
      <v-btn text @click="$emit('done')">Done</v-btn>
    </v-toolbar>
    <v-list rounded subheader two-line flat>
      <v-container v-for="(meetingSections, activityType) in activities" :key="activityType">
        <div v-if="meetingSections.length > 0">
          <v-radio-group
            v-model="selectedMeetingSections[activityType]"
            :mandatory="false"
            style="top-margin: 0px;"
          >
            <v-subheader v-if="meetingSections.length > 0" class="activity-header">{{activityType}}s</v-subheader>
            <v-row class="activity-label">
              <v-col>
                <h4 style="margin-left: 80px;">Activity</h4>
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
                :key="meetingSection.code"
                style="margin-bottom: 0px;"
              >
                <v-list-item-action>
                  <v-radio :value="meetingSection.code"></v-radio>
                </v-list-item-action>

                <v-list-item-content class="content-no-padding">
                  <v-row>
                    <v-col class="contain" cols="2">
                      <v-row class="center-vertical">
                        <v-col>
                          <v-list-item-title>{{meetingSection.code}}</v-list-item-title>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="4">
                      <v-row v-for="time in meetingSection.times" :key="time.day">
                        <v-col>
                          <v-tooltip
                            top
                            v-if="checkConflict(getProperDayName(time.day), 
                                  time.start, time.end) != null"
                          >
                            <template v-slot:activator="{ on }">
                              <div
                                class="conflicting-time-orange"
                                v-on="on"
                              >{{getProperDayName(time.day)}} {{getFormattedTime(time.start, time.end)}}</div>
                            </template>
                            Conflicts with {{checkConflict(getProperDayName(time.day),
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
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import gql from "graphql-tag";
import { mapGetters } from "vuex";

// import COURSE_SECTION_PICKER_QUERY from "../graphql/CourseSectionPicker.gql";
export default {
  name: "course-section-picker",
  props: {
    code: {
      type: String
    }
  },
  methods: {
    ...mapMutations(["selectMeetingSection"]),
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
    },
    getProperDayName(day) {
      return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    },
    checkConflict(day, start, end) {
      const dayEvents = this.timetable[day];
      for (var x = 0; x < dayEvents.length; x++) {
        const event = dayEvents[x];
        const time = this.getFormattedTime(event.start, event.end);
        const ret = `${event.courseCode.slice(0, -3)} ${
          event.section
        }\n${time}`;
        if (event.start < start && event.end > start) {
          return ret;
        } else if (start <= event.start && event.start < end) {
          return ret;
        }
      }
      return null;
    }
  },
  computed: {
    ...mapGetters(["timetable"]),
    activities() {
      console.log(this.course.meeting_sections)
      return {
        lecture: this.course.meeting_sections.filter(
          section => section.code.charAt(0) === "L"
        ),
        tutorial: this.course.meeting_sections.filter(
          section => section.code.charAt(0) === "T"
        ),
        practical: this.course.meeting_sections.filter(
          section => section.code.charAt(0) === "P"
        )
      };
    },
    course() {
      return this.courses[0];
    },
    selectedMeetingSections() {
      let lec;
      let pra;
      let tut;
      for (let day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (let event of dayEvents) {
          if (event.courseCode == this.code) {
            if (event.section.charAt(0) == "L") {
              lec = event.section;
            } else if (event.section.charAt(0) == "P") {
              pra = event.section;
            } else {
              tut = event.section;
            }
          }
        }
      }
      return {
        lecture: lec,
        practical: pra,
        tutorial: tut
      };
    }
  },
  data() {
    return {
      active: false,
      dialog: false
    };
  },
  apollo: {
    courses: {
      query: gql`
        query getCourse($code: String!) {
          courses(code: $code) {
            code
            name
            meeting_sections {
              code
              instructors
              times {
                day
                start
                end
                location
              }
            }
          }
        }
      `,
      variables() {
        return {
          code: this.code
        };
      }
    }
  },
  watch: {
    selectedMeetingSections: {
      deep: true,
      handler(sections) {
        console.log("New Meeting Section selected");
        this.selectMeetingSection({
          // hardcoded
          courseCode: "CSC108",
          sectionType: "lecture",
          meetingSection: sections.lecture
        });
        this.selectMeetingSection({
          // hardcoded
          courseCode: "CSC108",
          sectionType: "tutorial",
          meetingSection: sections.tutorial
        });
        this.selectMeetingSection({
          // hardcoded
          courseCode: "CSC108",
          sectionType: "practical",
          meetingSection: sections.practical
        });
      }
    }
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

