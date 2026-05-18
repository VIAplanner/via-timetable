<template>
    <div>
        <div>
            <h2 class="font-bold text-lg">
                Select Divisions
            </h2>
            <div v-for="division of divisions" :key="division.value" class="flex items-center gap-2">
                <Checkbox v-model="selectedDivisions" :inputId="division.value" name="division"
                    :value="division.value" />
                <label :for="division.value">
                    {{ division.label }}
                </label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, Ref } from 'vue';
import { useTimetableStore } from '../../../store/timetable';

const store = useTimetableStore() as any;

const selectedDivisions: Ref<Array<string>> = ref([...store.selectedDivisions || []]);
const divisions: Ref<Array<any>> = ref([]);

watch(selectedDivisions, (val: Array<string>) => {
    if (JSON.stringify(val) !== JSON.stringify(store.selectedDivisions)) store.selectedDivisions = val;
}, { deep: true });

watch(() => store.selectedDivisions, (val: Array<string>) => {
    if (JSON.stringify(val) !== JSON.stringify(selectedDivisions.value)) selectedDivisions.value = [...val || []];
}, { deep: true });

watchEffect(async () => {
    divisions.value = await store.getDivisions();
});
</script>