<template>
    <div class="m-2">
        <label for="minDayLengthInput" class="block mb-0 text-sm font-bold">Min Day Length</label>
        <InputNumber v-model="minDayLength" suffix=" Hours" :min="1" :max="12" showButtons buttonLayout="stacked"
            inputClass="MinDayLengthInput" placeholder="3 Hours" :pt:pcInputText:root:id="'minDayLengthInput'" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { useTimetableStore } from '../../../store/timetable';

const store = useTimetableStore() as any;

const minDayLength: Ref<number> = ref(store.minDayLength ?? 3);

watch(minDayLength, (val: number) => {
    if (val !== store.minDayLength) store.minDayLength = val;
});

watch(() => store.minDayLength, (val: number) => {
    if (val !== minDayLength.value) minDayLength.value = val;
});
</script>

<style>
.MinDayLengthInput {
    color: var(--color-text-primary);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    width: 7.6rem;
}
</style>