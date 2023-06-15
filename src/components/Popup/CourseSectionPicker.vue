<template>
  <v-card>
    <OverwriteLockedSectionPopup
      @Proceed="autoResolveConflict"
      @Cancel="clearTempVars"
    ></OverwriteLockedSectionPopup>
    <v-toolbar :color="course.color" dark style="z-index: 1">
      <v-toolbar-title class="text-wrap ml-2">
        {{ course.courseCode }} {{ course.name }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn class="mr-2" text @click="onClickDone">Done</v-btn>
    </v-toolbar>
    <smooth-scrollbar>
      <v-card-text height="600px">
        <v-list rounded subheader two-line flat>
          <v-container
            v-for="(meetingSections, activityType) in activities"
            :key="activityType"
          >
            <div v-if="meetingSections.length > 0">
              <v-radio-group
                v-model="selectedMeetingSections[activityType]"
                :mandatory="false"
                style="top-margin: 0px;"
              >
                <v-subheader
                  v-if="meetingSections.length > 0"
                  class="activity-header"
                  >{{ activityType }}s</v-subheader
                >
                <v-row class="activity-label">
                  <v-col>
                    <h4 style="margin-left: 70px;">Activity</h4>
                  </v-col>
                  <v-col>
                    <h4 style="margin-left: 60px">Time</h4>
                  </v-col>
                  <v-col>
                    <h4 style="margin-left: 70px">Location</h4>
                  </v-col>
                  <v-col style="text-align: center">
                    <h4>Instructor</h4>
                  </v-col>
                </v-row>
                <v-divider class="activity-divider" />
                <v-list-item-group>
                  <v-list-item
                    v-for="meetingSection in meetingSections"
                    :key="meetingSection.sectionCode"
                    style="margin-bottom: 0px;"
                    @click="
                      setMeetingSection(
                        meetingSection.sectionCode,
                        activityType,
                      )
                    "
                  >
                    <v-list-item-action>
                      <v-radio :value="meetingSection.sectionCode"></v-radio>
                    </v-list-item-action>

                    <v-list-item-content class="content-no-padding">
                      <v-row>
                        <v-col class="contain" cols="2">
                          <v-row class="center-vertical">
                            <v-col>
                              <v-list-item-title>
                                <warning v-if='getWarningSections.some(x=>x.code === course.courseCode && x.sectionCode === meetingSection.sectionCode)'/>{{ meetingSection.sectionCode }}
                              </v-list-item-title>
                            </v-col>
                          </v-row>
                        </v-col>

                        <v-col cols="5">
                          <div v-if="meetingSection.times.length > 0">
                            <v-row
                              v-for="time in meetingSection.times"
                              :key="`${time.day}${time.start}`"
                            >
                              <v-col>
                                <v-tooltip
                                  top
                                  v-if="
                                    _checkConflict(
                                      time.day,
                                      time.start,
                                      time.end,
                                      timetableSelectedMeetingSections[
                                        activityType
                                      ],
                                    ) != null
                                  "
                                >
                                  <template
                                    v-slot:activator="{
                                      on,
                                    }"
                                  >
                                    <div
                                      class="conflicting-time-orange"
                                      v-on="on"
                                    >
                                      {{
                                        getProperDayName(time.day).slice(0, 3)
                                      }}
                                      {{
                                        getFormattedTime(time.start, time.end)
                                      }}
                                    </div>
                                  </template>
                                  <div
                                    v-for="conflictSection in _checkConflict(
                                      time.day,
                                      time.start,
                                      time.end,
                                      timetableSelectedMeetingSections[
                                        activityType
                                      ],
                                    )"
                                    :key="
                                      `${conflictSection.courseCode}${conflictSection.sectionCode}`
                                    "
                                  >
                                    Conflicts with
                                    {{ conflictSection.conflictString }}
                                  </div>
                                </v-tooltip>
                                <div v-else>
                                  {{ getProperDayName(time.day) }}
                                  {{ getFormattedTime(time.start, time.end) }}
                                </div>
                              </v-col>
                            </v-row>
                          </div>
                          <v-row v-else>
                            <v-col>
                              <div class="ml-10">Asynchronous</div>
                            </v-col>
                          </v-row>
                        </v-col>

                        <v-col cols="2">
                          <div v-if="meetingSection.times.length > 0">
                            <v-row
                              v-for="time in meetingSection.times"
                              :key="`${time.day}${time.start}`"
                            >
                              <v-col>
                                <div v-if="time.location.length > 0">
                                  {{ time.location }}
                                </div>
                                <div
                                  v-else-if="meetingSection.method !== 'INPER'"
                                >
                                  Online
                                </div>
                                <div v-else>
                                  TBA
                                </div>
                              </v-col>
                            </v-row>
                          </div>
                          <v-row v-else cols="2">
                            <v-col>
                              <div>
                                Online
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>

                        <v-col class="contain">
                          <div
                            v-if="
                              activityType === 'lecture' &&
                                meetingSection.instructors.length != 0
                            "
                            class="center-vertical"
                            style="text-align: center; width: 88%; text-wrap: break-word"
                          >
                            {{ meetingSection.instructors[0] }}
                          </div>
                          <div
                            v-else
                            class="center-vertical"
                            style="text-align: center; width: 88%"
                          >
                            TBA
                          </div>
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
    </smooth-scrollbar>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import OverwriteLockedSectionPopup from './OverwriteLockedSectionPopup.vue';
