<template>
	<div id="app">
		<router-view />
		<CourseDetailCardsLayer />
		<Toast />
	</div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useTimetableStore } from './store/timetable';
import CourseDetailCardsLayer from './components/CourseDetails/CourseDetailCardsLayer.vue';
import { useToast } from 'primevue/usetoast';

const store = useTimetableStore();
const toast = useToast();

onMounted(() => {
	store.initializeToast(toast);
	store.initializeHistory();
	store.updatePreferences();
	initializeSessionGroup();
	applyDarkMode();
	generateCourseCards();
	loadCoursesToBuilder();
	store.loadBlockedTimesToBuilder();
});

/**
 * @brief In the event the selected session group is not set, initialize it to the latest group
 */
async function initializeSessionGroup() {
	const sessionGroups = await store.getSessions();
	if (!store.selectedSessionGroup || !sessionGroups.some(
		sessionGroup => sessionGroup.group === store.selectedSessionGroup
	)) {
		const newSessionGroup = sessionGroups[sessionGroups.length - 1]
		store.selectedSessionGroup = newSessionGroup.group;

		store.selectedSubsessions = newSessionGroup.subsessions.map(subsession => subsession.value);
	}
}

/**
 * @brief Applies/removes dark mode styling depending if dark mode is active
 */
function applyDarkMode() {
	if (store.darkMode) document.documentElement.classList.add('dark');
	else document.documentElement.classList.remove('dark');
}

/**
 * @brief Creates course cards for all selected courses
 */
async function generateCourseCards() {
	const divisionalLegends = await store.getDivisionalLegends();
	const divisionalEnrolmentIndicators = await store.getDivisionalEnrolmentIndicators();

	for (const semester of Object.keys(store.selectedCourses)) {
		for (const course of Object.keys(store.selectedCourses[semester])) {
			store.registerDetailCard(course, store.selectedCourses[semester][course].courseData.sectionCode, {
				courseData: store.selectedCourses[semester][course].courseData,
				divisionalData: {
					divisionalLegends,
					divisionalEnrolmentIndicators
				}
			});
		}
	}
}

/**
 * @brief Loads all selected courses to the builder API so that timetables can be built using them
 */
async function loadCoursesToBuilder() {
	for (const session of Object.values(store.selectedCourses)) {
		for (const course of Object.values(session)) {
			store.addCourseToBuilder(course["courseData"]);
		}
	}
}

watch(() => [store.maxGap, store.maxDayLength, store.minDayLength, store.maxHours, store.prefferedStart,
store.prefferedMaxEnd, store.onlinePreference, store.avoidRushHour],
	() => store.updatePreferences()
);

watch(() => [store.currentlyBuildingTimetable], () => {
	if (store.currentlyBuildingTimetable)
		toast.add({
			severity: 'info',
			summary: 'Building started',
			detail: '',
			life: 2000
		})
	else
		toast.add({
			severity: 'success',
			summary: 'Building completed',
			detail: '',
			life: 2000
		})
});
</script>

<style lang='scss'>
#app {
	max-width: 100%;
	overflow: hidden;
}
</style>
