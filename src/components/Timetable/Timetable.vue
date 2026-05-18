<template>
	<div class="flex flex-row h-full">
		<NoTimetablePopup />
		<div class="time-axis flex flex-col mt-4 ml-0 md:ml-1 mr-0">
			<div class="top-margin" />
			<div v-for="(time, index) in timeRange" :key="index" class="time-axis-number w-[3.25rem] md:w-[4rem]"
				:style="{ height: oneHourHeight }">
				<HourSwitch :time="time" :last="index !== timeRange.length - 1" :semester="semester" :isExport="isExport" />
			</div>
		</div>
		<div class="col-11 w-full pr-8">
			<!-- Weekday Axis -->
			<div class="grid" name="weekDaysAxis">
				<div v-for="(weekday, index) in weekdays" :key="weekday" class="col">
					<WeekdaySwitch :weekday="weekday"
						:weekdayLabel="useShortWeekdays ? weekdaysShort[index] as string : weekday" :semester="semester"
						class="pb-[20px]" :isExport="isExport" />
				</div>
			</div>
			<!-- Timetable Content -->
			<div class="grid timetableContent" name="timetableContent">
				<div v-for="(meetingSections, day) in timetable" class="col relative" :key="day">
					<div v-for="hour in timeRange.length" :key="hour" :style="{
						height: oneHourHeight,
						'box-sizing': 'border-box',
						...(hour !== timeRange.length ? {
							'border-right': '1px solid gray',
							'border-bottom': '1px solid gray',
							...(day === 'Monday' ? { 'border-left': '1px solid gray' } : {})
						} : {}),
					}" :class="(hour !== timeRange.length) ? (isExport ? 'bg-white timetablecell' : 'bg-timetablecell timetablecell') : 'timetablecell'" />
					<div v-for="event in getEventsForDay(meetingSections) as Array<any>"
						:key="event.start + '-' + event.currEnd + (event.overlapIndex || 0)"
						class="absolute left-0 right-0 flex pb-[1px]" :style="{
							top: `${((event.currStart / 3600) - timetableStart) * parseFloat(oneHourHeight)}px`,
							height: `${((event.currEnd - event.currStart) / 3600) * parseFloat(oneHourHeight)}px`,
							width: event.totalOverlapping ? `${100 / event.totalOverlapping}%` : '100%',
							marginLeft: event.totalOverlapping > 1 ? `${(event.overlapIndex * 100) / event.totalOverlapping}%` : '0%',
							...(day === 'Monday' && (event.overlapIndex === 0 || event.isEmpty) ? { 'padding-left': '1px' } : {}),
							...(event.isEmpty || event.overlapIndex === event.totalOverlapping - 1 ? { 'padding-right': '1px' } : {})
						}">
						<template v-if="!event.isEmpty">
							<TimetableEvent v-for="(courseActivityData, index) in event.courses"
								:key="courseActivityData.course + courseActivityData.activity + index"
								:eventData="courseActivityData" :semester="semester" :day="day" :isEmpty="false" :isExport="isExport"
								:style="{ 'background-color': store.selectedCourses[store.selectedSession][courseActivityData.course].color }" />
						</template>
						<template v-else-if="!isExport">
							<TimetableEvent :eventData="{
								start: event.currStart,
								end: event.currEnd
							}" :semester="semester" :day="day" :isEmpty="true" :isExport="isExport" />
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { useTimetableStore } from '../../store/timetable';
import TimetableEvent from './TimetableEvent.vue';
import NoTimetablePopup from '../Popup/NoTimetablePopup.vue';
import HourSwitch from './HourSwitch.vue';
import WeekdaySwitch from './WeekdaySwitch.vue';
import { useWindowSize } from '../../composables/useWindowSize';
import { DAYS, DAYS_SHORT } from '../../store/timetable.shared';

const store = useTimetableStore() as any;
const { height, isSmallDevice } = useWindowSize();

const props = defineProps({
	timetable: {
		type: Object,
		required: true
	},
	semester: {
		type: String,
		required: true
	},
	isExport: {
		type: Boolean,
		required: false,
		default: false
	}
});

const weekdays: Ref<Array<string>> = ref([...DAYS]);
const weekdaysShort: Ref<Array<string>> = ref([...DAYS_SHORT])
const useShortWeekdays = computed(() => isSmallDevice.value);

/** The hour that the earliest class starts on for any day in the given semester */
const timetableStart = computed(() => {
	let earliest = 9;

	for (const day in props.timetable) {
		const dayEvents = props.timetable[day];

		for (const event of dayEvents) {
			const start = Math.floor(event.start / 3600);
			if (start < earliest) earliest = start;
		}
	}

	return earliest;
});

/** The hour that the latest class starts on for any day in the given semester */
const timetableEnd = computed(() => {
	let latest = 18;

	for (const day in props.timetable) {
		const dayEvents = props.timetable[day];

		for (const event of dayEvents) {
			const end = Math.ceil(event.end / 3600);
			if (end > latest) latest = end;
		}
	}

	return latest;
});

