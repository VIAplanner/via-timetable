<template>
	<div class="filter shadow-md shadow-shadow flex flex-row items-center w-full bg-timetablecell mb-2 rounded-md">
		<div class="rounded-l-md w-1 h-10 mr-2 shrink-0" :style="{
			backgroundColor: course.color,
		}" />
		<div class="flex flex-row items-center justify-between w-full">
			<h2>{{ course.courseData.code }}</h2>
			<div class="flex flex-row">
				<Button @click="editSection()" icon="pi pi-pen-to-square" text rounded iconClass="text-text-primary" />
				<Button @click="deleteCourse()" iconClass="text-text-primary" icon="pi pi-trash" text rounded />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable';

const store = useTimetableStore() as any;

const props = defineProps({
	course: {
		type: Object,
		required: true
	}
});

/**
 * @brief Opens the details card of the course given by props
 */
function editSection() {
	store.setDetailCardVisibility(`${props.course.courseData.code} ${props.course.courseData.sectionCode}`, true);
}

/**
 * @brief Deletes the course given by props from the timetable
 */
function deleteCourse() {
	store.removeCourse(props.course.courseData.code);
	store.saveStateHistory();
}
</script>