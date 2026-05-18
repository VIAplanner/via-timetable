<template>
	<div class="scroll-area">
		<SelectedCourseCard v-for="(course, code) in store.selectedCourses[store.selectedSession]"
			:key="code" :course="course" />
	</div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable';
import SelectedCourseCard from './SelectedCourseCard.vue';

const store = useTimetableStore() as any;
</script>

<style scoped>
.scroll-area {
	position: relative;
	margin: auto;
	height: 500px;
}
</style>
