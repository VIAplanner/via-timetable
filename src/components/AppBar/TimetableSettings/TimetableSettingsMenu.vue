<template>
	<div class="flex h-full items-center">
		<Drawer v-model:visible="visible" header="Timetable Generation Settings" :dismissable="true" position="right"
			:pt:root:class="'w-104'" :pt:header:class="'text-text-secondary'">
			<div v-if="isSmallDevice" class="w-full flex flex-row justify-center items-center gap-2">
				<BuildTimetableButton />
			</div>
			<TextDivider text="Time Settings" />
			<PreferredTimeSettingsGroup />
			<TextDivider text="Gap Settings" />
			<PreferredGapSettingsGroup />
			<TextDivider text="Misc. Settings" />
			<MiscSettingsGroup />
		</Drawer>
		<Button icon="pi pi-cog" rounded v-tooltip.bottom="tooltip('Timetable Settings')" @click="visible = true"
			:pt:icon:class="'text-white'" />
	</div>
</template>

<script setup lang="ts">
import TextDivider from '../../Misc/TextDivider.vue';
import PreferredTimeSettingsGroup from './PreferredTimeSettingsGroup.vue';
import PreferredGapSettingsGroup from './PreferredGapSettingsGroup.vue';
import MiscSettingsGroup from './MiscSettingsGroup.vue';
import BuildTimetableButton from '../BuildTimetableButton.vue';
import { useWindowSize } from '../../../composables/useWindowSize';
import { useResponsiveTooltip } from '../../../composables/useResponsiveTooltip';
import { ref, Ref } from 'vue';

const { isSmallDevice } = useWindowSize();
const { tooltip } = useResponsiveTooltip();
const visible: Ref<boolean> = ref(false);
</script>