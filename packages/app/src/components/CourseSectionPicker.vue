<template>
  <v-container>
        <v-toolbar color="teal" dark>
        <v-toolbar-title>{{course.code}} {{course.name}}</v-toolbar-title>
        <v-spacer />
        <v-btn text @click="$emit('done')">Done</v-btn>
      </v-toolbar>
      <!-- <h4>{{selectedMeetingSections}}</h4> -->
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
                            <v-tooltip top v-if="checkConflict(getProperDayName(time.day), 
                                  time.start, time.end) != null">
                              <template v-slot:activator="{ on }">
                                <div
                                  class="conflicting-time-orange" v-on="on"
                                >{{getProperDayName(time.day)}} {{getFormattedTime(time.start, time.end)}}</div>
                              </template>
                                Conflicts with {{checkConflict(getProperDayName(time.day), 
                                time.start, time.end)}}
                            </v-tooltip>
                            <div v-else>{{getProperDayName(time.day)}} 
                              {{getFormattedTime(time.start, time.end)}}</div>
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
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: "course-selection-picker",
  props: {
    timetable: {
      type: Object
    }
  },
  methods: {
    ...mapMutations([
      'selectMeetingSection',  
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
    },
    getProperDayName(day) {
      return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    },
    checkConflict(day, start, end) {
      const dayEvents = this.timetable[day];
      for (var x = 0; x < dayEvents.length; x++) {
        const event = dayEvents[x];
        const time = this.getFormattedTime(event.start, event.end)
        const ret = `${event.courseCode.slice(0, -3)} ${event.section}\n${time}`
        if (event.start < start && event.end > start) {
          return ret;
        } else if (start <= event.start && event.start < end) {
          return ret;
        }
      }
      return null;
    },
  },
  computed: {
    activities() {
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
    }
  },
  data() {
    return {
      selectedMeetingSections: {
        lecture: null,
        tutorial: null,
        practical: null
      },
      course: {
        code: "CSC108H5F",
        name: "Introduction to Computer Programming",
        description:
          "Structure of computers; the computing environment. Programming in a language such as Python. Program structure: elementary data types, statements, control flow, functions, classes, objects, methods, fields. List: searching, sorting and complexity. [36L, 24P]",
        campus: "UTM",
        meeting_sections: [
          {
            code: "L0107",
            instructors: ["M Liut"],
            times: [
              {
                day: "WEDNESDAY",
                start: 64800,
                end: 75600,
                duration: 10800,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0108",
            instructors: ["P Vrbik"],
            times: [
              {
                day: "TUESDAY",
                start: 64800,
                end: 75600,
                duration: 10800,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "P0119",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0120",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0121",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0122",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0123",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0124",
            instructors: [],
            times: [
              {
                day: "FRIDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "L0101",
            instructors: ["A Petersen"],
            times: [
              {
                day: "MONDAY",
                start: 32400,
                end: 36000,
                duration: 3600,
                location: "MN 1220"
              },
              {
                day: "WEDNESDAY",
                start: 32400,
                end: 36000,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 32400,
                end: 36000,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0102",
            instructors: ["A Petersen"],
            times: [
              {
                day: "MONDAY",
                start: 36000,
                end: 39600,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 36000,
                end: 39600,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 36000,
                end: 39600,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0103",
            instructors: ["P Vrbik"],
            times: [
              {
                day: "MONDAY",
                start: 39600,
                end: 43200,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 39600,
                end: 43200,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 39600,
                end: 43200,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0104",
            instructors: ["Arsala Bangash"],
            times: [],
            size: 120,
            enrolment: 0
          },
          {
            code: "L0105",
            instructors: ["V Maccio"],
            times: [
              {
                day: "MONDAY",
                start: 50400,
                end: 54000,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 50400,
                end: 54000,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 50400,
                end: 54000,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "L0106",
            instructors: ["M Liut"],
            times: [
              {
                day: "MONDAY",
                start: 43200,
                end: 46800,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "WEDNESDAY",
                start: 43200,
                end: 46800,
                duration: 3600,
                location: "MN 1270"
              },
              {
                day: "FRIDAY",
                start: 43200,
                end: 46800,
                duration: 3600,
                location: "MN 1270"
              }
            ],
            size: 160,
            enrolment: 0
          },
          {
            code: "P0101",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0102",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0103",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0104",
            instructors: [],
            times: [
              {
                day: "MONDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0105",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0106",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0107",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0108",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0109",
            instructors: [],
            times: [
              {
                day: "TUESDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0110",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0111",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0112",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0113",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0114",
            instructors: [],
            times: [
              {
                day: "WEDNESDAY",
                start: 61200,
                end: 68400,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 20,
            enrolment: 0
          },
          {
            code: "P0115",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 32400,
                end: 39600,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0116",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 39600,
                end: 46800,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0117",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 46800,
                end: 54000,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          },
          {
            code: "P0118",
            instructors: [],
            times: [
              {
                day: "THURSDAY",
                start: 54000,
                end: 61200,
                duration: 7200,
                location: "DH 2010"
              }
            ],
            size: 50,
            enrolment: 0
          }
        ]
      },
      active: false,
      dialog: false
    };
  },
  watch: {
    selectedMeetingSections: {
      deep: true, 
      handler(sections) {
      console.log("New Meeting Section selected")
      this.selectMeetingSection({
        // hardcoded
        courseCode: "CSC108",
        sectionType: "lecture",
        meetingSection: sections.lecture
      })
      this.selectMeetingSection({
        // hardcoded
        courseCode: "CSC108",
        sectionType: "tutorial",
        meetingSection: sections.tutorial
      })
      this.selectMeetingSection({
        // hardcoded
        courseCode: "CSC108",
        sectionType: "practical",
        meetingSection: sections.practical
      })
    }}
  },
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

