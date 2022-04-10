<template>
  <div>
    <v-dialog v-bind:value="dialog" max-width="600px" @click:outside="$emit('closeDialog')">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ mode }} Assessment</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="isValidInput">
                <v-text-field
                  v-bind:value="type"
                  @input="$emit('update:type', $event)"
                  label="Type*"
                  hint="The type of this assessment"
                  required
                  :rules="typeRule"
                ></v-text-field>
                <v-text-field
                  v-bind:value="description"
                  @input="$emit('update:description', $event)"
                  label="Description"
                  hint="The description of this assessment"
                ></v-text-field>
                <v-text-field
                  v-bind:value="weight"
                  @input="$emit('update:weight', $event)"
                  label="Weight*"
                  hint="The weight of this assessment"
                  :rules="weightRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-bind:value="grade"
                  :rules="gradeRule"
                  @input="$emit('update:grade', $event)"
                  label="Grade"
                  hint="Your grade for this assessment. Leave blank if you don't have a grade yet.'"
                ></v-text-field>
                <vc-date-picker
                  mode="dateTime"
                  v-bind:value="deadline ? deadline.length <= 10 ? new Date(deadline).getTime() + new Date(deadline).getTimezoneOffset() * 60 * 1000 : deadline : null"
                  @input="$emit('update:deadline', $event ? $event.toISOString() : null)"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <v-text-field
                      :value="inputValue"
                      v-on="inputEvents"
                      label="Deadline"
                    ></v-text-field>
                  </template>
                </vc-date-picker>
              </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text v-on:click="$emit('closeDialog')">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAssessment" :disabled="!isValidInput">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  props: {
    mode: String,
    dialog: Boolean,
    index: Number,
    type: null || String,
    description: null || String,
    weight: null || String,
    grade: null || String,
    deadline: null || String,
    on_going: Boolean,
    subtasks: Array,
  },
  data() {
    return {
      isValidInput: true,
      typeRule: [t => !!t || 'Assessment type is required'],
      weightRules: [ 
          w => !!w || 'Weight is required', 
          w => /^\d{1,3}%$/.test(w) || 'Must be in format X%',
      ],
      gradeRule: [g => (!g || /^\d{1,3}%$/.test(g)) || 'Must be in format X%'],
    }
  },
  methods: {
    ...mapActions(['addAssessment']),
    ...mapMutations(['editAssessment']),
    saveAssessment() {
      const assessment = {
        type: this.$props.type,
        description: this.$props.description,
        weight: this.$props.weight,
        grade: this.$props.grade,
        deadline: this.$props.deadline,
        on_going: this.$props.on_going,
        subtasks: this.$props.subtasks,
      };
      if (this.$props.mode === 'New') {
        this.addAssessment({
          courseCode: this.$route.params.id,
          assessment,
        });
      } else {
        this.editAssessment({
          index: this.$props.index,
          courseCode: this.$route.params.id,
          assessment,
        });
      }
      window.location.reload();
      this.$emit('closeDialog');
    },
  },
};
</script>
