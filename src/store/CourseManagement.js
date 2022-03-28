import api from '../plugins/api';

export default {
  mutations: {
    editAssessment(state, payload) {
      if (state.semester === 'F') {
        state.fallSelectedCourses[payload.courseCode].assessments[payload.index] = payload.assessment;
      } else {
        state.winterSelectedCourses[payload.courseCode].assessments[payload.index] = payload.assessment;
      }
    },
    deleteAssessment(state, payload) {
      if (state.semesterStatus === 'F') {
        state.fallSelectedCourses[payload.courseCode].assessments.splice(payload.index, 1);
      } else {
        state.winterSelectedCourses[payload.courseCode].assessments.splice(payload.index, 1);
      }
    },
  },
  actions: {
    addAssessment({commit, state}, payload) {
      let course = {};
      if (state.semesterStatus === 'F') {
        course = state.fallSelectedCourses[payload.courseCode];
      } else {
        course = state.winterSelectedCourses[payload.courseCode];
      }

      if (!course.assessments) {
        course.assessments = [];
      }

      if (!payload.assessment.grade) {
        payload.assessment.grade = null
      }

      payload.assessment.subtasks = [];

      course.assessments.push(payload.assessment)

      commit('createCalendarEvent', {
        eventName: payload.assessment.type,
        eventWeight: payload.assessment.weight,
        eventCourse: payload.courseCode,
        eventDetails: payload.assessment.description,
        eventDate: new Date(payload.assessment.deadline)
      });
    },

    async importAssessmentFromParser({ dispatch }, payload) {
      await api.post('/manager/parser', payload.file, {
        'Content-Type': 'multipart/form-data',
      }).then(res => {
        res.data.forEach((event) => {
          dispatch('addAssessment', {
            courseCode: payload.courseCode,
            assessment: event,
          });
        })
      })
    }
  }
}