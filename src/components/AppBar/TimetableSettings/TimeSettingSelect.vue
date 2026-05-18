<template>
    <div class="m-2">
        <label class="block mb-0 text-sm font-bold">
            {{ label }}
            <Select v-model="internalValue" :options="times" optionLabel="display" optionValue="numerical" filter
                :pt:root:class="'border-transparent hover:border-active w-30 font-normal !shadow-md'"
                :pt:overlay:class="'border-none'" :pt:option:class="'TimeSettingOption'"
                :pt:pcFilter:root:class="'text-text-primary rounded-sm focus-within:outline-none caret-text-primary pl-3 py-2 bg-content-hover-background'" />
        </label>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { TIMES } from '../../../store/timetable.shared';

const times: Ref<Array<{ display: string, numerical: number }>> = ref([...TIMES]);

const props = defineProps({
    output: {
        type: [Object, Number],
    },
    label: {
        type: String,
        default: 'Enter time'
    },
    defaultValue: {
        type: String,
        default: '9 AM'
    }
});

const emit = defineEmits(['update:output']);

const internalValue: Ref<string | number> = ref((props.output ?? props.defaultValue) as string | number);

watch(internalValue, (val) => {
    emit('update:output', val)
});
</script>

<style>
.TimeSettingOption:hover {
    background-color: var(--color-content-hover-background);
}
</style>