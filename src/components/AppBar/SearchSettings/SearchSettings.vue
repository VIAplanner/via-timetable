<template>
  <div class="flex items-center">
    <Button
      v-tooltip.bottom="tooltip('Change Search Settings')"
      icon="pi pi-search"
      rounded
      aria-label="Change Search Settings"
      :pt:root:class="'w-8! h-8! md:w-10! md:h-10!'"
      :pt:icon:class="'text-white text-sm md:text-lg'"
      @click="toggleSearchPanel"
    />
    <Popover ref="popover">
      <SearchDivisionSelect />
      <Divider />
      <SearchSessionSelect />
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import SearchDivisionSelect from './SearchDivisionSelect.vue'
import SearchSessionSelect from './SearchSessionSelect.vue'
import { useResponsiveTooltip } from '../../../composables/useResponsiveTooltip'

const popover: Ref<any> = ref(null)
const { tooltip } = useResponsiveTooltip()

function toggleSearchPanel(event: any) {
  popover.value.toggle(event)
}
</script>
