<template>
    <div class="m-2">
        <label for="maxGapInput" class="block mb-0 text-sm font-bold">Max Gap</label>
        <InputNumber v-model="maxGap" suffix=" Hours" :min="0" :max="12" showButtons buttonLayout="stacked"
            inputClass="MaxGapInput" placeholder="2 Hours" :pt:pcInputText:root:id="'maxGapInput'" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useTimetableStore } from '../../../store/timetable';

const store = useTimetableStore() as any;

const maxGap: Ref<number> = ref(store.maxGap ?? 2);

watch(maxGap, (val: number) => {
    if (val !== store.maxGap) store.maxGap = val;
});

watch(() => store.maxGap, (val: number) => {
    if (val !== maxGap.value) maxGap.value = val;
});
</script>

<style>
.MaxGapInput {
    color: var(--color-text-primary);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    width: 11rem;
}
</style>