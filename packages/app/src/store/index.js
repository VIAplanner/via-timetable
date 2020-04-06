import Vue from 'vue'
import Vuex from 'vuex'
import { generateTimetables } from "../timetable-planner"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedCourses: {},
    timetables: [{
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],

    }],
    colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
    takenColors: []
  },
  mutations: {
    selectMeetingSection(state, payload) {
      console.log("Selecting meeting section: " + payload)
      console.log(payload)
      state.selectedCourses[payload.courseCode][payload.sectionType] = payload.meetingSection
    },
    setTimetables(state, payload) {
      state.timetables = payload.timetables
    },
    addCourse(state, payload) {
      state.selectedCourses[payload.course.code] = payload.course
      state.takenColors.push(payload.course.color)
    },
    removeCourse(state, payload) {
      state.colors.push(state.selectedCourses[payload.code].color)
      state.takenColors.splice(state.takenColors.indexOf(state.selectedCourses[payload.code].color), 1);
      Vue.delete(state.selectedCourses, payload.code)
    }
  },
  actions: {
    selectCourse(context, payload) {
      const color = context.state.colors.pop()
      context.commit("addCourse", {
        course: {
          selectedMeetingSections: {
            lecture: null,
            tutorial: null,
            practical: null
          },
          color,
          ...payload.course
        }
      })
      const timetables = generateTimetables(Object.keys(context.state.selectedCourses).map(code => context.state.selectedCourses[code]))
      context.commit("setTimetables", { timetables })
    }
  },
  modules: {
  },
  getters: {
    selectedCourses: state => {
      return state.selectedCourses
    },
    timetable: state => {
      return state.timetables[0]
    },
    courseCodeColorMap: state => {
      const codeColorMap = new Map();
      var index = 0;
      console.log
      for (let course in state.selectedCourses) {
        console.log(course)
        if (!codeColorMap.has(course.code)) {
          codeColorMap.set(course.code, state.colors[index]);
          index++;
        }
      }
      return codeColorMap;
    },
  }
})
