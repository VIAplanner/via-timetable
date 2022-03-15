import api from '../plugins/api';

export default {
  state: {
  },
  mutations: {
    addAssessment(state, payload) {
      if (state.semesterStatus === 'F') {
        state.fallSelectedCourses[payload.courseCode].assessments = payload.assessments;
      } else {
        state.winterSelectedCourses[payload.courseCode].assessments = payload.assessments;
      }
    },
    editAssessment(state, payload) {
      if (state.semester === 'F') {
        state.fallSelectedCourses[payload.courseCode].assessments[payload.index] = payload.todo;
      } else {
        state.winterSelectedCourses[payload.courseCode].assessments[payload.index] = payload.todo;
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
    async importAssessmentFromParser({
      commit
    }, payload) {
      await api.post('/manager/parser', payload.file, {
        'Content-Type': 'multipart/form-data',
      }, ).then((res) => commit('addAssessment', {
        courseCode: payload.courseCode,
        assessments: res.data,
      }))
    }
  },
}