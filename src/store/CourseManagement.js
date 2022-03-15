export default {
  state: {
    assessments: [{
        "type": "Quiz",
        "description": "Pre-Class Quizzes (best 10 out of 12)",
        "deadline": null,
        "on_going": true,
        "weight": "5%"
      },
      {
        "type": "Assignment",
        "description": "Best 4 (out of 5) assignments.",
        "deadline": null,
        "on_going": true,
        "weight": "10%"
      },
      {
        "type": "Quiz",
        "description": "Best 3 (out of 4) in-class quizzes.",
        "deadline": null,
        "on_going": true,
        "weight": "24%"
      },
      {
        "type": "Term Test",
        "description": "",
        "deadline": "2021-10-28",
        "on_going": false,
        "weight": "16%"
      },
      {
        "type": "Class Participation",
        "description": "Participation in Class Polling (85% participation is required for the full\nmark)",
        "deadline": null,
        "on_going": true,
        "weight": "5%"
      },
      {
        "type": "Final Exam",
        "description": "TBA",
        "deadline": null,
        "on_going": false,
        "weight": "40%"
      }
    ]
  },
  mutations: {
    editAssessment(state, index, payload) {
      state.assessments[index] = payload;
    },
    deleteAssessment(state, index) {
      state.assessments.splice(index, 1);
    },
  }
}