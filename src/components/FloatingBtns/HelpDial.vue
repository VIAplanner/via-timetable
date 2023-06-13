<template>
  <v-speed-dial
    v-model="fab"
    right
    bottom
    fixed
    direction="top"
    transition="scale-transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="#012B5C" dark small fab>
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-hammer-screwdriver</v-icon>
      </v-btn>
    </template>
    <export-calendar-btn></export-calendar-btn>
    <export-to-png-btn></export-to-png-btn>
    <about-btn></about-btn>
    <tutorial-btn></tutorial-btn>
    <export-to-json-btn></export-to-json-btn>
    <import-btn></import-btn>
    <url-btn/>
  </v-speed-dial>
</template>

<script>
import TutorialBtn from './TutorialBtn.vue';
import AboutBtn from './AboutBtn.vue';
import ExportToJsonBtn from './ExportToJsonBtn.vue';
import ImportBtn from './ImportBtn.vue';
import ExportToPngBtn from './ExportToPngBtn.vue';
import ExportCalendarBtn from './ExportCalendarBtn.vue';
import UrlBtn from './UrlBtn.vue';

export default {
  components: {
    TutorialBtn,
    AboutBtn,
    ExportToJsonBtn,
    ExportCalendarBtn,
    ImportBtn,
    ExportToPngBtn,
    UrlBtn
  },
  data() {
    return {
      fab: false,
    };
  },
};
</script>
