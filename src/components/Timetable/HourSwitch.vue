<template>
	<div class="h-full cursor-pointer select-none" @click="toggleHourLock()">
		<h2 class="mr-[10px] text-[12px] md:text-[16px] font-semibold">{{ time }}</h2>
		<div v-if="last && locked && !isExport" class="mt-2 flex flex-row items-center justify-center"
			v-tooltip.right="tooltip(lockTooltipText)">
			<Button @click.stop="toggleHourLock()" icon="pi pi-lock" rounded text iconClass="text-text-primary" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimetableStore } from '../../store/timetable';
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip';
import { BlockedTimeData, DAYS } from '../../store/timetable.shared';

const store = useTimetableStore() as any;
const { tooltip } = useResponsiveTooltip();

const days: Array<string> = [...DAYS];

const props = defineProps({
	time: {
		type: String,
		required: true
	},
	last: {
		type: Boolean,
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
})

const intTime = computed(() => {
	const timeSplit = props.time.split(' ');
	if (!timeSplit[0]) return 0;
	const hour = parseInt(timeSplit[0]);
	return hour + ((timeSplit[1] === 'PM' && hour !== 12) ? 12 : 0);
});

const locked = computed(() => {
	const blockedTimesForSemester = store.blockedTimes[props.semester] || [];

	return days.every((day) => (
		blockedTimesForSemester.some((blocker: BlockedTimeData) => (
			blocker.day === day &&
			blocker.start === intTime.value * 3600 &&
			blocker.end === (intTime.value * 3600) + 3600
		))
	));
});

const lockTooltipText = computed(() => {
	return locked.value ? 'Unblock All Times' : 'Block All Times';
});

/**
 * @brief Toggles a lock for this hour for all days
 */
async function toggleHourLock() {
	await store.setLockedHourStatus(intTime.value, !locked.value);
	store.saveStateHistory();
}
</script>
