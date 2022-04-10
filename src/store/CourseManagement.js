import api from '../plugins/api';

export default {
  mutations: {
    addAssessmentToCourse(state, payload) {
      // pre-processing data
      if (!payload.course.assessments) {
        payload.course.assessments = [];
      }

      if (!payload.assessment.grade) {
        payload.assessment.grade = null;
      }

      payload.assessment.subtasks = [];

      payload.course.assessments.push(payload.assessment);
    },
    editAssessment(state, payload) {
      if (payload.courseCode[8] === 'F' || payload.courseCode[8] === 'Y') {
        const old = state.fallSelectedCourses[payload.courseCode].assessments[payload.index];
        state.fallSelectedCourses[payload.courseCode].assessments[payload.index] = payload.assessment;
        if (payload.assessment.deadline) {
          this.commit('editCourseAssessmentEvent', {
            oldPayload: old,
            newPayload: payload
          });
        }
      }
      if (payload.courseCode[8] === 'S' || payload.courseCode[8] === 'Y') {
        const old = state.winterSelectedCourses[payload.courseCode].assessments[payload.index];
        state.winterSelectedCourses[payload.courseCode].assessments[payload.index] = payload.assessment;
        if (payload.assessment.deadline) {
          this.commit('editCourseAssessmentEvent', {
            oldPayload: old,
            newPayload: payload
          });
        }
      }
    },
    deleteAssessment(state, payload) {
      if (payload.courseCode[8] === 'F' || payload.courseCode[8] === 'Y') {
        this.commit('deleteCourseAssessmentEvent', {
          name: state.fallSelectedCourses[payload.courseCode].assessments[payload.index].type,
          course: payload.courseCode,
          details: `${state.fallSelectedCourses[payload.courseCode].assessments[payload.index].description} \n\nWeight: ${state.fallSelectedCourses[payload.courseCode].assessments[payload.index].weight}`
        });
        state.fallSelectedCourses[payload.courseCode].assessments.splice(payload.index, 1);
      }
      if (payload.courseCode[8] === 'S' || payload.courseCode[8] === 'Y') {
        this.commit('deleteCourseAssessmentEvent', {
          name: state.winterSelectedCourses[payload.courseCode].assessments[payload.index].type,
          course: payload.courseCode,
          details: `${state.winterSelectedCourses[payload.courseCode].assessments[payload.index].description} \n\nWeight: ${state.winterSelectedCourses[payload.courseCode].assessments[payload.index].weight}`
        });
        state.winterSelectedCourses[payload.courseCode].assessments.splice(payload.index, 1);
      }
    },
  },
  actions: {
    addAssessment({
      commit,
      state
    }, payload) {
      if (payload.courseCode[8] === 'F' || payload.courseCode[8] === 'Y') {
        const duplicatedAssessments = state.fallSelectedCourses[payload.courseCode].assessments.filter(a => a.type === payload.assessment.type && a.description === payload.assessment.description && a.weight === payload.assessment.weight && a.deadline === payload.assessment.deadline);
        if (duplicatedAssessments.length > 0) {
          return;
        }
        commit('addAssessmentToCourse', {
          course: state.fallSelectedCourses[payload.courseCode],
          assessment: payload.assessment
        })
      }
      if (payload.courseCode[8] === 'S' || payload.courseCode[8] === 'Y') {
        const duplicatedAssessments = state.winterSelectedCourses[payload.courseCode].assessments.filter(a => a.type === payload.assessment.type && a.description === payload.assessment.description && a.weight === payload.assessment.weight && a.deadline === payload.assessment.deadline);
        if (duplicatedAssessments.length > 0) {
          return;
        }
        commit('addAssessmentToCourse', {
          course: state.winterSelectedCourses[payload.courseCode],
          assessment: payload.assessment
        })
      }
      if (payload.assessment.deadline) {
        commit('createCalendarEvent', {
          eventName: payload.assessment.type,
          eventWeight: payload.assessment.weight,
          eventCourse: payload.courseCode,
          eventDetails: payload.assessment.description,
          eventDate: new Date(payload.assessment.deadline)
        });
      }
    },

    async importAssessmentFromParser({
      dispatch
    }, payload) {
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