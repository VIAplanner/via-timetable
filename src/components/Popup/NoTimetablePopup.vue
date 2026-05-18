<template>
	<div>
		<Dialog v-model:visible="visible" modal :style="{ 'max-width': '290px' }" :showHeader="false">
			<h2 class="text-lg font-bold my-2">Warning</h2>
			<p>
				We are unable to generate timetables for one or more semesters based on your current course selection.
				There will likely be one or more conflicts in the resulting timetables.
			</p>
			<div class="flex justify-between mt-6">
				<Button @click="visible = false" label="Proceed" />
			</div>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useTimetableStore } from '../../store/timetable';

const store = useTimetableStore() as any;

const visible: Ref<boolean> = ref(store.noTimetablePopup ?? false);

watch(visible, (val: boolean) => {
	if (store.noTimetablePopup !== val) store.noTimetablePopup = val;
});

watch(() => store.noTimetablePopup, (val: boolean) => {
	if (visible.value !== val) visible.value = val;
});
</script>
