<template>
  <v-card class="mx-auto course-card">
    <v-list-item>
      <v-row align="center" justify="space-between" style="margin: auto">
        <div class="text-h5 text--primary">
          {{ courseCode }}
        </div>
        <div class="text-h5 text--primary">{{ name }}</div>
        <div align="center" justify="end" style="width: max-content">
           <v-btn
            icon
          >
            <v-icon class="mr-1"> mdi-download </v-icon>
          </v-btn>
          <v-btn
            icon
          >
            <v-icon class="mr-1"> mdi-square-edit-outline </v-icon>
          </v-btn>
          <v-btn
            icon
            @click="deleteCourse({ code: courseCode })"
          >
            <v-icon class="mr-1"> mdi-delete </v-icon>
          </v-btn>
          <router-link class="redirect-icon" :to="'manager/' + courseCode">
            <v-icon class="mr-1"> mdi-chevron-right </v-icon>
          </router-link>
        </div>
      </v-row>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    name: String,
    courseCode: String,
  },
  methods: {
    ...mapActions(['deleteCourse']),
  }
};
</script>

<style scoped>
.course-card {
  margin-bottom: 16px;
}
.redirect-icon {
  text-decoration: none;
}
</style>