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
        <input
          type="file"
          style="display: none"
          ref="jsonFileInput"
          accept="application/json"
          @change="onJsonPicked"
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
    onPickJsonFile() {
      this.$refs.jsonFileInput.click();
    },
    onPickExport() {
      const data = "{\"assessments\":".concat(JSON.stringify(this.$store.state.fallSelectedCourses[this.$route.params.id].assessments)).concat("}");
      const blob = new Blob([data], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = this.$route.params.id.concat(".json");
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    onFilePicked(event) {
      const { files } = event.target;
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
    managerHeight() {
      return this.height - 104;
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