<template>
  <v-card class="mx-auto course-card">
    <v-list-item>
      <v-row align="center" justify="space-between" style="margin: auto">
        <div class="text-h5 text--primary">
          {{ courseCode }}
        </div>
        <div class="text-h5 text--primary">{{ name }}</div>
        <div align="center" justify="end" style="width: max-content">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon @click="onPickExport" v-bind="attrs" v-on="on">
                <v-icon class="mr-1"> mdi-download </v-icon>
              </v-btn>
            </template>
            <span>Export course assessment as JSON template</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click="deleteCourse({ code: courseCode })"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="mr-1"> mdi-delete </v-icon>
              </v-btn>
            </template>
            <span>Delete this course</span>
          </v-tooltip>
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
    onPickJsonFile() {
      this.$refs.jsonFileInput.click();
    },
    onPickExport() {
      let data = [];
      if (this.courseCode.slice(-1) === 'F') {
        data = `{"assessments":${JSON.stringify(
          this.$store.state.fallSelectedCourses[this.courseCode].assessments,
        )}}`;
      } else {
        data = `{"assessments":${JSON.stringify(
          this.$store.state.winterSelectedCourses[this.courseCode].assessments,
        )}}`;
      }
      const blob = new Blob([data], { type: 'text/plain' });
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = `${this.courseCode}.json`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      );
      a.dispatchEvent(e);
    },
  },
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