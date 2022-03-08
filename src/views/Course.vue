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
            <v-expansion-panel v-for="(item, i) in assessments" :key="i">
              <v-expansion-panel-header>
                <template>
                  <v-row no-gutters>
                    <v-col cols="1" class="assessment-item">
                      {{ item.grade ? item.grade : 'N/A' }}
                    </v-col>
                    <v-col cols="7" class="assessment-item">
                      {{ item.type }}: {{ item.description }}
                    </v-col>
                    <v-col cols="1" class="text--secondary assessment-item">
                      <v-fade-transition leave-absolute>
                        <span>
                          {{ item.weight }}
                        </span>
                      </v-fade-transition>
                    </v-col>
                    <v-col cols="2" class="text--secondary assessment-item">
                      <v-fade-transition leave-absolute>
                        <span>
                          {{
                            item.deadline
                              ? item.deadline
                              : item.on_going
                              ? 'On-going'
                              : 'TBD'
                          }}
                        </span>
                      </v-fade-transition>
                    </v-col>
                    <v-col cols="1">
                      <v-fade-transition leave-absolute>
                        <span>
                          <v-btn icon>
                            <v-icon class="mr-1">
                              mdi-square-edit-outline
                            </v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon class="mr-1"> mdi-delete </v-icon>
                          </v-btn>
                        </span>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- TODO: Subtasks -->
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';

export default {
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  data() {
    return {
      height: window.innerHeight,
      file: null,
      assessments: []
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
        axios
          .post(
            `${process.env.VUE_APP_API_BASE_URL}/manager/parser`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          .then((res) => {
            for (const data of res.data) {
              this.assessments.push({...data, grade: null})
            }
          })
          .catch((err) => {
            this.file = null;
            console.error(err.message);
          });
      } else {
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
.assessment-item {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>