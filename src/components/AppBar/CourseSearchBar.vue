<template>
	<div class="w-3 md:w-4">
		<AutoComplete ref="searchBarComponent" @complete="populateRecommendations()" @focus="onFocus()"
			@blur="isActive = false" @option-select="courseSearched()" optionLabel="formattedName"
			v-model="currentQuery" :suggestions="allCourses" loader="pi pi-spinner" :loading="loading"
			:placeholder="!loading ? (isSmallDevice ? 'Search...' : 'Search courses...') : ('Loading...')" :inputStyle="{
				'background-color': dynamicColor,
				'border': 'none',
				'border-radius': '16px',
				'color': dynamicTextColor
			}" :pt="{
				panel: {
					style: isSmallDevice
						? { width: 'calc(100vw - 1rem)', maxWidth: 'calc(100vw - 1rem)' }
						: { maxWidth: '42rem' }
				},
				option: {
					style: {
						whiteSpace: 'normal',
						overflowWrap: 'anywhere',
						wordBreak: 'break-word'
					}
				}
			}" @minLength="5" fluid />
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import axios from 'axios';
import { useTimetableStore } from '../../store/timetable';
import { useWindowSize } from '../../composables/useWindowSize';

/** Represents a single course for the purposes of displaying in the search bar, so it encodes only essential data */
interface Course {
	code: string;
	sectionCode: string;
	name: string;
	sessions: string[];
	formattedName?: string;
}

const store = useTimetableStore() as any;
const { isSmallDevice } = useWindowSize();

const searchBarComponent = ref<{ overlayVisible: boolean } | null>(null);
const allCourses: Ref<Course[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const isActive: Ref<boolean> = ref(false);
const currentQuery: Ref<Course | string | null> = ref(null);


const dynamicTextColor = computed(() => {
	return store.darkMode ? '#ffffff' : '#222222';
})

const dynamicColor = computed(() => {
	if (isActive.value || currentQuery.value) return store.darkMode ? '#18181b' : '#ffffff';
	return store.darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(179, 179, 179, 0.3)';
})

function parseSessionEmoji(sessions: Array<string>) {
	return sessions.map(session => {
		if (session.length < 5) return '';

		const month = session.substring(4, 5);

		return session.length === 6 ? '☀️' : (month === '9' ? '🍁' : month === '5' ? '☀️' : '❄️');
	}).join('');
}

async function populateRecommendations() {
	if (!currentQuery.value) return;
	const query = typeof currentQuery.value === 'string' ? currentQuery.value : currentQuery.value.code;
	const queryTrimmed = query.trim();
	if (!queryTrimmed || queryTrimmed.length < 3) return;

	try {
		loading.value = true;

		const coursesDataResult = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/${queryTrimmed}`, {
			params: {
				page: 1,
				limit: 5,
				sessions: [...store.selectedSubsessions].join(','),
				divisions: [...store.selectedDivisions].join(',')
			}
		});

		const courses: Array<Course> = Array.from(coursesDataResult.data.courses as Array<Course>);

		allCourses.value = courses.map((course: Course) => {
			course.formattedName = `${parseSessionEmoji(course.sessions)}  ${course.code} ${course.sectionCode} - ${course.name}`;
			return course;
		});

		store.searchBarSuggestions = courses.map((course: Course) => `${course.code} ${course.sectionCode}`);

		store.removeUnusedCards();

		loading.value = false;
	} catch (error: any) {
		loading.value = false;
		console.error(`Error fetching data for ${query}: ${error.message}`);
	}
}

async function courseSearched() {
	const searchValue = currentQuery.value;
	if (!searchValue || typeof searchValue === 'string') return;

	currentQuery.value = '' // Clear search bar

	store.removeUnusedCards(); // Remove any leftover cards from before

	const divisionalLegends = await store.getDivisionalLegends();
	const divisionalEnrolmentIndicators = await store.getDivisionalEnrolmentIndicators();

	if (divisionalLegends && divisionalEnrolmentIndicators) {
		store.registerDetailCard(searchValue.code, searchValue.sectionCode, {
			courseData: searchValue,
			divisionalData: {
				divisionalLegends,
				divisionalEnrolmentIndicators
			}
		});
		store.setDetailCardVisibility(`${searchValue.code} ${searchValue.sectionCode}`, true);
	} else {
		// Show detail card without any divisional data (the property is optional)
		store.registerDetailCard(searchValue.code, searchValue.sectionCode, {
			courseData: searchValue
		});
		store.setDetailCardVisibility(`${searchValue.code} ${searchValue.sectionCode}`, true);
	}
}

function onFocus() {
	isActive.value = true;
	if (
		allCourses.value.length > 0 &&
		currentQuery.value &&
		typeof currentQuery.value === 'string' &&
		currentQuery.value.length >= 3 &&
		searchBarComponent.value
	) {
		searchBarComponent.value.overlayVisible = true;
	}
}
</script>