/**
 * An array containing all the formatted (12 hour with extension) times that are between the start and of the
 * timetable
 */
const timeRange = computed(() => {
	const result = [];

	for (let i = timetableStart.value; i <= timetableEnd.value; i++) {
		if (i > 12) result.push(`${i % 12} PM`);
		else if (i === 12) result.push(`12 PM`);
		else result.push(`${i % 12} AM`);
	}

	return result;
});

/** The height in pixels that any timetable event cell should be */
const oneHourHeight = computed(() => {
	if ((height.value - 168) / 9 > 65) return `${Math.round((height.value - 168) / 9)}px`;
	return `65px`;
});

/**
 * @brief Constructs an array of JSONs encoding timetable events for each day, including placeholder events for empty
 * events. Used to render timetable events on the timetable component
 * @param meetingSections The meeting time data for the day
 * @return The events JSON for the day
 */
function getEventsForDay(meetingSections: Array<any>) {
	const result = [];
	const HOUR_OFFSET = 3600;

	// Empty day case
	if (!meetingSections.length) {
		let invalidStart = -1;
		for (let i = timetableStart.value; i < timetableEnd.value; i++) {
			result.push({
				start: invalidStart,
				end: invalidStart,
				currStart: i * HOUR_OFFSET,
				currEnd: (i + 1) * HOUR_OFFSET,
				isEmpty: true,
				courses: []
			});
			invalidStart--;
		}
		return result
	}

	// Create individual events for each course
	const allEvents = [];
	for (const course of meetingSections) {
		allEvents.push({
			start: course.start,
			end: course.end,
			currStart: course.start,
			currEnd: course.end,
			courses: [course],
			isEmpty: false,
			courseData: course,
			processed: false,
			totalOverlapping: 0,
			overlapIndex: 0,
			overlapGroupStart: 0,
			overlapGroundEnd: 0,
		});
	}

	// Sort by start time
	allEvents.sort((a, b) => a.start - b.start);

	// Find overlapping groups and assign positions
	for (let i = 0; i < allEvents.length; i++) {
		const current = allEvents[i] as any;
		if (!current || current.processed) continue;

		// Find all events that overlap with current
		const overlappingEvents = [current];
		let groupStart = current.start;
		let groupEnd = current.end;

		for (let j = i + 1; j < allEvents.length; j++) {
			const other = allEvents[j] as any;
			if (other!.start < groupEnd) {
				overlappingEvents.push(other!);
				groupEnd = Math.max(groupEnd, other!.end);
				other!.processed = true;
			}
		}

		// Assign position information to overlapping events
		overlappingEvents.forEach((event: any, index: number) => {
			event.totalOverlapping = overlappingEvents.length;
			event.overlapIndex = index;
			event.overlapGroupStart = groupStart;
			event.overlapGroupEnd = groupEnd;
		});

		current.processed = true;
	}

	// Fill gaps with empty slots
	const finalResult = [];
	let currentTime = timetableStart.value * HOUR_OFFSET;
	let invalidStart = -1;

	// Reset processed flag and sort again
	allEvents.forEach(event => event.processed = false);
	allEvents.sort((a, b) => a.start - b.start);

	while (currentTime < timetableEnd.value * HOUR_OFFSET) {
		// Find events that start at or before current time and haven't ended
		const activeEvents = [];

		for (let i = 0; i < allEvents.length; i++) {
			const event = allEvents[i];
			if (event!.start <= currentTime && event!.end > currentTime) {
				activeEvents.push(event);
			}
		}

		if (activeEvents.length > 0) {
			// Add all active events
			activeEvents.forEach((event: any) => {
				if (!event.addedToResult) {
					finalResult.push(event);
					event.addedToResult = true;
				}
			});

			// Move to next change point
			const nextChangeTime = Math.min(
				...activeEvents.map(e => e!.end),
				...allEvents.filter(e => e.start > currentTime).map(e => e.start),
				timetableEnd.value * HOUR_OFFSET
			);

			currentTime = nextChangeTime;
		} else {
			// Add empty slot
			const nextEventStart = allEvents.find(e => e.start > currentTime)?.start || timetableEnd.value * HOUR_OFFSET;
			const nextHour = Math.min(currentTime + HOUR_OFFSET, nextEventStart);

			if (nextHour > currentTime) {
				finalResult.push({
					start: invalidStart,
					end: invalidStart,
					currStart: currentTime,
					currEnd: nextHour,
					isEmpty: true,
					courses: []
				});
				invalidStart--;
			}

			currentTime = nextHour;
		}
	}

	return finalResult;
}
</script>

<style scoped>
.col {
	padding: 0px !important;
}

.time-axis-number {
	text-align: right;
}

.top-margin {
	margin-bottom: 25px;
}

.time-axis {
	margin-right: 20px;
}

.time-label {
	text-align: right;
}

.timetableContent {
	border-top: 1px solid gray;
}
</style>
