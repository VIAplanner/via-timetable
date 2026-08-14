<template>
  <div class="relative">
    <TutorialPopup />
    <div
      v-show="isSmallDevice"
      :class="[
        'fixed right-2 z-130 md:hidden flex flex-col gap-2',
        sidebarOpen ? 'top-2' : 'top-20.5',
      ]"
    >
      <Button
        :icon="sidebarOpen ? 'pi pi-times' : 'pi pi-angle-left'"
        rounded
        :aria-label="sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
        :aria-expanded="sidebarOpen"
        :pt:icon:class="'text-white'"
        @click="toggleSidebar"
      />
      <TimetableSettingsMenu v-if="!sidebarOpen" />
    </div>
    <div
      class="fixed top-0 left-0 z-30 flex flex-row h-18.75 w-full items-center justify-center md:justify-start bg-main-accent"
    >
      <h1 class="sr-only">VIAplanner — University of Toronto Timetable Builder</h1>
      <img
        alt="VIAplanner logo"
        src="../assets/VIA-Logo-White.png"
        class="max-w-8.75 md:max-w-12.5 my-2 ml-2"
      />
      <Button
        v-tooltip.bottom="tooltip('Undo')"
        icon="pi pi-replay"
        rounded
        class="m-2 md:ml-3"
        :pt:root:class="'w-8! h-8! shrink-0 md:w-10! md:h-10!'"
        :pt:icon:class="'text-white text-sm md:text-lg'"
        aria-label="Undo"
        @click="store.undo()"
      />
      <Button
        v-tooltip.bottom="tooltip('Redo')"
        icon="pi pi-refresh"
        rounded
        class="m-2 ml-0 md:mr-3"
        :pt:root:class="'w-8! h-8! shrink-0 md:w-10! md:h-10!'"
        :pt:icon:class="'text-white text-sm md:text-lg'"
        aria-label="Redo"
        @click="store.redo()"
      />
      <CourseSearchBar class="mr-2" />
      <div class="flex flex-row items-center gap-2">
        <ChangeTheme />
        <SearchSettings />
        <TimetableSettingsMenu v-if="!isSmallDevice" />
        <SessionSelect />
        <BuildTimetableButton v-if="!isSmallDevice" />
      </div>
    </div>
    <div
      v-if="isSmallDevice && sidebarOpen"
      class="fixed inset-0 z-120 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Selected courses sidebar"
    >
      <div
        class="absolute inset-0 bg-black/40"
        role="button"
        tabindex="0"
        aria-label="Close sidebar overlay"
        @click="sidebarOpen = false"
        @keydown.enter.prevent="sidebarOpen = false"
        @keydown.space.prevent="sidebarOpen = false"
      />
      <div class="relative h-full w-full">
        <SideBar :fullscreen="true" />
      </div>
    </div>
    <div class="pt-18.75 flex flex-row w-full">
      <div class="w-full">
        <router-view />
        <div class="w-full flex flex-row items-center justify-center footer">
          <p class="my-3 font-medium">Copyright © 2026 VIAplanner</p>
        </div>
      </div>
      <div class="hidden md:block md:w-[25%]">
        <SideBar :fullscreen="false" />
      </div>
    </div>
    <HelpDial class="fixed bottom-2 right-2 z-50" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useTimetableStore } from '../store/timetable'
import TutorialPopup from '../components/Popup/TutorialPopup.vue'
import CourseSearchBar from '../components/AppBar/CourseSearchBar.vue'
import SessionSelect from '../components/AppBar/SessionSelect.vue'
import ChangeTheme from '../components/AppBar/ChangeTheme.vue'
import TimetableSettingsMenu from '../components/AppBar/TimetableSettings/TimetableSettingsMenu.vue'
import SideBar from '../components/SidePanel/SideBar.vue'
import SearchSettings from '../components/AppBar/SearchSettings/SearchSettings.vue'
import BuildTimetableButton from '../components/AppBar/BuildTimetableButton.vue'
import HelpDial from '../components/FloatingButtons/HelpDial.vue'
import { useWindowSize } from '../composables/useWindowSize'
import { useResponsiveTooltip } from '../composables/useResponsiveTooltip'

const { isSmallDevice } = useWindowSize()
const { tooltip } = useResponsiveTooltip()
const store = useTimetableStore()

const sidebarOpen = ref(false)

/**
 * @brief Toggles visibility of the sidebar
 */
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

watch(sidebarOpen, (isOpen) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

watch(isSmallDevice, (smallDevice) => {
  if (!smallDevice) sidebarOpen.value = false
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>
