<template>
  <v-row class="main">
    <v-col>
      <v-sheet>
        <v-row align="center" justify="space-between" style="padding: 0 16px">
          <h1>
            {{ $route.params.id }}
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon @click="onPickJsonFile" v-bind="attrs" v-on="on">
                  <v-icon class="mr-1"> mdi-upload </v-icon>
                </v-btn>
              </template>
              <span>Import course assessment with JSON template</span>
            </v-tooltip>
            <input
              type="file"
              style="display: none"
              ref="jsonFileInput"
              accept="application/json"
              @change="onJsonPicked"
            />
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
                  @click="handleDeleteCourse"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="mr-1"> mdi-delete </v-icon>
                </v-btn>
              </template>
              <span>Delete this course</span>
            </v-tooltip>
          </h1>
          <div focusable v-if="this.courseAssessments">
            <h2>Current Grade: {{ courseGrade }}</h2>
          </div>
        </v-row>
        <v-row style="margin: 24px 0">
          <router-link class="redirect" to="/manager">
            <v-btn elevation="2" class="mr-4">Return to Manager</v-btn>
          </router-link>
          <add-assessment-menu />
          <v-tooltip bottom color="warning">
            <template v-slot:activator="{ on, attrs }">
              <v-btn elevation="2" @click="onPickFile" v-bind="attrs" v-on="on"
                >Import Syllabus</v-btn
              >
            </template>
            <span
              >Warning: Syllabus must follow MCS Standard to be parsed
              properly</span
            >
          </v-tooltip>
        </v-row>
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="application/pdf"
          @change="onFilePicked"
        />
        <div>
          <v-expansion-panels
            focusable
            v-if="this.courseAssessments && this.courseAssessments.length > 0"
          >
            <assessment-item
              v-for="(item, i) in this.courseAssessments"
              :key="i"
              :assessment="item"
              :index="i"
            />
          </v-expansion-panels>
          <p v-else>
            No assessment available for this course. Add your assessment
            manually or import it from your syllabus/template!
          </p>
        </div>
        <br />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AddAssessmentMenu from '../components/FloatingBtns/AddAssessmentBtn.vue';
import AssessmentItem from '../components/CourseManager/AssessmentItem.vue';

export default {
  components: {
    AddAssessmentMenu,
    AssessmentItem,
  },
  data() {
    return {
      file: null,
    };
  },
  methods: {
    ...mapActions(['deleteCourse', 'importAssessmentFromParser']),
    handleDeleteCourse() {
      if (
        window.confirm(
          `Do you want to delete this course: ${this.$route.params.id}?`,
        )
      ) {
        this.deleteCourse({ code: this.$route.params.id });
        window.location.replace('/manager');
      }
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    async onFilePicked(event) {
      // TODO: For improvement, we can display picked PDF file for user to confirm!
      const { files } = event.target;
      if (!files[0]) {
        return;
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
        try {
          await this.importAssessmentFromParser({
          courseCode: this.$route.params.id,
          file: formData,
          });
          window.location.reload();
        } catch (e) {
          this.$toast.error(`Error when import syllabus file ${this.file.name}: ${e.response.data.message}`);
          this.file = null;
          this.$refs.fileInput.value = "";
        }
      }
      else {
        this.file = null;
        this.$refs.fileInput.value = "";
      }
    },
    onPickExport() {
      let data = [];
      if (this.$route.params.id.slice(-1) === 'F') {
        data = `{"assessments":${JSON.stringify(
          this.fallSelectedCourses[this.$route.params.id]
            .assessments,
        )}}`;
      } else {
        data = `{"assessments":${JSON.stringify(
          this.winterSelectedCourses[this.$route.params.id]
            .assessments,
        )}}`;
      }
      const blob = new Blob([data], { type: 'text/plain' });
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = `${this.$route.params.id}.json`;
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
    onPickJsonFile() {
      this.$refs.jsonFileInput.click();
    },
    onJsonPicked(event) {
      this.file = event.target.files[0];
      if (window.confirm(`Do you want to use this JSON: ${this.file.name}?`)) {
        const reader = new FileReader();
        reader.readAsText(this.file);
        reader.onload = (evt) => {
          const { result } = evt.target;
          try {
            const content = JSON.parse(result);
            if (this.$route.params.id.slice(-1) === 'F') {
              this.$store.state.fallSelectedCourses[
                this.$route.params.id
              ].assessments = content.assessments;
            } else if (this.$route.params.id.slice(-1) === 'S') {
              this.$store.state.winterSelectedCourses[
                this.$route.params.id
              ].assessments = content.assessments;
            } else {
              // Must be Y
              this.$store.state.fallSelectedCourses[
                this.$route.params.id
              ].assessments = content.assessments;
              this.$store.state.winterSelectedCourses[
                this.$route.params.id
              ].assessments = content.assessments;
            }
            window.location.reload();
          } catch (e) {
            this.fileError = "ERROR";
            console.log(e);
            this.$toast.error(`${this.file.name} could not be uploaded.`);
            this.$refs.jsonFileInput.value = "";
          }
        };
      } else {
        this.file = null;
        this.$refs.jsonFileInput.value = "";
      }
    },
  },
  computed: {
    ...mapGetters([
      'fallSelectedCourses',
      'winterSelectedCourses',
      'getSemesterStatus',
    ]),
    courseAssessments() {
      if (this.getSemesterStatus === 'F') {
        return this.fallSelectedCourses[this.$route.params.id].assessments;
      } else {
        return this.winterSelectedCourses[this.$route.params.id].assessments;
      }
    },
    courseGrade() {
      let grade = 0;
      let weight = 0;
      if (this.courseAssessments.length === 0) {
        return 0;
      }
      for (const assessment of this.courseAssessments) {
        if (
          assessment.grade !== null &&
          Number(assessment.grade.split('%')[0]) >= 0 &&
          Number(assessment.weight.split('%')[0]) >= 0
        ) {
          grade +=
            Number(assessment.grade.split('%')[0]) *
            Number(assessment.weight.split('%')[0]);
          weight += Number(assessment.weight.split('%')[0]);
        }
      }

      return weight === 0 ? 0 : (grade / weight).toFixed(2);
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