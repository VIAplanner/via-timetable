<template>
  <div style="background: #E5E5E5;">
    <v-container>
      <Timetable />
      <TimetableCourseCard v-for="(info, course) in courseCards" :key="course" 
      :codeAndName="info.codeAndName" :color="info.color" :meetingSections="info.meetingSections" /> 
    </v-container>
  </div>
</template>
 
<script>
import Timetable from "./components/Timetable";
import TimetableCourseCard from"./components/TimetableCourseCard.vue";

export default {
  name: "App",
  components: {
    Timetable,
    TimetableCourseCard
  },
  data() {  
    return {
      courseCards: {
        CSC258H5S: {
          codeAndName: "CSC258H5S Computer Organizaion",
          color: "#FBB347",
          meetingSections: [
            {
              courseCode: "CSC258H5S",
              instructorName: "Andrew Petersen",
              day: "Monday",
              section: "L0101",
              start: 32400,
              end: 39600,
              location: "IB 345"
            },
            {
              courseCode: "CSC258H5S",
              section: "P0109",
              instructorName: "TBA",
              day: "Wednesday",
              start: 61200,
              end: 64800,
              location: "DH 2026"
            }
          ]
        }
      }
    }
  },
  methods: {
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");

body {
  font-family: "Montserrat", sans-serif;
}
</style>