<template>
	<div>
		<SelectButton v-model="selectedSession" :options="sessions" :allowEmpty="false" :pt:root:class="'shadow-md'"
			:size="isSmallDevice ? 'small' : 'large'" />
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useTimetableStore } from '../../store/timetable';
import { useWindowSize } from '../../composables/useWindowSize';
import { FIRST_SEM, SEMESTER_CODES } from '../../store/timetable.shared';

const store = useTimetableStore() as any;
const { isSmallDevice } = useWindowSize();

const sessions: Ref<Array<string>> = ref([...SEMESTER_CODES]);

const selectedSession = ref(store.selectedSession || FIRST_SEM);

watch(selectedSession, (val) => {
	if (val !== store.selectedSession) store.selectedSession = val;
});

watch(() => store.selectedSession, (val) => {
	if (val !== selectedSession.value) selectedSession.value = val;
});
</script>

<style>
span[data-p~="checked"] {
	background-color: var(--color-active) !important;
	color: white;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
