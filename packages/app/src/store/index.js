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
      // console.log("Selecting meeting section: " + payload)
      // console.log(payload)
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
            payload.course.meeting_sections = payload.course.meeting_sections.map(
              meetingSection => {
                console.log(meetingSection.code.substring(meetingSection.code.length - 5))
                return {
                  code: meetingSection.code.substring(meetingSection.code.length - 5),
                  ...meetingSection
                }
              }
            );
            console.log(payload.course)
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
      console.log(payload.course)
      console.log(this.state.selectedCourses[payload.course.code])
      const courses = Object.keys(context.state.selectedCourses).map(code => context.state.selectedCourses[code])
      // console.log(courses)
      const timetables = generateTimetables(courses)
      // console.log(timetables)
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
    getCourseColor: (state) => (code) => {
      // console.log(code)
      // console.log(state.selectedCourses[code])
      return state.selectedCourses[code].color
    }
  }
})
