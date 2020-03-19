<template>
  <Timetable/>
</template>

<script>
import Timetable from "./components/Timetable";

//import TimetableEvent from "./components/TimetableEvent";

export default {
  name: "App",
  components: {
    Timetable
  }
}
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");

body {
  font-family: "Montserrat", sans-serif;
}
</style>