<template>
  <div>
    <help-dial />
    <v-carousel
      v-model="whichTimetable"
      :height="carouselHeight"
      hide-delimiters
      style="marginTop: 20px;"
      light
      :show-arrows="false"
    >
      <v-carousel-item>
        <smooth-scrollbar :style="contentHeightCSS">
          <timetable
            :timetable="fallTimetable"
            semester="F"
            id="exportFallMe"
          />
        </smooth-scrollbar>
      </v-carousel-item>
      <v-carousel-item>
        <smooth-scrollbar :style="contentHeightCSS">
          <timetable
            :timetable="winterTimetable"
            semester="S"
            id="exportWinterMe"
          />
        </smooth-scrollbar>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Timetable from '../components/Timetable/Timetable.vue';
import HelpDial from '../components/FloatingBtns/HelpDial.vue';

export default {
  components: {
    Timetable,
    HelpDial,
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  computed: {
    ...mapGetters(['fallTimetable', 'winterTimetable', 'getSemesterStatus']),
    contentHeightCSS() {
      return `height: ${this.height - 110}px`;
    },
    carouselHeight() {
      return this.height - 100;
    },
    whichTimetable() {
      if (this.getSemesterStatus === 'F') {
        return 0;
      } else {
        return 1;
      }
    },
  },
  data() {
    return {
      height: window.innerHeight,
    };
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight;
    },
  },
};
</script>
<style scoped>
.timetableColumn {
  padding-top: 0px;
  height: 100%;
}
</style>
