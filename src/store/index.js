import Vue from 'vue';
import Vuex from 'vuex';
import genColor from 'color-generator';
import { generateTimetables } from '../timetable-planner/index2';
// import colorDiff from "color-difference"

Vue.use(Vuex);
const darkSaturation = 0.4;
const darkLightness = 0.3;
const lightSaturation = 0.8;
const lightLightness = 0.85;
const addHistory = (state, history) => {
    if (state.historyIndex !== 0) {
      state.history = state.history.slice(0, state.history.length + state.historyIndex);
      state.historyIndex = 0;
    }
    state.history.push(history);
};
const saveState = (state) => {
  addHistory(state, JSON.stringify({
      fallSelectedCourses: state.fallSelectedCourses,
      winterSelectedCourses: state.winterSelectedCourses,
      fallTimetable: state.fallTimetable,
      winterTimetable: state.winterTimetable,
      fallLockedSections: state.fallLockedSections,
      winterLockedSections: state.winterLockedSections,
      deliveryMethod: state.deliveryMethod,
      allowedConflictCourses: state.allowedConflictCourses,
      darkMode: state.darkMode,
    }));
};
const regenerateColors = (state) => {
  Object.values(state.fallSelectedCourses).forEach((course) => {
    course.color = genColor(state.darkMode ? darkSaturation : lightSaturation, state.darkMode ? darkLightness : lightLightness).hexString();
  });
  Object.values(state.winterSelectedCourses).forEach((course) => {
    course.color = genColor(state.darkMode ? darkSaturation : lightSaturation, state.darkMode ? darkLightness : lightLightness).hexString();
  });
};
export default new Vuex.Store({
  state: {
    darkMode: localStorage.darkMode === 'true',
    // change this number to clear storage
    clearStorage: '2',
    allowedConflictCourses: !localStorage.allowedConflictCourses
      ? []
      : JSON.parse(localStorage.allowedConflictCourses),
    fallLockedHourStatus: !localStorage.fallLockedHourStatus
      ? {
          '8 AM': false,
          '9 AM': false,
          '10 AM': false,
          '11 AM': false,
          '12 PM': false,
          '1 PM': false,
          '2 PM': false,
          '3 PM': false,
          '4 PM': false,
          '5 PM': false,
          '6 PM': false,
          '7 PM': false,
          '8 PM': false,
          '9 PM': false,
        }
      : JSON.parse(localStorage.fallLockedHourStatus),
    fallLockedDayStatus: !localStorage.fallLockedDayStatus
      ? {
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
        }
      : JSON.parse(localStorage.fallLockedDayStatus),
    fallSelectedCourses: !localStorage.fallSelectedCourses
      ? {}
      : JSON.parse(localStorage.fallSelectedCourses),
    fallLockedSections: !localStorage.fallLockedSections
      ? []
      : JSON.parse(localStorage.fallLockedSections),
    fallTimetable: !localStorage.fallTimetable
      ? {
          MONDAY: [],
          TUESDAY: [],
          WEDNESDAY: [],
          THURSDAY: [],
          FRIDAY: [],
        }
      : JSON.parse(localStorage.fallTimetable),
    winterLockedHourStatus: !localStorage.winterLockedHourStatus
      ? {
          '8 AM': false,
          '9 AM': false,
          '10 AM': false,
          '11 AM': false,
          '12 PM': false,
          '1 PM': false,
          '2 PM': false,
          '3 PM': false,
          '4 PM': false,
          '5 PM': false,
          '6 PM': false,
          '7 PM': false,
          '8 PM': false,
          '9 PM': false,
        }
      : JSON.parse(localStorage.winterLockedHourStatus),
    winterLockedDayStatus: !localStorage.winterLockedDayStatus
      ? {
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
        }
      : JSON.parse(localStorage.winterLockedDayStatus),
    winterSelectedCourses: !localStorage.winterSelectedCourses
      ? {}
      : JSON.parse(localStorage.winterSelectedCourses),
    winterLockedSections: !localStorage.winterLockedSections
      ? []
      : JSON.parse(localStorage.winterLockedSections),
    winterTimetable: !localStorage.winterTimetable
      ? {
          MONDAY: [],
          TUESDAY: [],
          WEDNESDAY: [],
          THURSDAY: [],
          FRIDAY: [],
        }
      : JSON.parse(localStorage.winterTimetable),
    exportOverlay: false,
    conflictPopup: false,
    searchBarValue: null,
    savedFallTimetable: {},
    savedWinterTimetable: {},
    savedFallSelectedCourses: {},
    savedWinterSelectedCourses: {},
    savedFallLockedSections: [],
    savedWinterLockedSections: [],
    savedLockedHourStatus: {
      '8 AM': false,
      '9 AM': false,
      '10 AM': false,
      '11 AM': false,
      '12 PM': false,
      '1 PM': false,
      '2 PM': false,
      '3 PM': false,
      '4 PM': false,
      '5 PM': false,
      '6 PM': false,
      '7 PM': false,
      '8 PM': false,
      '9 PM': false,
    },
    savedLockedDayStatus: {
      MONDAY: false,
      TUESDAY: false,
      WEDNESDAY: false,
      THURSDAY: false,
      FRIDAY: false,
    },
    semesterStatus: 'F',
    noTimetablePopup: false,
    shareLinkPopup: false,
    shareLink:'',
    overwriteLockedSectionPopup: false,
    tutorialPopup: !localStorage.visited,
    deliveryMethod: 'Mixed',
    globalAllowConflicts: false,
    history:  [],
    // index is reversed, 0 is the latest, 1 is the second latest etc...
    historyIndex: 0,
  },
  mutations: {
    setDarkMode(state, payload) {
      state.darkMode = payload;
      regenerateColors(state);
      saveState(state);
    },
    setExportOverlay(state, payload) {
      state.exportOverlay = payload;
    },
    setLockedHourStatus(state, payload) {
      if (state.semesterStatus === 'F') {
        state.fallLockedHourStatus[payload] = !state.fallLockedHourStatus[
          payload
        ];
      } else {
        state.winterLockedHourStatus[payload] = !state.winterLockedHourStatus[
          payload
        ];
      }
    },
    setLockedDayStatus(state, payload) {
      if (state.semesterStatus === 'F') {
        state.fallLockedDayStatus[payload] = !state.fallLockedDayStatus[
          payload
        ];
      } else {
        state.winterLockedDayStatus[payload] = !state.winterLockedDayStatus[
          payload
        ];
      }
    },
    setTutorialPopup(state, payload) {
      state.tutorialPopup = payload;
    },
    setSemesterStatus(state, payload) {
      state.semesterStatus = payload;
    },
    setSearchBarValue(state, payload) {
      state.searchBarValue = payload;
    },
    setTimetables(state, payload) {
      [state.fallTimetable, state.winterTimetable] = payload;
    },
    setNoTimetablePopup(state, payload) {
      state.noTimetablePopup = payload;
    },
    setShareLinkPopup(state, payload) {
      state.shareLinkPopup = payload;
    },
    setShareLink(state, payload) {
      state.shareLink = payload;
    },
    setOverwriteLockedSectionPopup(state, payload) {
      state.overwriteLockedSectionPopup = payload;
    },
    addCourse(state, payload) {
      if(state.globalAllowConflicts){
        state.allowedConflictCourses.push({code:payload.course.courseCode});
      }
      if (payload.course.courseCode.slice(0, 4) === 'Lock') {
        const whichDay = payload.course.meeting_sections[0].times[0].day;

        if (state.semesterStatus === 'F') {
          // already in the timetable
          if (payload.course.courseCode in state.fallSelectedCourses) {
            return;
          }

          state.fallSelectedCourses[payload.course.courseCode] = payload.course;

          // Add new section into timetable
          state.fallTimetable[whichDay].push({
            code: payload.course.courseCode,
            sectionCode: payload.course.meeting_sections[0].sectionCode,
            instructors: payload.course.meeting_sections[0].instructors[0],
            ...payload.course.meeting_sections[0].times[0],
          });

          // sort it
          state.fallTimetable[whichDay].sort((a, b) => a.start - b.start);
        } else {
          // already in the timetable
          if (payload.course.courseCode in state.winterSelectedCourses) {
            return;
          }

          state.winterSelectedCourses[payload.course.courseCode] =
            payload.course;

          // Add new section into timetable
          state.winterTimetable[whichDay].push({
            code: payload.course.courseCode,
            sectionCode: payload.course.meeting_sections[0].sectionCode,
            instructors: payload.course.meeting_sections[0].instructors[0],
            ...payload.course.meeting_sections[0].times[0],
          });

          // sort it
          state.winterTimetable[whichDay].sort((a, b) => a.start - b.start);
        }
      } else if (payload.course.courseCode[8] === 'F') {
        state.fallSelectedCourses[payload.course.courseCode] = payload.course;
      } else if (payload.course.courseCode[8] === 'S') {
        state.winterSelectedCourses[payload.course.courseCode] = payload.course;
      } else if (payload.course.courseCode[8] === 'Y') {
        state.fallSelectedCourses[payload.course.courseCode] = payload.course;
        state.winterSelectedCourses[payload.course.courseCode] = payload.course;
      }
    },
    removeCourse(state, payload) {
      if (payload.code.slice(0, 4) === 'Lock') {
        if (payload.code[4] === 'F') {
          Vue.delete(state.fallSelectedCourses, payload.code);
        } else {
          Vue.delete(state.winterSelectedCourses, payload.code);
        }
      } else if (payload.code[8] === 'F') {
        Vue.delete(state.fallSelectedCourses, payload.code);
      } else if (payload.code[8] === 'S') {
        Vue.delete(state.winterSelectedCourses, payload.code);
      } else if (payload.code[8] === 'Y') {
        Vue.delete(state.fallSelectedCourses, payload.code);
        Vue.delete(state.winterSelectedCourses, payload.code);
      }
    },
    // Todo
    setLockedSections(state, payload) {
      [state.fallLockedSections, state.winterLockedSections] = payload;
    },
    // Todo
    setSelectedCourses(state, payload) {
      [state.fallSelectedCourses, state.winterSelectedCourses] = payload;
    },
    addOrRemoveConflictCourse(state, payload) {
      const index = state.allowedConflictCourses.findIndex(
        course => course.code === payload.code,
      );
      if (index === -1) {
        state.allowedConflictCourses.push(payload);
      } else {
        state.allowedConflictCourses.splice(index, 1);
      }
    },
    lockSection(state, payload) {
      let index;
      if (payload.slice(0, 4) === 'Lock') {
        if (payload[4] === 'F') {
          index = state.fallLockedSections.indexOf(payload);
          if (index === -1) {
            state.fallLockedSections.push(payload);
          }
        } else {
          index = state.winterLockedSections.indexOf(payload);
          if (index === -1) {
            state.winterLockedSections.push(payload);
          }
        }
      } else if (payload[8] === 'F') {
        index = state.fallLockedSections.indexOf(payload);
        if (index === -1) {
          state.fallLockedSections.push(payload);
        }
      } else if (payload[8] === 'S') {
        index = state.winterLockedSections.indexOf(payload);
        if (index === -1) {
          state.winterLockedSections.push(payload);
        }
      } else if (payload[8] === 'Y') {
        index = state.fallLockedSections.indexOf(payload);
        if (index === -1) {
          state.fallLockedSections.push(payload);
          state.winterLockedSections.push(payload);
        }
      }
      saveState(state);
    },
    unlockSection(state, payload) {
      let index;
      if (payload.slice(0, 4) === 'Lock') {
        // Block hour
        if (payload[4] === 'F') {
          index = state.fallLockedSections.indexOf(payload);
          if (index !== -1) {
            state.fallLockedSections.splice(index, 1);
          }
        } else {
          index = state.winterLockedSections.indexOf(payload);
          if (index !== -1) {
            state.winterLockedSections.splice(index, 1);
          }
        }
      } else if (payload[8] === 'F') {
        // Fall
        index = state.fallLockedSections.indexOf(payload);
        if (index !== -1) {
          state.fallLockedSections.splice(index, 1);
        }
      } else if (payload[8] === 'S') {
        // Winter
        index = state.winterLockedSections.indexOf(payload);
        if (index !== -1) {
          state.winterLockedSections.splice(index, 1);
        }
      } else if (payload[8] === 'Y') {
        // Year
        index = state.fallLockedSections.indexOf(payload);
        if (index !== -1) {
          state.fallLockedSections.splice(index, 1);
          index = state.winterLockedSections.indexOf(payload);
          state.winterLockedSections.splice(index, 1);
        }
      }
    },
    setPreferredDeliveryMethod(state, payload) {
      state.deliveryMethod = payload;
    },
    setGlobalAllowConflicts(state, payload) {
      state.globalAllowConflicts = payload;
    },
    addHistory(state, payload) {
      addHistory(state, payload);
    },
    saveState(state){
      saveState(state);
    },
    loadState(state, payload) {
      const newState = JSON.parse(payload);
      state.fallSelectedCourses = newState.fallSelectedCourses;
      state.winterSelectedCourses = newState.winterSelectedCourses;
      state.fallTimetable = newState.fallTimetable;
      state.winterTimetable = newState.winterTimetable;
      state.fallLockedSections = newState.fallLockedSections;
      state.winterLockedSections = newState.winterLockedSections;
      state.deliveryMethod = newState.deliveryMethod;
      state.allowedConflictCourses = newState.allowedConflictCourses;
      state.searchBarValue = '';
      if(state.darkMode !== newState.darkMode) {
        regenerateColors(state);
      }
    },
    undo(state) {
      state.historyIndex -= 1;
    },
    redo(state) {
      state.historyIndex += 1;
    },
    regenerateColors(state) {
      regenerateColors(state);
    },
  },
  actions: {
    clearStorage(context) {
      context.state.fallLockedHourStatus = {
        '8 AM': false,
        '9 AM': false,
        '10 AM': false,
        '11 AM': false,
        '12 PM': false,
        '1 PM': false,
        '2 PM': false,
        '3 PM': false,
        '4 PM': false,
        '5 PM': false,
        '6 PM': false,
        '7 PM': false,
        '8 PM': false,
        '9 PM': false,
      };
      context.state.fallLockedDayStatus = {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
      };
      context.state.fallSelectedCourses = {};
      context.state.fallLockedSections = [];
      context.state.fallTimetable = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
      };
      context.state.winterLockedHourStatus = {
        '8 AM': false,
        '9 AM': false,
        '10 AM': false,
        '11 AM': false,
        '12 PM': false,
        '1 PM': false,
        '2 PM': false,
        '3 PM': false,
        '4 PM': false,
        '5 PM': false,
        '6 PM': false,
        '7 PM': false,
        '8 PM': false,
        '9 PM': false,
      };
      context.state.winterLockedDayStatus = {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
      };
      context.state.winterSelectedCourses = {};
      context.state.winterLockedSections = [];
      context.state.winterTimetable = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
      };
      context.state.tutorialPopup = false;
    },
    saveTimetable(context) {
      context.state.savedFallTimetable = JSON.parse(
        JSON.stringify(context.state.fallTimetable),
      );
      context.state.savedWinterTimetable = JSON.parse(
        JSON.stringify(context.state.winterTimetable),
      );
      context.state.savedFallSelectedCourses = JSON.parse(
        JSON.stringify(context.state.fallSelectedCourses),
      );
      context.state.savedWinterSelectedCourses = JSON.parse(
        JSON.stringify(context.state.winterSelectedCourses),
      );
      context.state.savedFallLockedSections = [
        ...context.state.fallLockedSections,
      ];
      context.state.savedWinterLockedSections = [
        ...context.state.winterLockedSections,
      ];
    },
    saveLockedDayStatus(context) {
      if (context.state.semesterStatus === 'F') {
        context.state.savedLockedDayStatus = JSON.parse(
          JSON.stringify(context.state.fallLockedDayStatus),
        );
      } else {
        context.state.savedLockedDayStatus = JSON.parse(
          JSON.stringify(context.state.winterLockedDayStatus),
        );
      }
    },
    saveLockedHourStatus(context) {
      if (context.state.semesterStatus === 'F') {
        context.state.savedLockedHourStatus = JSON.parse(
          JSON.stringify(context.state.fallLockedHourStatus),
        );
      } else {
        context.state.savedLockedHourStatus = JSON.parse(
          JSON.stringify(context.state.winterLockedHourStatus),
        );
      }
    },
    revertTimetable(context) {
      context.commit('setTimetables', [
        context.state.savedFallTimetable,
        context.state.savedWinterTimetable,
      ]);
      context.commit('setSelectedCourses', [
        context.state.savedFallSelectedCourses,
        context.state.savedWinterSelectedCourses,
      ]);
      context.commit('setLockedSections', [
        context.state.savedFallLockedSections,
        context.state.savedWinterLockedSections,
      ]);
      if (context.state.semesterStatus === 'F') {
        context.state.fallLockedHourStatus =
          context.state.savedLockedHourStatus;
        context.state.fallLockedDayStatus = context.state.savedLockedDayStatus;
      } else {
        context.state.winterLockedHourStatus =
          context.state.savedLockedHourStatus;
        context.state.winterLockedDayStatus =
          context.state.savedLockedDayStatus;
      }
    },
    validateTimetable(context, payload) {
      if (payload === null) {
        context.commit('setSearchBarValue', null);
        context.commit('setNoTimetablePopup', true);
        context.dispatch('revertTimetable');
      } else {
        context.commit('setTimetables', payload);
      }
    },
    selectCourse(context, payload) {
      // save the previous timetable by default
      if (!payload.noSave) {
        context.dispatch('saveTimetable');
      }

      // generate a color
      const color = genColor(context.state.darkMode ? darkSaturation : lightSaturation, context.state.darkMode ? darkLightness : lightLightness).hexString();
      // let currSemCourses

      // if (context.state.semesterStatus === "F") {
      //     currSemCourses = context.state.fallSelectedCourses;
      // } else {
      //     currSemCourses = context.state.winterSelectedCourses;
      // }

      // let inValid = true
      // while (inValid) {
      //     inValid = false
      //     for (let courseCode in currSemCourses) {
      //         if (colorDiff.compare(color, currSemCourses[courseCode].color) < 50) {
      //             inValid = true
      //             color = genColor(0.7, 0.85).hexString();
      //             break
      //         }
      //     }
      // }

      // Add the course
      context.commit('addCourse', {
        course: {
          color,
          ...payload.course,
        },
      });

      const fallCourses = Object.keys(context.state.fallSelectedCourses).map(
        code => context.state.fallSelectedCourses[code],
      );
      const winterCourses = Object.keys(
        context.state.winterSelectedCourses,
      ).map(code => context.state.winterSelectedCourses[code]);

      const timetables = generateTimetables(
        fallCourses,
        context.state.fallLockedSections,
        winterCourses,
        context.state.winterLockedSections,
        context.state.deliveryMethod,
        context.state.allowedConflictCourses,
      );

      context.dispatch('validateTimetable', timetables);
      context.dispatch('saveState');
    },
    deleteCourse(context, payload) {
      // resets search bar value if the deleted course is the last searched course
      if (
        context.state.searchBarValue !== null &&
        context.state.searchBarValue.includes(payload.code)
      ) {
        context.commit('setSearchBarValue', null);
      }

      // Remove course
      context.commit('removeCourse', payload);

      // Remove from allowed conflict courses
      if (
        context.state.allowedConflictCourses.findIndex(
          course => course.code === payload.code,
        ) !== -1
      ) {
        context.commit('addOrRemoveConflictCourse', payload);
      }

      // Unlock all sections of the deleted course
      for (const lockedSection of context.state.fallLockedSections) {
        if (lockedSection.includes(payload.code)) {
          context.commit('unlockSection', lockedSection);
        }
      }
      for (const lockedSection of context.state.winterLockedSections) {
        if (lockedSection.includes(payload.code)) {
          context.commit('unlockSection', lockedSection);
        }
      }

      // Remove all sections of the deleted course from the correct timetable
      if (payload.code.includes('Lock')) {
        if (payload.code[4] === 'F') {
          for (const day in context.state.fallTimetable) {
            const dayEvents = context.state.fallTimetable[day];
            for (let i = dayEvents.length - 1; i >= 0; i -= 1) {
              if (dayEvents[i].code === payload.code) {
                dayEvents.splice(i, 1);
                break;
              }
            }
          }
        } else {
          for (const day in context.state.winterTimetable) {
            const dayEvents = context.state.winterTimetable[day];
            for (let i = dayEvents.length - 1; i >= 0; i -= 1) {
              if (dayEvents[i].code === payload.code) {
                dayEvents.splice(i, 1);
                break;
              }
            }
          }
        }
      } else {
        for (const day in context.state.fallTimetable) {
          const dayEvents = context.state.fallTimetable[day];
          for (let i = dayEvents.length - 1; i >= 0; i -= 1) {
            if (dayEvents[i].code === payload.code) {
              dayEvents.splice(i, 1);
            }
          }
        }
        for (const day in context.state.winterTimetable) {
          const dayEvents = context.state.winterTimetable[day];
          for (let i = dayEvents.length - 1; i >= 0; i -= 1) {
            if (dayEvents[i].code === payload.code) {
              dayEvents.splice(i, 1);
            }
          }
        }
      }
      context.dispatch('saveState');
    },
    // Recalculate timetable when switching sections with conflict
    resetTimetable(context, payload) {
      if (!payload) {
        context.dispatch('saveTimetable');
      }

      const fallCourses = Object.keys(context.state.fallSelectedCourses).map(
        code => context.state.fallSelectedCourses[code],
      );
      const winterCourses = Object.keys(
        context.state.winterSelectedCourses,
      ).map(code => context.state.winterSelectedCourses[code]);

      const bothTimetables = generateTimetables(
        fallCourses,
        context.state.fallLockedSections,
        winterCourses,
        context.state.winterLockedSections,
        context.state.deliveryMethod,
        context.state.allowedConflictCourses,
      );

      context.dispatch('validateTimetable', bothTimetables);
    },
    // Switch a section of a course when there is no conflict
    switchSection(context, payload) {
      // Remove old section from locked sections
      context.commit(
        'unlockSection',
        `${payload.old.courseCode}${payload.old.sectionCode}`,
      );

      const whichSemesters = [];
      if (payload.old.courseCode[8] === 'F') {
        whichSemesters.push(context.state.fallTimetable);
      } else if (payload.old.courseCode[8] === 'S') {
        whichSemesters.push(context.state.winterTimetable);
      } else {
        whichSemesters.push(context.state.fallTimetable);
        whichSemesters.push(context.state.winterTimetable);
      }

      for (const semester of whichSemesters) {
        // Remove old section from timetable
        for (const d in semester) {
          const day = semester[d];
          for (let i = day.length - 1; i >= 0; i -= 1) {
            if (
              `${day[i].code}${day[i].sectionCode}` ===
              `${payload.old.courseCode}${payload.old.sectionCode}`
            ) {
              day.splice(i, 1);
            }
          }
        }
        // Add new section into timetable
        for (const time of payload.new.times) {
          semester[time.day].push({
            code: payload.old.courseCode,
            sectionCode: payload.new.sectionCode,
            instructors: payload.new.instructors,
            ...time,
          });
          semester[time.day].sort((a, b) => a.start - b.start);
        }
      }
    },
    saveState({commit}) {
      commit('saveState');
    },
    undo(context) {
      if (context.state.history.length - 1 + context.state.historyIndex > 0) {
        context.commit('undo');
        context.commit('loadState', context.state.history[context.state.history.length - 1 + context.state.historyIndex]);
      }
    },
    redo(context) {
      if (context.state.historyIndex < 0) {
        const state=  context.state.history[context.state.history.length + context.state.historyIndex];
        context.commit('redo');
        context.commit('loadState',state );
      }
    },
  },
  modules: {},
  getters: {
    getSerializedState: state => state.history[state.history.length - 1 + state.historyIndex],
    getExportOverlay: state => state.exportOverlay,
    getNoTimetablePopup: state => state.noTimetablePopup,
    getShareLinkPopup: state => state.shareLinkPopup,
    getShareLink: state => state.shareLink,
    getOverwriteLockedSectionPopup: state => state.overwriteLockedSectionPopup,
    getTutorialPopup(state) {
      return state.tutorialPopup;
    },
    timetable: state => {
      if (state.semesterStatus === 'F') {
        return state.fallTimetable;
      } else {
        return state.winterTimetable;
      }
    },
    fallTimetable: state => state.fallTimetable,
    winterTimetable: state => state.winterTimetable,
    selectedCourses: state => whichSemester => {
      if (whichSemester === 'F') {
        return state.fallSelectedCourses;
      } else if (whichSemester === 'S') {
        return state.winterSelectedCourses;
      }
      if (state.semesterStatus === 'F') {
        return state.fallSelectedCourses;
      } else {
        return state.winterSelectedCourses;
      }
    },
    isConflictedCourse: state => courseCode =>
      state.allowedConflictCourses.findIndex(
        curCourse => curCourse.code === courseCode,
      ) !== -1,
    fallSelectedCourses: state => state.fallSelectedCourses,
    winterSelectedCourses: state => state.winterSelectedCourses,
    getLockedSections: state => {
      if (state.semesterStatus === 'F') {
        return state.fallLockedSections;
      } else {
        return state.winterLockedSections;
      }
    },
    fallLockedSections: state => state.fallLockedSections,
    allowedConflictCourses: state => state.allowedConflictCourses,
    winterLockedSections: state => state.winterLockedSections,
    getCourseColor: state => code => {
      if (code[8] === 'F') {
        return state.fallSelectedCourses[code].color;
      } else {
        return state.winterSelectedCourses[code].color;
      }
    },
    getSearchBarValue: state => state.searchBarValue,
    getSemesterStatus: state => state.semesterStatus,
    getLockedDayStatus: state => {
      if (state.semesterStatus === 'F') {
        return state.fallLockedDayStatus;
      } else {
        return state.winterLockedDayStatus;
      }
    },
    getLockedHourStatus: state => {
      if (state.semesterStatus === 'F') {
        return state.fallLockedHourStatus;
      } else {
        return state.winterLockedHourStatus;
      }
    },
    getFallLockedHourStatus: state => state.fallLockedHourStatus,
    getWinterLockedHourStatus: state => state.winterLockedHourStatus,
    getFallLockedDayStatus: state => state.fallLockedDayStatus,
    getWinterLockedDayStatus: state => state.winterLockedDayStatus,
    getClearStorage: state => state.clearStorage,
    getGlobalAllowConflicts: state => state.globalAllowConflicts,
    getHistoryLength: state => state.history.length,
    getWarningSections: state => {
      const timetable = state.semesterStatus === 'F' ? state.fallTimetable : state.winterTimetable;
      const selected = state.semesterStatus === 'F' ? state.fallSelectedCourses : state.winterSelectedCourses;
      const sections = new Set();
      Object.values(timetable).forEach(arr =>{
        arr.forEach(section => sections.add(`${section.code} ${section.sectionCode}`));
      })
      const warningSections = [];
      sections.forEach(x=>{
        const splitted = x.split(' ');
        if (selected[splitted[0]].meeting_sections.find(section => section.sectionCode === splitted[1]).openLimitInd === 'C') {
          warningSections.push(x);
        }
      })
      return warningSections.map(x => {
        const splitted = x.split(' ');
        return { code: splitted[0], sectionCode: splitted[1] };
      });
    }
  },
});
