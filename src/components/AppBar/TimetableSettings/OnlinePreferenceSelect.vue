<template>
    <div class="m-2">
        <label for="onlinePreferenceSetting" class="block mb-0 text-sm font-bold">Online Preference</label>
        <SelectButton v-model="onlinePreference" :options="options" :allowEmpty="false" :pt:root:class="'shadow-md'"
            :pt:pcToggleButton:root:id="'onlinePreferenceSetting'" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useTimetableStore } from '../../../store/timetable';

const store = useTimetableStore() as any;

const onlinePreference: Ref<string> = ref(store.onlinePreference ?? 'Neutral');

const options: Ref<Array<string>> = ref([
    'Avoid',
    'Neutral',
    'Prefer'
]);

watch(onlinePreference, (val: string) => {
    if (val !== store.onlinePreference) store.onlinePreference = val;
});

watch(() => store.onlinePreference, (val: string) => {
    if (val !== onlinePreference.value) onlinePreference.value = val;
});
</script>