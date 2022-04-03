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
    <export-events-btn></export-events-btn>
    <export-calendar-btn></export-calendar-btn>
    <export-btn></export-btn>
    <about-btn></about-btn>
    <tutorial-btn></tutorial-btn>
  </v-speed-dial>
</template>

<script>
import TutorialBtn from './TutorialBtn.vue';
import AboutBtn from './AboutBtn.vue';
import ExportBtn from './ExportBtn.vue';
import ExportCalendarBtn from './ExportCalendarBtn.vue';
import ExportEventsBtn from './ExportEventsBtn.vue';

export default {
  components: {
    TutorialBtn,
    AboutBtn,
    ExportBtn,
    ExportCalendarBtn,
    ExportEventsBtn,
  },
  data() {
    return {
      fab: false,
    };
  },
};
</script>
