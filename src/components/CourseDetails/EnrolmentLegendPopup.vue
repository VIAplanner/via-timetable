<template>
    <Button @click="open = true" label="View Legend" size="small" :pt:icon:class="'text-white'"
        :pt:label:class="'text-white'" />
    <Dialog v-model:visible="open" modal :showHeader="true" class="p-0 md:p-[1rem] w-[100vw] lg:w-75vw max-w-50rem"
        :draggable="false" :header="`${division} Enrolment Legend`">
        <div class="flex flex-col items-end">
            <div class="mt-3">
                <ul v-for="enrolmentIndicator in enrolmentIndicators" :key="enrolmentIndicator.code">
                    <li :class="highlights.includes(enrolmentIndicator.code) ? 'enrolmentHighlight' : ''">
                        <span class="font-medium">{{ enrolmentIndicator.code }}</span> - <span>{{
                            enrolmentIndicator.name }}</span>
                    </li>
                    <br>
                </ul>
            </div>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

const open: Ref<boolean> = ref(false);

const props = defineProps({
    enrolmentIndicators: {
        type: Object,
        required: true
    },
    division: {
        type: String,
        required: true
    },
    highlights: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.enrolmentHighlight {
    background-color: var(--color-divisional-highlight);
    border-radius: 4px;
}
</style>