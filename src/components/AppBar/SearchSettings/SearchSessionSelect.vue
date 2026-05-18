<template>
    <div>
        <h2 class="font-bold text-lg">
            Select Sessions
        </h2>
        <div v-for="sessionGroup of sessionGroups" :key="sessionGroup.group">
            <div class="gap-2 flex items-center">
                <RadioButton @change="handleSessionGroupChangeRequest(sessionGroup)" :inputId="sessionGroup.group"
                    :value="sessionGroup.group" name="sessionGroup" :modelValue="selectedSessionGroup" />
                <label :for="sessionGroup.group">{{ sessionGroup.label }}</label>
            </div>
            <div v-for="subsession of sessionGroup.subsessions" :key="subsession.value"
                class="pl-4 gap-2 flex items-center">
                <Checkbox v-model="selectedSubsessions" :inputId="subsession.value" :value="subsession.value"
                    name="subsession" :disabled="sessionGroup.group !== selectedSessionGroup" />
                <label :for="subsession.value">{{ subsession.label }}</label>
            </div>
        </div>
    </div>
    <ChangeSessionGroup v-model:visible="confirmDialogVisible" @cancel="cancelChange" @continue="confirmChange" />
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, Ref } from 'vue';
import { useTimetableStore } from '../../../store/timetable';
import ChangeSessionGroup from '../../Popup/ChangeSessionGroup.vue';
import { FIRST_SEM, SECOND_SEM, SessionData } from '../../../store/timetable.shared';

const store = useTimetableStore() as any;

const selectedSessionGroup = ref(store.selectedSessionGroup);
const selectedSubsessions = ref(Array.isArray(store.selectedSubsessions) ? [...store.selectedSubsessions] : []);

const sessionGroups: Ref<Array<SessionData>> = ref([]);
const confirmDialogVisible: Ref<boolean> = ref(false);
const pendingSessionGroup: Ref<SessionData | null> = ref(null);

/**
 * @brief Switches the session group, prompting the user to confirm if there is courses that will be deleted as a result
 * @param sessionGroup The session group being changed to
 */
function handleSessionGroupChangeRequest(sessionGroup: SessionData) {
    pendingSessionGroup.value = sessionGroup;

    if (
        Object.keys(store.selectedCourses[FIRST_SEM]).length > 0 ||
        Object.keys(store.selectedCourses[SECOND_SEM]).length > 0
    ) confirmDialogVisible.value = true;
    else confirmChange();
}

/**
 * @brief Cancels the session change request
 */
function cancelChange() {
    confirmDialogVisible.value = false;
    pendingSessionGroup.value = null;
}

/**
 * @brief Confirms the session change request, resetting the timetable since the course offerings will change
 */
function confirmChange() {
    if (pendingSessionGroup.value) {
        selectedSessionGroup.value = pendingSessionGroup.value.group;
        store.selectedSessionGroup = pendingSessionGroup.value.group;

        if (pendingSessionGroup.value.subsessions)
            selectedSubsessions.value = pendingSessionGroup.value.subsessions.map(subsession => subsession.value);
    }

    confirmDialogVisible.value = false;
    pendingSessionGroup.value = null;
    store.resetTimetable();
}

watch(() => store.selectedSessionGroup, (val: string) => {
    if (val !== selectedSessionGroup.value) selectedSessionGroup.value = val;
});

watch(selectedSubsessions, (val: Array<string>) => {
    if (JSON.stringify(val) !== JSON.stringify(store.selectedSubsessions)) store.selectedSubsessions = val;
});

watch(() => store.selectedSubsessions, (val: Array<string>) => {
    if (JSON.stringify(val) !== JSON.stringify(selectedSubsessions.value)) selectedSubsessions.value = [...val || []];
});

watchEffect(async () => {
    sessionGroups.value = await store.getSessions();
});
</script>