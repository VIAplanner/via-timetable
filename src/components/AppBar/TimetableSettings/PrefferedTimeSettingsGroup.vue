<template>
    <div class="flex flex-col items-start justify-between">
        <div class="flex flex-row items-start justify-between">
            <TimeSettingSelect v-model:output="start" label="Pref. Min Start" defaultValue="9am" />
            <TimeSettingSelect v-model:output="maxEnd" label="Pref. Max End" defaultValue="3pm" />
        </div>
        <div class="flex flex-row items-start justify-between">
            <MaxDayLengthInput />
            <MinDayLengthInput />
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useTimetableStore } from '../../../store/timetable';
import TimeSettingSelect from './TimeSettingSelect.vue';
import MaxDayLengthInput from './MaxDayLengthInput.vue';
import MinDayLengthInput from './MinDayLengthInput.vue';

const store = useTimetableStore() as any;

const start: Ref<number> = ref(store.prefferedStart || 9);
const maxEnd: Ref<number> = ref(store.prefferedMaxEnd || 15);

watch(start, (val: number) => {
    if (val !== store.start) store.prefferedStart = val;
});

watch(() => store.start, (val: number) => {
    if (val !== start.value) start.value = val;
});

watch(maxEnd, (val: number) => {
    if (val !== store.maxEnd) store.prefferedMaxEnd = val;
});

watch(() => store.maxEnd, (val: number) => {
    if (val !== maxEnd.value) maxEnd.value = val;
});
</script>