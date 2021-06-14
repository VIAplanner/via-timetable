<template>
  <v-dialog v-model="getNoTimetablePopup" persistent max-width="290">
    <v-card>
      <v-card-title
        class="white--text align-end cardTitle"
        primary-title
        style="background: #012B5C"
      >
        <v-row class="fill-height ml-1 mb-1" justify="start" align="center">
          Warning
        </v-row>
      </v-card-title>
      <v-card-text class="text--primary">
        <div class="textStyle">
          We are unable to generate a pair of timetables based on the changes
          you made. We will roll back your previous timetable.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="setNoTimetablePopup(false)">
          I understand
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getNoTimetablePopup']),
  },
  methods: {
    ...mapMutations(['setNoTimetablePopup']),
  },
};
</script>

<style>
.cardTitle {
  padding: 25px;
}
.textStyle {
  margin-top: 20px;
}
</style>
