<template>
    <div class="flex h-full items-center">
        <Button label="Build Timetable" icon="pi pi-calendar" iconPos="left" class="text-white"
            @click="() => store.generateTimetable()" />
    </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable';
const store = useTimetableStore() as any;
</script>