import Warning from '../SidePanel/Warning.vue';

export default {
  components: {
    OverwriteLockedSectionPopup,
    Warning
  },
  props: {
    code: {
      type: String,
    },
  },
  mounted() {
    this.resetSelectedMeetingSections();
  },
  computed: {
    ...mapGetters([
      'timetable',
      'fallTimetable',
      'winterTimetable',
      'selectedCourses',
      'getLockedSections',
      'fallLockedSections',
      'winterLockedSections',
      'getSemesterStatus',
      'getWarningSections'
    ]),
    course() {
      return this.selectedCourses(this.code[8])[this.code];
    },
    activities() {
      return {
        lecture: this.course.meeting_sections.filter(
          section => section.sectionCode.charAt(0) === 'L',
        ),
        tutorial: this.course.meeting_sections.filter(
          section => section.sectionCode.charAt(0) === 'T',
        ),
        practical: this.course.meeting_sections.filter(
          section => section.sectionCode.charAt(0) === 'P',
        ),
      };
    },
    timetableSelectedMeetingSections() {
      return this.getTimetableMeetingSections();
    },
  },

  methods: {
    ...mapActions(['switchSection', 'resetTimetable', 'deleteCourse', 'saveState']),
    ...mapMutations([
      'lockSection',
      'unlockSection',
      'setOverwriteLockedSectionPopup',
    ]),
    setMeetingSection(courseCode, activityType) {
      this.selectedMeetingSections[activityType] = courseCode;
    },
    getFormattedTime(start, end) {
      let s = (start / 3600) % 12;
      if (s === 0) {
        s = 12;
      }
      const startPeriod = start / 3600 < 12 ? 'AM' : 'PM';
      let e = (end / 3600) % 12;
      if (e === 0) {
        e = 12;
      }
      const endPeriod = end / 3600 < 12 ? 'AM' : 'PM';
      const startHalf = Number.isInteger(s) ? '00' : '30';
      const endHalf = Number.isInteger(e) ? '00' : '30';
      return `${s - startHalf / 6 / 10}:${startHalf} ${startPeriod} - ${e -
        endHalf / 6 / 10}:${endHalf} ${endPeriod}`;
    },
    getProperDayName(day) {
      const ret = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      return ret.slice(0, 3);
    },
    checkConflict(semester, timetable, day, start, end) {
      const dayEvents = timetable[day];
      const ret = [];
      for (let x = 0; x < dayEvents.length; x += 1) {
        const event = dayEvents[x];
        const time = this.getFormattedTime(event.start, event.end);
        let conflictEmoji;
        if (event.code[8] === 'F') {
          conflictEmoji = '🍂';
        } else if (event.code[8] === 'S') {
          conflictEmoji = '❄️';
        } else {
          conflictEmoji = '🍂❄️';
        }
        let conflictString;
        if (event.code.slice(0, 4) === 'Lock') {
          if (semester === 'F')
            conflictString = `🍂 Locked ${day.slice(0, 1)}${day
              .substr(1)
              .toLowerCase()} ${time}`;
          else
            conflictString = `❄️ Locked ${day.slice(0, 1)}${day
              .substr(1)
              .toLowerCase()} ${time}`;
        } else {
          conflictString = `${conflictEmoji} ${event.code} ${event.sectionCode} ${time}`;
        }
        const possibleConflict = {
          courseCode: event.code,
          sectionCode: event.sectionCode,
          time,
          conflictString,
        };
        if (event.start < start && event.end > start) {
          ret.push(possibleConflict);
        } else if (start <= event.start && event.start < end) {
          ret.push(possibleConflict);
        }
      }
      return ret;
    },
    // eslint-disable-next-line no-underscore-dangle
    _checkConflict(day, start, end, timetableSection) {
      const ret = [];
      if (this.code[8] === 'F' || this.code[8] === 'S') {
        // Half year course
        const semesterConflicts = this.checkConflict(
          this.getSemesterStatus,
          this.timetable,
          day,
          start,
          end,
        );
        /* If there is conflict and the conflict is not with the selected section on the timetable which
              the user is trying to switch away from, in other words if the conflict is real */
        const temp = semesterConflicts.filter(
          conflict =>
            `${conflict.courseCode}${conflict.sectionCode}` !==
            `${this.code}${timetableSection}`,
        );
        ret.push(...temp);
      } else {
        // Full year course
        const fallConflicts = this.checkConflict(
          'F',
          this.fallTimetable,
          day,
          start,
          end,
        );
        const winterConflicts = this.checkConflict(
          'S',
          this.winterTimetable,
          day,
          start,
          end,
        );
        const tempFall = fallConflicts.filter(
          conflict =>
            `${conflict.courseCode}${conflict.sectionCode}` !==
            `${this.code}${timetableSection}`,
        );
        ret.push(...tempFall);
        const tempWinter = winterConflicts.filter(
          conflict =>
            `${conflict.courseCode}${conflict.sectionCode}` !==
              `${this.code}${timetableSection}` &&
            !ret.some(
              itemInRet =>
                itemInRet.conflictString === conflict.conflictString &&
                !conflict.conflictString.slice(0, 4) === 'Lock',
            ),
        );
        ret.push(...tempWinter);
      }
      if (ret.length === 0) {
        return null;
      }
      return ret;
    },
    onClickDone() {
      this.updateTimetable();
      this.saveState()
      this.$emit('done');
    },
    updateTimetable() {
      for (const activityType of ['lecture', 'practical', 'tutorial']) {
        // If section changed
        if (
          this.selectedMeetingSections[activityType] !==
          this.timetableSelectedMeetingSections[activityType]
        ) {
          // console.log(`${activityType} changed`)
          // console.log(this.selectedMeetingSections[activityType])
          // console.log(this.timetableSelectedMeetingSections[activityType])
          const newSection = this.course.meeting_sections.filter(
            section =>
              section.sectionCode ===
              this.selectedMeetingSections[activityType],
          )[0];
          // Find all conflicting sections
          const conflictSections = [];
          for (const currTime of newSection.times) {
            // eslint-disable-next-line no-underscore-dangle
            const conflictTimes = this._checkConflict(
              currTime.day,
              currTime.start,
              currTime.end,
              this.timetableSelectedMeetingSections[activityType],
            );
            if (conflictTimes != null) {
              conflictSections.push(...conflictTimes);
            }
          }
          // case 1, no conflicting times
          if (conflictSections.length === 0) {
            this.switchSection({
              old: {
                sectionCode: this.timetableSelectedMeetingSections[
                  activityType
                ],
                courseCode: this.code,
              },
              new: newSection,
            });
          }
          // case 2, there are conflicting time(s)
          else {
            // All the sections the user is trying to switch away from
            this.oldSectionsWithConflict.push(
              `${this.code}${this.timetableSelectedMeetingSections[activityType]}`,
            );
            // All the new sections to switch into
            this.newSectionsWithConflict.push(
              `${this.code}${this.selectedMeetingSections[activityType]}`,
            );
            // All the other sections the new sections conflict with
            this.totalConflictSections.push(...conflictSections);
          }
        }
      }
      if (this.totalConflictSections.length !== 0) {
        // Find if any conflicting section(s) is locked, if so, pop up a dialog
        let popUp = false;
        for (const conflictSection of this.totalConflictSections) {
          const fallIndex = this.fallLockedSections.indexOf(
            `${conflictSection.courseCode}${conflictSection.sectionCode}`,
          );
          const winterIndex = this.winterLockedSections.indexOf(
            `${conflictSection.courseCode}${conflictSection.sectionCode}`,
          );
          if (fallIndex !== -1 || winterIndex !== -1) {
            popUp = true;
            break;
          }
        }
        if (popUp) {
          this.setOverwriteLockedSectionPopup(true);
        } else {
          this.autoResolveConflict();
        }
      }
    },
    autoResolveConflict() {
      // unlock old sections regardless if they are locked
      for (const oldSection of this.oldSectionsWithConflict) {
        // console.log(oldSection)
        this.unlockSection(oldSection);
      }
      // Unlock all the conflicting sections
      for (const conflictSection of this.totalConflictSections) {
        // console.log(conflictSection)
        this.unlockSection(
          `${conflictSection.courseCode}${conflictSection.sectionCode}`,
        );

        // if the section that the user is switching to is a locked section, delete it
        if (conflictSection.courseCode.includes('Lock')) {
          this.deleteCourse({ code: conflictSection.courseCode });
        }
      }
      // Temporarily lock the new sections, regenerate timetable, and unlock the new sections
      for (const newSection of this.newSectionsWithConflict) {
        // console.log(newSection)
        this.lockSection(newSection);
      }
      this.resetTimetable();
      for (const newSect of this.newSectionsWithConflict) {
        this.unlockSection(newSect);
      }
      this.clearTempVars();
    },
    clearTempVars() {
      this.oldSectionsWithConflict = [];
      this.newSectionsWithConflict = [];
      this.totalConflictSections = [];
    },
    resetSelectedMeetingSections() {
      this.selectedMeetingSections = this.getTimetableMeetingSections();
    },
    getTimetableMeetingSections() {
      const selectedMeetingSections = {
        lecture: null,
        practical: null,
        tutorial: null,
      };
      for (const day in this.timetable) {
        const dayEvents = this.timetable[day];
        for (const event of dayEvents) {
          if (event.code === this.course.courseCode) {
            if (event.sectionCode.charAt(0) === 'L') {
              selectedMeetingSections.lecture = event.sectionCode;
            } else if (event.sectionCode.charAt(0) === 'P') {
              selectedMeetingSections.practical = event.sectionCode;
            } else selectedMeetingSections.tutorial = event.sectionCode;
          }
        }
      }
      return selectedMeetingSections;
    },
  },
  data() {
    return {
      selectedMeetingSections: {
        lecture: null,
        practical: null,
        tutorial: null,
      },
      active: false,
      dialog: false,
      oldSectionsWithConflict: [],
      newSectionsWithConflict: [],
      totalConflictSections: [],
    };
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
  margin: 0px 5px;
}

.conflicting-time-orange {
  color: orange;
}
</style>
