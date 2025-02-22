<template>
  <v-dialog v-model="dialog" width="600" persistent>
    <v-card>
      <v-card-title style="background-color: #012B5C;">
        <p class="headline ma-0" style="color: white">
          Welcome to VIAplanner!
        </p>
        <v-spacer></v-spacer>
        <v-btn icon large @click="dialog = false" color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-carousel hide-delimiter-background show-arrows-on-hover height="480">
        <v-carousel-item v-for="tut in allTut" :key="tut.step">
          <v-sheet
            style="border-radius: 0px"
            :color="tut.backgroundColor"
            height="100%"
          >
            <v-row class="ma-0" style="width: 600px">
              <v-col>
                <p class="text-h5 ml-3 mb-0">{{ tut.step }}</p>
                <p class="text-h4 ml-3">{{ tut.title }}</p>
                <v-img max-height="280" contain eager :src="tut.path"></v-img>
                <p class="text-h6 ml-3 mb-1 mt-4 text-center">
                  {{ tut.description }}
                </p>
              </v-col>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>
</template>

<script>
import genColor from 'color-generator';
import { mapMutations, mapGetters } from 'vuex';

export default {
  mounted() {
    if (!localStorage.visited) {
      localStorage.visited = true;
      this.setTutorialPopup(true);
    }
  },
  data() {
    return {
      allTut: [
        {
          step: 'We have an exciting announcement:',
          title: 'Our data has been updated!',
          path: require('../../assets/updated-courses.png'),
          description: 'Courses for 2023F-2024W is here!',
          backgroundColor: genColor(0.7, 0.85).hexString(),
        },
        {
          step: 'Step 1',
          title: 'Select some courses',
          path: require('../../assets/tut1.gif'),
          description:
            'Just click on a course and we will generate a timetable',
          backgroundColor: genColor(0.7, 0.85).hexString(),
        },
        {
          step: 'Step 2',
          title: 'Adjust your times',
          path: require('../../assets/tut2.gif'),
          description:
            'Click on the pencil icon or the course to adjust the times',
          backgroundColor: genColor(0.7, 0.85).hexString(),
        },
        {
          step: 'Step 3',
          title: 'Select and lock',
          path: require('../../assets/tut3.gif'),
          description:
            "Block rows and columns and we won't schedule those times",
          backgroundColor: genColor(0.7, 0.85).hexString(),
        },
        {
          step: 'Step 4',
          title: 'Switch between semesters',
          path: require('../../assets/tut4.gif'),
          description:
            'Click on the top right to switch between fall and winter',
          backgroundColor: genColor(0.7, 0.85).hexString(),
        },
        {
          step: 'Step 5',
          title: 'Export timetables',
          path: require('../../assets/tut5.gif'),
          description: 'Export your timetables as png',
          backgroundColor: genColor(0.7, 0.85).hexString(),
        },
        {
          step: 'Step 6',
          title: 'Lock Courses',
          path: require('../../assets/tut6.gif'),
          description: "Lock your courses in place and we won't move it",
          backgroundColor: genColor(0.7, 0.85).hexString(),
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['getTutorialPopup']),
    dialog: {
      get() {
        return !this.$isMobile() && this.getTutorialPopup;
      },
      set(value) {
        this.setTutorialPopup(value);
      },
    },
  },
  methods: {
    ...mapMutations(['setTutorialPopup']),
  },
};
</script>
