<template>
    <div class="m-2">
        <label for="maxDayLengthInput" class="block mb-0 text-sm font-bold">Max Day Length</label>
        <InputNumber v-model="maxDayLength" suffix=" Hours" :min="1" :max="12" showButtons buttonLayout="stacked"
            inputClass="MaxDayLengthInput" placeholder="3 Hours" :pt:pcInputText:root:id="'maxDayLengthInput'" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useTimetableStore } from '../../../store/timetable';

const store = useTimetableStore() as any;

const maxDayLength: Ref<number> = ref(store.maxDayLength ?? 3);

watch(maxDayLength, (val: number) => {
    if (val !== store.maxDayLength) store.maxDayLength = val;
});

watch(() => store.maxDayLength, (val: number) => {
    if (val !== maxDayLength.value) maxDayLength.value = val;
});
</script>

<style>
.MaxDayLengthInput {
    color: var(--color-text-primary);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    width: 7.6rem;
}
</style>