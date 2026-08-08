<template>
	<div>
		<div class="overflow-y-auto max-h-[85vh] overflow-x-hidden" tabindex="0" role="region" aria-label="Timetable">
			<Timetable :timetable="store.timetables[store.selectedSession]" :semester="store.selectedSession"
				:id="store.selectedSession === FIRST_SEM ? 'exportFirstMe' : 'exportSecondMe'" />
		</div>
	</div>
</template>

<script setup>
import { useTimetableStore } from '../store/timetable';
import Timetable from '../components/Timetable/Timetable.vue';
import { FIRST_SEM } from '../store/timetable.shared';

const store = useTimetableStore();
</script>