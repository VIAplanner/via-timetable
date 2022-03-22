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
      const res = await api.post('/manager/parser', payload.file, {
        'Content-Type': 'multipart/form-data',
      }, 
      );
      commit('addAssessment', {
        courseCode: payload.courseCode,
        assessments: res.data,
      });

      res.data.forEach((event) => {
        commit('createCalendarEvent', {
          eventName: event.name,
          eventCourse: payload.courseCode,
          eventDetails: event.description,
          eventDate: new Date(event.deadline)
        });
      })
    }
  },
}