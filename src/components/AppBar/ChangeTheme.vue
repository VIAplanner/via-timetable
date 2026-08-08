<template>
	<div class="flex items-center">
		<Button @click="store.toggleDarkMode()" :icon="themeIcon" rounded v-tooltip.bottom="tooltip('Toggle Theme')"
			aria-label="Toggle Theme" :pt:root:class="'w-8! h-8! md:w-10! md:h-10!'"
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