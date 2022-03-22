<template>
  <div>
    <v-btn
      class="mr-4"
      @click="dialog = true"
    >
      Add Assessment
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">New Assessment</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  label="Name"
                  hint="The name of this assessment"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="weight"
                  label="Weight"
                  hint="The weight of this assessment"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="grade"
                  label="Grade"
                  hint="Your grade for this assessment. Leave blank if you don't have a grade yet.'"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <vc-date-picker mode="dateTime" v-model="assessmentDate" >
                  <template v-slot="{ inputValue, inputEvents }">
                    <v-text-field
                      :value="inputValue" 
                      v-on="inputEvents"
                      label="Deadline"
                    ></v-text-field>
                  </template>
                </vc-date-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog=false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveAssessment()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { mapMutations } from 'vuex'

const defaultStatus = {
  dialog: false,
  name: null,
  weight: null,
  grade: null,
  assessmentDate: null,
}

export default {
  data() {
    return {
      ...defaultStatus
    }
  },
  methods: {
    ...mapMutations(['createCalendarEvent']),
    saveAssessment() {
      this.createCalendarEvent({
        eventName: this.name,
        eventCourse: this.weight,
        eventDetails: this.grade,
        eventDate: this.assessmentDate,
      })
      Object.assign(this.$data, defaultStatus)
    },
  }
}
</script>
