<template>
	<div>
		<Button @click="setTutorial" icon="pi pi-question" rounded v-tooltip.left="tooltip('View the Tutorial')"
			:pt:root:class="'bg-green-400 border-green-400 text-white'" class="shadow-md"
			aria-label="View the Tutorial" />
	</div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable';
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip';

const store = useTimetableStore() as any;
const { tooltip } = useResponsiveTooltip();

function setTutorial() {
	store.tutorialPopup = true;
}
</script>
