<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-checkbox
          v-for="weekday in weekdays"
          :key="weekday"
          v-model="selected"
          :label="weekday"
          :value="weekday"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group v-model="selectedIdleOption" :mandatory="false">
          <v-radio v-for="message in idleOptions" :key="message" :label="message" :value="message"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "optimization-settings",
  data() {
    return {
      selectedDays: [],
      weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      idleOptions: ["Maximize Idle Time", "Minimize Idle Time"],
      selectedIdleOption: ''
    };
  }
};
</script>

<style scoped>
</style>