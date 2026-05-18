<template>
    <div>
        <CourseDetailsPopup v-for="card of visibleCards" :key="card.course" v-bind="card.props"
            @close="store.setDetailCardVisibility(card.course, false)" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimetableStore } from '../../store/timetable';

import CourseDetailsPopup from './CourseDetailsPopup.vue';

const store = useTimetableStore() as any;

const visibleCards = computed(() => {
    return store.cards.filter((card: { course: string, visible: boolean, props: any }) => card && card.visible);
})
</script>