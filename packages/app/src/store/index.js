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
    timetable: {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
    },
    colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
    takenColors: [],
    timetableSelectedMeetingSections: {
      lecture: null,
      practical: null,
      tutorial: null
    }
  },
  mutations: {
    setTimetable(state, payload) {
      state.timetable = payload.timetable
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
    },
    setTimetableSelectedMeetingSections(state, payload) {
      console.log(payload.code)
      let selectedMeetingSections = {
        lecture: null,
        practical: null,
        tutorial: null
      };
      for (let day in state.timetable) {
        const dayEvents = state.timetable[day];
        for (let event of dayEvents) {
          console.log(event.code, payload.code)
          if (event.code === payload.code) {
            console.log("Found")
            if (event.sectionCode.charAt(0) == "L") {
              selectedMeetingSections.lecture = event.sectionCode;
            } else if (event.sectionCode.charAt(0) == "P") {
              selectedMeetingSections.practical = event.sectionCode;
            } else selectedMeetingSections.tutorial = event.sectionCode;
          }
        }
      }
      state.timetableSelectedMeetingSections.lecture = selectedMeetingSections.lecture
      state.timetableSelectedMeetingSections.tutorial = selectedMeetingSections.tutorial
      state.timetableSelectedMeetingSections.practical = selectedMeetingSections.practical   
      
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
      const courses = Object.keys(context.state.selectedCourses).map(code => context.state.selectedCourses[code])
      const timetables = generateTimetables(courses)
      context.commit("setTimetables", { timetables })
      context.commit("setTimetable", { timetable: context.state.timetables[0] })
    },
    deleteCourse(context, payload) {
      context.commit("removeCourse", payload)
      const courses = Object.keys(context.state.selectedCourses).map(code => context.state.selectedCourses[code])
      if (courses.length == 0) {
        context.commit("setTimetables", {
          timetables: [{
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          }]
        }
        )
      }
      else {
        const timetables = generateTimetables(courses)
        console.log(timetables)
        context.commit("setTimetables", { timetables })
      }

      context.commit("setTimetable", { timetable: context.state.timetables[0] })
    }
  },
  modules: {
  },
  getters: {
    selectedCourses: state => {
      return state.selectedCourses
    },
    timetable: state => {
      return state.timetable
    },
    getCourseColor: (state) => (code) => {
      return state.selectedCourses[code].color
    },
    timetableSelectedMeetingSections: (state) => {
      return state.timetableSelectedMeetingSections
    }
  }
})
