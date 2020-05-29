<template>
  <v-dialog v-model="getConflictPopup" persistent max-width="290">
    <v-card>
      <v-img height="75px" :src="logo">
        <v-card-title class="white--text align-end cardTitle" primary-title>Warning</v-card-title>
      </v-img>
      <v-card-text class="text--primary">
        <div class="textStyle">
          We are unable to generate a possible timetable based on changes you
          made. We will roll back to your previous timetable.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="popUpType"
          color="blue darken-1"
          text
          @click="setConflictPopup(false)"
        >I understand</v-btn>
        <v-btn v-if="!popUpType" color="blue darken-1" text @click="setConflictPopup(false)">Proceed</v-btn>
        <v-btn v-if="!popUpType" color="blue darken-1" text @click="setConflictPopup(false)">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  props: {
    popUpType: Boolean //True: No possible timetable, false: overwrite locked sections
  },
  data() {
    return {
      noTimetableMessage:
        "We are unable to generate a possible timetable based on changes you made. We will roll back to your previous timetable.",
      lockSectionMessage:
        "You are switching to a course section that is currently locked, do you want to override a locked section?",
      logo: require("../assets/barbackground.png")
    };
  },
  computed: {
    ...mapGetters(["getConflictPopup"]),
    message() {
      if (this.popUpType) {
        return this.noTimetableMessage;
      }
      return this.lockSectionMessage;
    }
  },
  methods: {
    ...mapMutations(["setConflictPopup"])
  }
};
</script>

<style>
.cardTitle {
  padding: 25px;
}
.textStyle {
  margin-top: 20px;
}
/* .buttonStyle{
  min-width:0px;
} */
</style>
