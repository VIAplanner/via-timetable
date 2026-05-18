<template>
	<div>
		<Button @click="toggleHelpDial" rounded icon="pi pi-bars" :pt:icon:class="'text-white'" />
		<Popover ref="popover"
			:pt:root:style="{ 'background-color': 'transparent', 'box-shadow': 'none', 'border': 'none', 'margin-bottom': '0' }"
			:pt:root:class="'helpDialRoot'" :pt:content:class="'p-0'">
			<div>
				<TutorialButton class="py-1" />
				<AboutButton class="py-1" />
				<ExportCalendarButton class="py-1" />
			</div>
		</Popover>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import AboutButton from './AboutButton.vue';
import TutorialButton from './TutorialButton.vue';
import ExportCalendarButton from './ExportCalendarButton.vue';

const popover: Ref<any> = ref(null);

function toggleHelpDial(event: any) {
	popover.value.toggle(event);
}
</script>

<style>
.helpDialRoot::before {
	content: none !important;
}

.helpDialRoot::after {
	content: none !important;
}
</style>