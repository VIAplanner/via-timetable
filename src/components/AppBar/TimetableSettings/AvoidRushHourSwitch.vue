<template>
    <div class="m-2 w-35">
        <label for="avoidRushHourSwitch" class="block mb-0 text-sm font-bold">Avoid Rush Hour</label>
        <ToggleSwitch v-model="avoidRushHour" :pt:slider:class="'AvoidRushHourSwitch'"
            :pt:input:id="'avoidRushHourSwitch'" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref , watch } from 'vue';
import { useTimetableStore } from '../../../store/timetable';

const store = useTimetableStore() as any;

const avoidRushHour: Ref<boolean> = ref(store.avoidRushHour ?? false);

watch(avoidRushHour, (val: boolean) => {
    if (val !== store.avoidRushHour) store.avoidRushHour = val;
});

watch(() => store.avoidRushHour, (val: boolean) => {
    if (val !== avoidRushHour.value) avoidRushHour.value = val;
});
</script>

<style>
.AvoidRushHourSwitch[data-p="checked"] {
    background-color: var(--color-active) !important;
}
</style>