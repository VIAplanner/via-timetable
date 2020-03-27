<template>
  <v-container fluid class="settings-container">
	<p class="header-style">
		Optimzation Settings
	</p>
    <v-row>
      <v-col>
        <v-radio-group v-model="selectedIdleOption" :mandatory="false">
          <v-radio v-for="message in idleOptions" :key="message" :label="message" :value="message" color="#3F5D79"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-checkbox
        class="checkbox-style"
        v-for="weekday in weekdays"
        :key="weekday"
        v-model="selected"
        :label="weekday"
        :value="weekday"
		color="#3F5D79"
      ></v-checkbox>
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

<style scoped>

	.settings-container {
		margin: 0px;
		width: 550px;
		background: #ededed;
		border-radius: 25px;
	}

	.checkbox-style {
		margin-left: 10px;
	}

	.header-style {
		font-size: 25px;
		color: #3F5D79;
	}

</style>