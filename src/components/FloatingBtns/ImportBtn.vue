<template>
  <div @mouseover='hovered = true' @mouseleave='hovered = false'>
    <v-tooltip left v-if='hovered'>
      <template v-slot:activator='{ on, attrs }'>
        <v-btn
          v-if='hovered'
          fab
          dark
          small
          color='green'
          @click='upload()'
          v-bind='attrs'
          v-on='on'
        >
          <v-icon>mdi-upload</v-icon>
        </v-btn>
      </template>
      <span>Import a saved timetable</span>
    </v-tooltip>
    <v-btn v-else fab dark small color='green'>
      <v-icon>mdi-upload</v-icon>
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
    ...mapGetters(['getSemesterStatus']),
  },
  methods: {
    ...mapMutations(['setSemesterStatus', 'setExportOverlay', 'loadState']),
    // timer function for making the system sleep
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    upload() {
      const el = document.createElement('input');
      el.setAttribute('type', 'file');
      el.setAttribute('id', 'file-upload');
      el.setAttribute('accept', '.json');
      el.setAttribute('style', 'display: none');
      el.onchange = this.onChange;
      document.body.append(el)
      document.getElementById('file-upload').click();
    },
    async onChange() {
      // await this.sleep(100);
      const file = document.getElementById('file-upload').files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      const { loadState } = this;
      reader.onload = () => {
        loadState(reader.result);
      };
      document.body.removeChild(document.getElementById('file-upload'));
    },
  },
};
</script>
