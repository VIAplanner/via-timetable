<template>
  <v-row class="main">
    <v-col>
      <v-sheet :height="managerHeight">
        <h1>
          {{ $route.params.id }}
          <v-btn icon>
            <v-icon class="mr-1"> mdi-download </v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon class="mr-1"> mdi-square-edit-outline </v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon class="mr-1"> mdi-delete </v-icon>
          </v-btn>
        </h1>
        <router-link class="redirect" to="/manager">
          <v-btn elevation="2" style="margin: 24px 0">Return to Manager</v-btn>
        </router-link>
        <v-btn elevation="2" style="margin: 24px" @click="onPickFile"
          >Import Syllabus</v-btn
        >
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="application/pdf"
          @change="onFilePicked"
        />
        <div>
          <v-expansion-panels focusable>
            <assessment-item
              :assessment="item"
              :index="i"
              v-for="(item, i) in $store.state.semesterStatus === 'F' ? $store.state.fallSelectedCourses[$route.params.id].assessments : $store.state.winterSelectedCourses[$route.params.id].assessments" 
              :key="i"
            />
          </v-expansion-panels>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import AssessmentItem from '../components/CourseManager/AssessmentItem.vue';

export default {
  components: {
    AssessmentItem,
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  data() {
    return {
      height: window.innerHeight,
      file: null,
    };
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight;
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      // TODO: For improvement, we can display picked PDF file for user to confirm!
      const { files } = event.target;
      if (!files[0]) {
        return
      }
      const filename = files[0].name;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.fileUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.file = files[0];
      if (window.confirm(`Do you want to use this syllabus: ${filename}?`)) {
        const formData = new FormData();
        formData.append('syllabus', this.file);
        this.$store.dispatch(
          'importAssessmentFromParser',
          { courseCode: this.$route.params.id, file: formData },
        );
      } else {
        this.file = null;
      }
    },
  },
  computed: {
    managerHeight() {
      return this.height - 104; // TODO: We may need to add documentation for computed height - why we choose such numbers
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  margin: 56px;
}
.redirect {
  text-decoration: none;
}
</style>