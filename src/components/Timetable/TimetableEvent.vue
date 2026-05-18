<template>
	<div class="noScrollbar w-full overflow-y-auto" :style="{
		'height': duration * oneHourHeight
	}">
		<!-- Non-empty event -->
		<div v-if="!isEmpty" class="h-full text-white p-1 text-sm cursor-pointer" @mouseenter="setHovered(true)"
			@mouseleave="setHovered(false)" @click="handleEventClick()">
			<div class="flex flex-row justify-between">
				<h3 class="font-bold relative">{{ eventData.course }}</h3>
				<div v-if="!isSmallDevice && !isExport" class="absolute right-0">
					<Button v-if="sectionLocked" rounded text icon="pi pi-lock" @click.stop="blockSectionToggle()"
						iconClass="text-white" />
					<Button v-else-if="hovered || isSmallDevice" rounded text icon="pi pi-lock-open"
						@click.stop="blockSectionToggle()" iconClass="text-white" />
				</div>
			</div>
			<p :class="{ 'text-red-300': sectionLocked && !isExport }">{{ eventData.activity }} ({{
				activityData.building.buildingCode ?
					activityData.building.buildingCode : 'Online' }})</p>
			<p>{{ parseTime(eventData.start) }} - {{ parseTime(eventData.end) }}</p>
		</div>
		<!-- Empty event -->
		<div v-else-if="eventData.start % 3600 === 0 && eventData.end % 3600 === 0"
			:class="['event', 'h-full', dynamicColor]" :style="{ 'height': getHeight }" @mouseover="setHovered(true)"
			@mouseleave="setHovered(false)">
			<div v-show="hovered" class="m-0 p-0 h-[100%] flex items-center" @click="blockTimeToggle()" v-ripple>
				<p v-show="hovered" class="text-center unselectable text-text-primary w-full">
					{{ dynamicText }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { useTimetableStore } from '../../store/timetable';
import { useWindowSize } from '../../composables/useWindowSize';
import { DAYS, FIRST_SEM, SECOND_SEM } from '../../store/timetable.shared';

const store = useTimetableStore() as any;
const { isSmallDevice, height } = useWindowSize();

const hovered: Ref<boolean> = ref(false);

const props = defineProps({
	eventData: {
		type: Object,
		required: true
	},
	day: {
		type: String,
	},
	semester: {
		type: String
	},
	isEmpty: {
		type: Boolean
	},
	isExport: {
		type: Boolean,
		required: false,
		default: false
	}
});

const secondsToHours = (seconds: number) => seconds / 3600;
const days: Array<string> = [...DAYS];

const activityData = computed(() => {
	return !props.isEmpty ? store.selectedCourses[store.selectedSession][props.eventData.course].courseData.sections
		.find((section: any) => section.name === props.eventData.activity).meetingTimes
		.find((meetingTime: any) => {
			return meetingTime.day === days.indexOf(props.day as string) + 1 &&
				meetingTime.start === props.eventData.start &&
				meetingTime.end === props.eventData.end
		})
		: null;
});

const duration = computed(() => {
	return secondsToHours(props.eventData.end - props.eventData.start);
});

const oneHourHeight = computed(() => {
	return (height.value - 168) / 9 > 65 ? (height.value - 168) / 9 : 65;
});

const getHeight = computed(() => {
	return `${duration.value * oneHourHeight.value}px`;
});

const dynamicText = computed(() => {
	return !timeBlocked.value ? 'Block This Time' : 'Unblock This Time';
});

const dynamicColor = computed(() => {
	const lockedColor = 'bg-timetablecell-hover';
	const background = 'bg-transparent';

	if (timeBlocked.value) {
		return lockedColor;
	}

	return hovered.value && !isSmallDevice.value ? lockedColor : background;
});

const sectionLocked = computed(() => {
	const lockedActivitiesForCourse = store.lockedSections[props.semester as string][props.eventData.course] || [];
	return lockedActivitiesForCourse.includes(props.eventData.activity);
});

const timeBlocked = computed(() => {
	const blockedTimesForSemester = store.blockedTimes[props.semester as string] || [];

	return blockedTimesForSemester.some((blocker: any) => {
		return blocker.day === props.day &&
			blocker.start === props.eventData.start &&
			blocker.end === props.eventData.end;
	});
});

/**
 * @brief Toggles a lock on the course activity given by props
 */
async function blockSectionToggle() {
	await store.setLockedSectionStatus(props.eventData.course, props.eventData.activity, !sectionLocked.value);
	store.saveStateHistory();
}

/**
 * @brief Toggles a lock on the current time this event is at (for empty events)
 */
async function blockTimeToggle() {
	await store.setLockedTimeStatus(
		props.semester,
		props.day,
		props.eventData.start,
		props.eventData.end,
		!timeBlocked.value
	);
	store.saveStateHistory();
}

/**
 * @brief Returns the semester code of the given course
 * @param courseCode The course code
 * @returns The semester code
 */
function getCourseSectionCode(courseCode: string) {
	const selectedCourse = store.selectedCourses[store.selectedSession]?.[courseCode] ||
		store.selectedCourses[FIRST_SEM]?.[courseCode] ||
		store.selectedCourses[SECOND_SEM]?.[courseCode];

	return selectedCourse?.courseData?.sectionCode || store.selectedSession;
}

/**
 * @brief Opens the detail card for the course given by props
 */
function openDetailCard() {
	const sectionCode = getCourseSectionCode(props.eventData.course);
	store.setDetailCardVisibility(`${props.eventData.course} ${sectionCode}`, true);
}

/**
 * @brief Handles clicks on the event cell, triggering a section block on smaller devices or opening the detail card
 * otherwise
 */
async function handleEventClick() {
	if (isSmallDevice.value) {
		await blockSectionToggle();
		return;
	}

	openDetailCard();
}

/**
 * @brief Converts seconds after midnight to a formatted 12 hour time string
 * @param seconds The seconds after midnight
 * @returns The formatted 12 hour time as a string
 */
function parseTime(seconds: number) {
	const totalMins = Math.floor(seconds / 60);
	const hours = Math.floor(totalMins / 60);
	let mins = ':' + String(totalMins % 60).padStart(2, '0');
	if (mins === ':00') mins = '';
	const extension = hours < 12 ? 'AM' : 'PM';

	return `${hours % 12 === 0 ? 12 : hours % 12}${mins} ${extension}`;
}

/**
 * @brief Prevents hovered for being toggled on small devices, otherwise allows the hover value to be set
 * @param value Whether the cell is being hovered
 */
function setHovered(value: boolean) {
	if (isSmallDevice.value) {
		hovered.value = false;
		return;
	}

	hovered.value = value;
}
</script>

<style scoped>
.unselectable {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.center {
	text-align: center;
}

.noScrollbar::-webkit-scrollbar {
	display: none;
}

.noScrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.event {
	color: white;
	cursor: pointer;
}
</style>
