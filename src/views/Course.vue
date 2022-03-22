<template>
  <v-row class="main">
    <v-col>
      <v-sheet :height="managerHeight">
        <h1>
          {{ $route.params.id }}
          <v-btn icon>
            <v-icon class="mr-1" @click="onPickExport"> mdi-download </v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon class="mr-1" @click="onPickJsonFile"> mdi-square-edit-outline </v-icon>
          </v-btn>
          <input
            type="file"
            style="display: none"
            ref="jsonFileInput"
            accept="application/json"
            @change="onJsonPicked"
          />
          <v-btn icon>
            <v-icon class="mr-1"> mdi-delete </v-icon>
          </v-btn>
        </h1>
        <v-row style="margin: 24px 0">
          <router-link class="redirect" to="/manager">
            <v-btn elevation="2" class="mr-4">Return to Manager</v-btn>
          </router-link>
          <add-assessment-menu />
          <v-btn elevation="2" @click="onPickFile"
            >Import Syllabus</v-btn
          >
        </v-row>
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="application/pdf"
          @change="onFilePicked"
        />
        <div>
          <v-expansion-panels focusable v-if="this.courseAssessments">
            <assessment-item
              v-for="(item, i) in this.courseAssessments" 
              :key="i"
              :assessment="item"
              :index="i"
            />
          </v-expansion-panels>
          <p v-else>No assessment available for this course. Add your assessment manually or import it from your syllabus/template!</p>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import AddAssessmentMenu from '../components/AddAssessment/AddAssessmentMenu.vue';
import AssessmentItem from '../components/CourseManager/AssessmentItem.vue';

export default {
  components: {
    AddAssessmentMenu,
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
    async onFilePicked(event) {
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
        await this.$store.dispatch(
          'importAssessmentFromParser',
          { courseCode: this.$route.params.id, file: formData },
        );
        window.location.reload();
      } else {
        this.file = null;
      }
    },
    onPickJsonFile() {
      this.$refs.jsonFileInput.click();
    },
    onPickExport() {
      const data = `{"assessments":${JSON.stringify(this.$store.state.fallSelectedCourses[this.$route.params.id].assessments)}}`
      const blob = new Blob([data], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = `${this.$route.params.id}.json`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    onJsonPicked(event) {
      this.file = event.target.files[0];
      if (window.confirm(`Do you want to use this JSON: ${this.file.name}?`)) {
        const reader = new FileReader();
        reader.readAsText(this.file);
        reader.onload = ((evt) => {
          const { result } = evt.target
          try {
            const content = JSON.parse(result);
            this.$store.state.fallSelectedCourses[this.$route.params.id].assessments = content.assessments;
            this.$router.go();
          } 
          catch (error) {
            console.log(`Caught invalid JSON: ${this.file.name}`);
          }
        })
      } 
      else {
          this.file = null;
      }
    },
  },
  computed: {
    ...mapGetters(['fallSelectedCourses', 'winterSelectedCourses', 'getSemesterStatus']),
    courseAssessments() {
      if (this.getSemesterStatus === 'F') {
        return this.fallSelectedCourses[this.$route.params.id].assessments
      } else {
        return this.winterSelectedCourses[this.$route.params.id].assessments
      }
    },
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