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
          @click="exportTimetables"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-image</v-icon>
        </v-btn>
      </template>
      <span>Export Timetable as a PNG</span>
    </v-tooltip>
    <v-btn v-else fab dark small color="green">
      <v-icon>mdi-image</v-icon>
    </v-btn>
  </div>
</template>

<script>
/* eslint-disable no-console */
import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      hovered: true,
      exportURL: null,
    };
  },
  computed: {
    ...mapGetters(['getSemesterStatus']),
  },
  methods: {
    ...mapMutations(['setSemesterStatus', 'setExportOverlay']),

    // timer function for making the system sleep
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // switch timetable download, then repeat
    async exportTimetables() {
      this.setExportOverlay(true);

      if (this.getSemesterStatus === 'F') {
        this.setSemesterStatus('S');
        await this.exportTimetable('Winter-Timetable.png', '#exportWinterMe');
      } else {
        this.setSemesterStatus('F');
        await this.exportTimetable('Fall-Timetable.png', '#exportFallMe');
      }

      if (this.getSemesterStatus === 'F') {
        this.setSemesterStatus('S');
        await this.exportTimetable('Winter-Timetable.png', '#exportWinterMe');
      } else {
        this.setSemesterStatus('F');
        await this.exportTimetable('Fall-Timetable.png', '#exportFallMe');
      }

      this.setExportOverlay(false);
    },

    async exportTimetable(filename, id) {
      await this.sleep(50);

      // grab the entire screen element
      const el = document.querySelector(id);

      const options = {
        type: 'dataURL',
      };

      try {
        this.exportURL = await this.$html2canvas(el, options);
      } catch (error) {
        console.log('conversion error');
      }

      this.downloadWithAxios(filename);
    },

    // magic
    forceFileDownload(response, fileName) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      // add a new link in the html for download
      document.body.appendChild(link);
      link.click();
      // remove that child
      document.body.removeChild(document.body.lastChild);
    },

    // more magic
    async downloadWithAxios(fileName) {
      let response = null;

      try {
        response = await axios({
          method: 'get',
          url: this.exportURL,
          responseType: 'arraybuffer',
        });
        this.forceFileDownload(response, fileName);
      } catch (error) {
        console.log('Download Failed');
      }
    },
  },
};
</script>
