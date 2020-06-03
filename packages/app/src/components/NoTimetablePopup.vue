<template>
  <v-dialog v-model="getNoTimetablePopup" persistent max-width="290">
    <v-card>
      <v-img height="75px" :src="logo" eager>
        <v-card-title class="white--text align-end cardTitle" primary-title>Warning</v-card-title>
      </v-img>
      <v-card-text class="text--primary">
        <div class="textStyle">
          We are unable to generate a timetable based on the changes you
          made. We will roll back your previous timetable.
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
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      logo: require("../assets/barbackground.png")
    };
  },
  computed: {
    ...mapGetters(["getNoTimetablePopup"]),
  },
  methods: {
    ...mapMutations(["setNoTimetablePopup"])
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
