<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col>
            <course-search-bar />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import CourseSearchBar from "./components/CourseSearchBar";

export default {
  name: "App",

  components: {
    CourseSearchBar
  },

  data: () => ({
    //
  })
};
</script>
