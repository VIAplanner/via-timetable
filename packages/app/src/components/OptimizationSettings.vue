<template>
  <v-container fluid class="settings-container">
    <v-row>
      <v-col class="pb-0">
        <p class="header-style radiobutton-style">Optimzation Settings</p>
      </v-col>
    </v-row>

    <v-row class="pl-2">
      <v-radio-group
        hide-details
        v-model="selectedIdleOption"
        :mandatory="false"
        class="radiobutton-style"
      >
        <v-col class="pb-0 pt-0">
          <v-radio
            v-for="message in idleOptions"
            :key="message"
            :label="message"
            :value="message"
            color="#3F5D79"
          ></v-radio>
        </v-col>
      </v-radio-group>
    </v-row>

    <v-row class="pl-2">
      <v-col>
        <v-checkbox
          v-for="weekday in weekdays"
          :key="weekday"
          hide-details
          v-model="selected"
          :label="weekday"
          :value="weekday"
          color="#3F5D79"
        ></v-checkbox>
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
      selectedIdleOption: ""
    };
  }
};
</script>

<style>
.settings-container {
  margin: 0px;
  width: 550px;
  background: #ededed;
  border: 4px solid #3f5d79;
  border-radius: 25px;
}

.checkbox-style {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 10px;
}

.radiobutton-style {
  margin-top: 0px;
  margin-bottom: 0px;
}

.header-style {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 10px;
  font-size: 25px;
  color: #3f5d79 !important;
}

label {
  margin-bottom: 0px !important;
}

.v-input--selection-controls {
  margin-top: 0px !important;
}
</style>