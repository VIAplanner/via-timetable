<template>
	<div class="flex items-center">
		<Button @click="store.toggleDarkMode()" :icon="themeIcon" rounded v-tooltip.bottom="tooltip('Toggle Theme')"
			:pt:root:class="'!w-[2rem] !h-[2rem] md:!w-[2.5rem] md:!h-[2.5rem]'"
			:pt:icon:class="'text-white text-sm md:text-lg'" />
	</div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable';
import { computed } from 'vue';
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip';

const store = useTimetableStore() as any;
const { tooltip } = useResponsiveTooltip();

const themeIcon = computed(() => {
	return store.darkMode ? 'pi pi-moon' : 'pi pi-sun';
});
</script>