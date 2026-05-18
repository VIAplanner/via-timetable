<template>
    <div class="flex flex-col gap-y-3">
        <div v-if="dateTimes.first && dateTimes.first.length">
            <h3 v-if="dateTimes.second && dateTimes.second.length" class="font-bold">First Session</h3>
            <DataTable :value="dateTimes.first" tableStyle="width: 100%">
                <Column field="time" header="Time" style="width: 75%" />
                <Column field="location" header="Location" style="width: 25%">
                    <template #body="slotProps">
                        <a v-if="slotProps.data.locationURL" :href="`${slotProps.data.locationURL}`" target="_blank"
                            rel="noopener noreferrer" class="text-text-secondary break-words"><u>{{
                                slotProps.data.location }}</u></a>
                        <span v-else class="break-words">{{ slotProps.data.location }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
        <div v-if="dateTimes.second && dateTimes.second.length">
            <h3 v-if="dateTimes.first && dateTimes.first.length" class="font-bold">Second Session</h3>
            <DataTable :value="dateTimes.second" tableStyle="width: 100%">
                <Column field="time" header="Time" style="width: 75%" />
                <Column field="location" header="Location" style="width: 25%">
                    <template #body="slotProps">
                        <a v-if="slotProps.data.locationURL" :href="`${slotProps.data.locationURL}`" target="_blank"
                            rel="noopener noreferrer" class="text-text-secondary break-words"><u>{{
                                slotProps.data.location }}</u></a>
                        <span v-else class="break-words">{{ slotProps.data.location }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    dateTimes: {
        type: Object,
        required: true
    }
});
</script>