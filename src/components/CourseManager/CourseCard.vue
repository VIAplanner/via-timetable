<template>
  <v-card class="mx-auto course-card">
    <v-list-item>
      <v-row align="center" justify="space-between" style="margin: auto">
        <div class="text-h5 text--primary">
          {{ courseCode }}
        </div>
        <div class="text-h5 text--primary">{{ name }}</div>
        <div align="center" justify="end" style="width: max-content">
          <v-icon class="mr-1"> mdi-download </v-icon>
          <v-icon class="mr-1"> mdi-square-edit-outline </v-icon>
          <v-icon class="mr-1"> mdi-delete </v-icon>
          <v-icon class="mr-1"> mdi-chevron-right </v-icon>
        </div>
      </v-row>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    name: String,
    courseCode: String,
  },
};
</script>

<style scoped>
.course-card {
    margin-bottom: 16px;
}
</style>