<template>
  <div>
    <v-btn
      class="mr-4"
      @click="dialog = true"
    >
      Add Assessment
    </v-btn>
    <assessment-modal v-bind.sync="this.$data" v-on:closeDialog="closeDialog" />
  </div>
</template>

<script>

import AssessmentModal from '../AssessmentModal/AssessmentModal.vue'

const defaultState = {
  mode: 'New',
  dialog: false,
  type: null,
  description: null,
  weight: null,
  grade: null,
  deadline: null,
}

export default {
  components: { AssessmentModal },
  data() {
    return {
      ...defaultState
    }
  },
  methods: {
    closeDialog() {
      Object.assign(this.$data, defaultState);
    }
  }
}
</script>
