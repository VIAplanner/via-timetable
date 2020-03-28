<template>
	<v-container fluid class="settings-container">
		<p class="header-style radiobutton-style">
			Optimzation Settings
		</p>
		<v-row>
		<v-col>
			<v-radio-group v-model="selectedIdleOption" :mandatory="false" class="radiobutton-style" style="margin-left: 10px;">
				<v-radio v-for="message in idleOptions" :key="message" :label="message" :value="message" color="#3F5D79" class="radiobutton-style"></v-radio>
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
		border: 4px solid #3F5D79;
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
		color: #3F5D79;
	}

</style>