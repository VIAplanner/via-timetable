<template>
  <div @mouseover="hovered = true" @mouseleave="hovered = false">
    <v-tooltip left v-if="hovered">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="hovered"
          fab
          dark
          small
          color="green"
          @click="forceFileDownload"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
      <span>Save timetable as a file</span>
    </v-tooltip>
    <v-btn v-else fab dark small color="green">
      <v-icon>mdi-download</v-icon>
    </v-btn>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      hovered: true,
      exportURL: null,
    };
  },
  computed: {
    ...mapGetters(['getSemesterStatus', 'getSerializedState']),
  },
  methods: {
    ...mapMutations(['setSemesterStatus', 'setExportOverlay']),

    // timer function for making the system sleep
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // magic
    forceFileDownload() {
      const url = window.URL.createObjectURL(new Blob([this.getSerializedState]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "timetable.json");
      // add a new link in the html for download
      document.body.appendChild(link);
      link.click();
      // remove that child
      document.body.removeChild(document.body.lastChild);
    },
  },
};
</script>
