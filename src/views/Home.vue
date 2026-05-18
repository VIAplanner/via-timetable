<template>
	<div class="relative">
		<TutorialPopup />
		<div v-show="isSmallDevice" :class="[
			'fixed right-2 z-[130] md:hidden flex flex-col gap-2',
			sidebarOpen ? 'top-2' : 'top-[82px]'
		]">
			<Button :icon="sidebarOpen ? 'pi pi-times' : 'pi pi-bars'" rounded
				:aria-label="sidebarOpen ? 'Close sidebar' : 'Open sidebar'" :aria-expanded="sidebarOpen"
				@click="toggleSidebar" :pt:icon:class="'text-white'" />
			<TimetableSettingsMenu v-show="!sidebarOpen" />
		</div>
		<div
			class="fixed top-0 left-0 z-30 flex flex-row h-[75px] w-full items-center justify-center md:justify-start bg-main-accent">
			<img src="../assets/VIA-Logo-White.png" class="max-w-[35px] md:max-w-[50px] my-2 ml-2">
			<Button icon="pi pi-replay" rounded @click="store.undo()" class="m-2 md:ml-3"
				v-tooltip.bottom="tooltip('Undo')" :pt:root:class="'!w-[2rem] !h-[2rem] md:!w-[2.5rem] md:!h-[2.5rem]'"
				:pt:icon:class="'text-white text-sm md:text-lg'" />
			<Button icon="pi pi-refresh" rounded @click="store.redo()" class="m-2 ml-0 md:mr-3"
				v-tooltip.bottom="tooltip('Redo')" :pt:root:class="'!w-[2rem] !h-[2rem] md:!w-[2.5rem] md:!h-[2.5rem]'"
				:pt:icon:class="'text-white text-sm md:text-lg'" />
			<CourseSearchBar class="mr-2" />
			<div class="flex flex-row items-center gap-2">
				<ChangeTheme />
				<SearchSettings />
				<TimetableSettingsMenu v-if="!isSmallDevice" />
				<SessionSelect />
				<BuildTimetableButton v-if="!isSmallDevice" />
			</div>
		</div>
		<div v-if="isSmallDevice && sidebarOpen" class="fixed inset-0 z-[120] md:hidden" role="dialog" aria-modal="true"
			aria-label="Selected courses sidebar">
			<div class="absolute inset-0 bg-black/40" @click="sidebarOpen = false" />
			<div class="relative h-full w-full">
				<SideBar :fullscreen="true" />
			</div>
		</div>
		<div class="pt-[75px] flex flex-row w-full">
			<div class="w-full">
				<router-view />
				<div class="w-full flex flex-row items-center justify-center footer">
					<p class="my-3 font-medium">Copyright © 2026 VIAplanner</p>
				</div>
			</div>
			<div class="hidden md:block md:w-[25%]">
				<SideBar />
			</div>
		</div>
		<HelpDial class="fixed bottom-2 right-2 z-50" />
	</div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { useTimetableStore } from '../store/timetable';
import TutorialPopup from '../components/Popup/TutorialPopup.vue';
import CourseSearchBar from '../components/AppBar/CourseSearchBar.vue';
import SessionSelect from '../components/AppBar/SessionSelect.vue';
import ChangeTheme from '../components/AppBar/ChangeTheme.vue';
import TimetableSettingsMenu from '../components/AppBar/TimetableSettings/TimetableSettingsMenu.vue';
import SideBar from '../components/SidePanel/SideBar.vue';
import SearchSettings from '../components/AppBar/SearchSettings/SearchSettings.vue';
import BuildTimetableButton from '../components/AppBar/BuildTimetableButton.vue';
import HelpDial from '../components/FloatingButtons/HelpDial.vue';
import { useWindowSize } from '../composables/useWindowSize';
import { useResponsiveTooltip } from '../composables/useResponsiveTooltip';

const { isSmallDevice } = useWindowSize();
const { tooltip } = useResponsiveTooltip();
const store = useTimetableStore();

const sidebarOpen = ref(false);

/**
 * @brief Toggles visibility of the sidebar
 */
function toggleSidebar() {
	sidebarOpen.value = !sidebarOpen.value;
}

watch(sidebarOpen, (isOpen) => {
	if (typeof document === 'undefined') return;
	document.body.style.overflow = isOpen ? 'hidden' : '';
});

watch(isSmallDevice, (smallDevice) => {
	if (!smallDevice) sidebarOpen.value = false;
});

onBeforeUnmount(() => {
	if (typeof document !== 'undefined') document.body.style.overflow = '';
});
</script>