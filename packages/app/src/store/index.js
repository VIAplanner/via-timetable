import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    timetable: {
      Monday: [
        {
          courseCode: "CSC258H5S",
          courseName: "Computer Organizaion",
          section: "L0101",
          start: 32400,
          end: 39600,
          location: "IB 345",
          instructorName: "Andrew Petersen"
        },
        {
          courseCode: "STA258H5S",
          courseName: "Statistics with Prob",
          section: "L0101",
          start: 54000,
          end: 61200,
          location: "MN 1210",
          instructorName: "Alvaro Nosedal Sanchez"
        }
      ],
      Tuesday: [
        {
          courseCode: "CSC207H5S",
          courseName: "Software Design",
          section: "L0101",
          start: 39600,
          end: 46800,
          location: "MN 1270",
          instructorName: "Arnold Rosenbloom"
        },
        {
          courseCode: "CSC258H5S",
          courseName: "Computer Organizaion",
          section: "P0109",
          start: 61200,
          end: 64800,
          location: "DH 2026",
          instructorName: "TBA"
        }
      ],
      Wednesday: [
        {
          courseCode: "CSC290H5S",
          courseName: "Communication Skills for CSC",
          section: "L0101",
          start: 50400,
          end: 57600,
          location: "MN 1270",
          instructorName: "Paul Virbik"
        },
        {
          courseCode: "STA258H5S",
          courseName: "Statistics with Prob",
          section: "T0105",
          start: 61200,
          end: 64800,
          location: "DH 2080",
          instructorName: "TBA"
        }
      ],
      Thursday: [
        {
          courseCode: "CSC290H5S",
          courseName: "Communication Skills for CSC",
          section: "T0101",
          start: 39600,
          end: 46800,
          location: "MN 1270",
          instructorName: "TBA"
        },
        {
          courseCode: "CSC209H5S",
          courseName: "Soft Tools & Sys Prog",
          section: "P0111",
          start: 61200,
          end: 64800,
          location: "DH 2026",
          instructorName: "TBA"
        }
      ],
      Friday: [
        {
          courseCode: "CSC209H5S",
          courseName: "Soft Tools & Sys Prog",
          section: "L0104",
          start: 50400,
          end: 57600,
          location: "MN 1270",
          instructorName: "Andrew Petersen"
        }
      ]
    },
    selectedCourses: {
      CSC108: {
        lecture: null,
        tutorial: null,
        practical: null}
    },
  },
  mutations: {
    selectMeetingSection(state, payload) {
      console.log("Selecting meeting section: " + payload)
      console.log(payload)
      state.selectedCourses[payload.courseCode][payload.sectionType] = payload.meetingSection
    }
  },
  actions: {
  },
  modules: {
  }
})
