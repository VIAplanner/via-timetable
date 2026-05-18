<template>
    <div class="flex items-center">
        <Button icon="pi pi-search" @click="toggleSearchPanel" rounded
            v-tooltip.bottom="tooltip('Change Search Settings')"
            :pt:root:class="'!w-[2rem] !h-[2rem] md:!w-[2.5rem] md:!h-[2.5rem]'"
            :pt:icon:class="'text-white text-sm md:text-lg'" />
        <Popover ref="popover">
            <SearchDivisionSelect />
            <Divider />
            <SearchSessionSelect />
        </Popover>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import SearchDivisionSelect from './SearchDivisionSelect.vue';
import SearchSessionSelect from './SearchSessionSelect.vue';
import { useResponsiveTooltip } from '../../../composables/useResponsiveTooltip';

const popover: Ref<any> = ref(null)
const { tooltip } = useResponsiveTooltip();

function toggleSearchPanel(event: any) {
    popover.value.toggle(event);
}
</script>