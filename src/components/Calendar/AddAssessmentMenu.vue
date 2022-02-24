<template>
  <div>
    <v-btn
      outlined
      class="mr-4"
      color="blue"
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
                  v-model="assessmentName"
                  label="Name"
                  hint="The name of this assessment"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="assessmentCourse"
                  label="Course"
                  hint="The course that this assessment is for"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="assessmentDetails"
                  label="Details"
                  hint="Details for this assessment"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <vc-date-picker mode="dateTime" v-model="assessmentDate" >
                  <template v-slot="{ inputValue, inputEvents }">
                    <v-text-field
                      :value="inputValue" 
                      v-on="inputEvents"
                      label="Due date"
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

export default {
  data() {
    return {
      dialog: false,
      assessmentName: null,
      assessmentCourse: null,
      assessmentDetails: null,
      assessmentDate: null,
    }
  },
  methods: {
    ...mapMutations(['createCalendarEvent']),
    saveAssessment() {
      this.createCalendarEvent({
        eventName: this.assessmentName,
        eventCourse: this.assessmentCourse,
        eventDetails: this.assessmentDetails,
        eventDate: this.assessmentDate,
      })
      this.dialog = false
      this.assessmentName = null
      this.assessmentCourse = null
      this.assessmentDetails = null
      this.assessmentDate = null
    },
  }
}
</script>
