<template>
  <div>
    <Timetable/>
  </div>
</template>

<script>
import Timetable from "./components/Timetable";

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

.background {
  background-color: #E5E5E5;
}
</style>