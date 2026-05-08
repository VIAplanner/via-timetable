<template>
    <div>
        <Dialog v-model:visible="visible"
            class="w-[calc(100vw-1rem)] h-[calc(100dvh-4rem)] my-4 lg:w-[70vw] lg:h-[60vh] lg:my-0 overflow-hidden"
            :style="{ 'max-height': 'calc(100dvh - 4rem)' }" :draggable="false" @update:visible="handleVisibleUpdate">
            <!-- Header -->
            <template #header>
                <div class="flex flex-col gap-3 w-full items-start lg:flex-row lg:justify-between lg:items-center">
                    <h2 class="text-xl lg:text-2xl font-bold leading-tight wrap-break-word">
                        {{ `${courseData.code} ${courseData.sectionCode} - ${courseData.name}` }}
                    </h2>
                    <Button @click="addCourse()" icon="pi pi-plus" label="Quick Add Course"
                        class="hidden lg:inline-flex lg:mr-3" :pt:icon:class="'text-white'"
                        :pt:label:class="'text-white'" />
                </div>
            </template>
            <div class="flex justify-center mb-4 lg:hidden">
                <Button @click="addCourse()" icon="pi pi-plus" label="Quick Add Course" class="w-full max-w-xs"
                    :pt:icon:class="'text-white'" :pt:label:class="'text-white'" />
            </div>
            <div class="flex h-full flex-col gap-4 overflow-y-auto pr-1">
                <!-- Icon Bar -->
                <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
                    <!-- Campus -->
                    <span class="flex items-center gap-2">
                        <i class="pi pi-home"></i>
                        <span class="wrap-break-word">{{ courseData.campus }}</span>
                    </span>
                    <!-- Session -->
                    <span class="flex items-center gap-2">
                        <i class="pi pi-clock"></i>
                        <span class="wrap-break-word">{{ parseSession(courseData.sessions) }}</span>
                    </span>
                    <!-- Distribution Requirement -->
                    <span class="flex items-center gap-2">
                        <i class="pi pi-graduation-cap"></i>
                        <span class="wrap-break-word">{{ courseData.maxCredit }} Credits ({{
                            parseDistributionRequirements(courseData.breadths) }})</span>
                    </span>
                    <!-- View Legend Button -->
                    <div v-if="divisionalData && divisionalLegend.content"
                        class="flex w-full justify-center sm:w-auto sm:justify-start">
                        <DivisionalLegend :division="`${courseData.faculty.name} (${courseData.faculty.code})`"
                            :content="divisionalLegend.content" />
                    </div>
                </div>

                <!-- Info Blocks -->
                <div class="w-full flex flex-col gap-6 lg:flex-row lg:gap-0">
                    <div class="w-full lg:w-[60%] lg:pr-8">
                        <h3 class="text-md font-bold">Description</h3>
                        <!-- Description -->
                        <p class="wrap-break-word">{{ courseData.cmCourseInfo.description }}</p>
                        <h3 class="text-md font-bold mt-3">Department Info</h3>
                        <!-- Department -->
                        <p class="wrap-break-words"><span class="font-medium">Department: </span>{{
                            courseData.department.name }}</p>
                        <!-- Faculty -->
                        <p class="wrap-break-word"><span class="font-medium">Faculty: </span>{{ courseData.faculty.name }}
                        </p>
                    </div>
                    <div class="flex flex-col w-full lg:w-[40%]">
                        <h3 class="text-md font-bold">Requisite Info</h3>
                        <p v-if="courseData.cmCourseInfo.prerequisitesText" class="wrap-break-word"><span
                                class="font-medium">Prerequisites: </span>{{ courseData.cmCourseInfo.prerequisitesText
                            }}</p>
                        <!-- Prerequisites -->
                        <p v-if="courseData.cmCourseInfo.exclusionsText" class="wrap-break-word"><span
                                class="font-medium">Exclusions:
                            </span>{{ courseData.cmCourseInfo.exclusionsText }}</p> <!-- Exclusions -->
                        <p v-if="courseData.cmCourseInfo.corequisitesText" class="wrap-break-word"><span
                                class="font-medium">Corequisites: </span>{{ courseData.cmCourseInfo.corequisitesText }}
                        </p>
                        <!-- Corequisites -->
                        <p v-if="courseData.cmCourseInfo.recommendedPreparation" class="wrap-break-word"><span
                                class="font-medium">Recommended Preparation: </span>{{
                                    courseData.cmCourseInfo.recommendedPreparation }}</p> <!-- Recommended Prep -->
                    </div>
                </div>
                <!-- Section List -->
                <Accordion :value="['0']" :multiple="true">
                    <template v-for="type in sectionTypes" :key="type.key">
                        <AccordionPanel v-if="courseData.sections.some((section: any) => section.type === type.label)"
                            :value="type.key">
                            <AccordionHeader>
                                <h2 class="text-lg font-bold">{{ type.label }}s</h2>
                            </AccordionHeader>
                            <AccordionContent
                                v-for="section in courseData.sections
                                    .filter((section: any) => section.type === type.label)
                                    .sort((s1: any, s2: any) =>
                                        parseInt(s1.name.match(/\d+(?!\d)/)) - parseInt(s2.name.match(/\d+(?!\d)/)))"
                                :key="section.name">
                                <CourseDetailsSectionCard :sectionType="type" :section="section"
                                    :courseData="courseData" :divisionalData="divisionalData" />
                            </AccordionContent>
                        </AccordionPanel>
                    </template>
                </Accordion>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, nextTick, onMounted } from 'vue';
import { useTimetableStore } from '../../store/timetable';
import DivisionalLegend from './DivisionalLegend.vue';
import CourseDetailsSectionCard from './CourseDetailsSectionCard.vue';
import { FIRST_SEM, SECOND_SEM } from '../../store/timetable.shared';

const store = useTimetableStore() as any;

const visible: Ref<boolean> = ref(true);

const selectedLec: Ref<string | null> = ref(null);
const selectedTut: Ref<string | null> = ref(null);
const selectedPra: Ref<string | null> = ref(null);
const suppressSelectionWatchers: Ref<boolean> = ref(false);

/**
 * @brief Fetches the course JSON from the store for a course code
 * @param courseCode The course code
 * @returns The course JSON
 */
function getSelectedCourseWrapper(courseCode: string) {
    const selectedSessionCourses = store.selectedCourses[store.selectedSession] || {};
    if (selectedSessionCourses[courseCode]) return selectedSessionCourses[courseCode];
    return store.selectedCourses[FIRST_SEM]?.[courseCode] || store.selectedCourses[SECOND_SEM]?.[courseCode] || null;
}

/**
 * @brief Initializes the selections of the lecture, tutorial, and practical fields to their current store values
 * for the course provided in props
 */
async function syncSelectedSectionsFromStore() {
    const selectedCourse = getSelectedCourseWrapper(props.courseData.code);

    suppressSelectionWatchers.value = true;
    selectedLec.value = selectedCourse?.lec || null;
    selectedTut.value = selectedCourse?.tut || null;
    selectedPra.value = selectedCourse?.pra || null;
    await nextTick();
    suppressSelectionWatchers.value = false;
}

watch(selectedLec, (val: string | null) => {
    if (suppressSelectionWatchers.value || !val) return;
    store.timetableModifyActivity(props.courseData, val, true);
    store.saveStateHistory();
});

watch(selectedTut, (val: string | null) => {
    if (suppressSelectionWatchers.value || !val) return;
    store.timetableModifyActivity(props.courseData, val, true);
    store.saveStateHistory();
});

watch(selectedPra, (val: string | null) => {
    if (suppressSelectionWatchers.value || !val) return;
    store.timetableModifyActivity(props.courseData, val, true);
    store.saveStateHistory();
});

const sectionTypes = [
    { key: 'LEC', label: 'Lecture', field: selectedLec },
    { key: 'TUT', label: 'Tutorial', field: selectedTut },
    { key: 'PRA', label: 'Practical', field: selectedPra }
];

const props = defineProps({
    courseData: {
        type: Object,
        required: true
    },
    divisionalData: {
        type: Object,
        required: false
    }
});

const divisionalLegend = computed(() => {
    return props?.divisionalData?.divisionalLegends.data.data.find(
        (legend: any) => legend.division === props.courseData.faculty.code
    );
});

onMounted(syncSelectedSectionsFromStore);

watch(() => props.courseData.code, () => {
    syncSelectedSectionsFromStore();
}, { immediate: true });

/**
 * @brief Adds a course to the timetable and closes the detail card
 */
async function addCourse() {
    // Close via store visibility so the card unmounts and can be reopened cleanly.
    store.setDetailCardVisibility(`${props.courseData.code} ${props.courseData.sectionCode}`, false);
    visible.value = false;

    // Remove any old references to prevent duplicates
    await store.removeCourse(props.courseData.code, false);

    const lecs = props.courseData.sections.filter((section: any) => section.type === 'Lecture');
    const tuts = props.courseData.sections.filter((section: any) => section.type === 'Tutorial');
    const pras = props.courseData.sections.filter((section: any) => section.type === 'Practical');
    const lec = lecs.length > 0 ? lecs[0].name : null;
    const tut = tuts.length > 0 ? tuts[0].name : null;
    const pra = pras.length > 0 ? pras[0].name : null;

    suppressSelectionWatchers.value = true;
    selectedLec.value = lec;
    selectedTut.value = tut;
    selectedPra.value = pra;
    await nextTick();
    suppressSelectionWatchers.value = false;

    await store.addCourse(props.courseData.code, lec, tut, pra, props.courseData);
    store.saveStateHistory();
}

/**
 * @brief Converts an array of sessions that a course spans into a single readable string
 * @param sessions The sessions the course spans
 */
function parseSession(sessions: Array<string>): string {
    return sessions.map((session: string) => {
        if (session.length < 5) return 'INVALID_DATE';

        const year = session.substring(0, 4);
        const month = session.substring(4, 5);

        const sessionName = session.length === 6 ?
            (session.substring(6) === FIRST_SEM ? 'Summer First Subsession' : 'Summer Second Subsession') :
            (month === '9' ? 'Fall' : 'Winter');

        return `${year} ${sessionName}`;
    }).join(' - ');
}

/**
 * @brief Converts an array of distribution requirements into a single readable string
 * @param distributionRequirements The distribution requirements
 */
function parseDistributionRequirements(distributionRequirements: Array<string>) {
    return distributionRequirements.map((distribution: any) => {
        return distribution.breadthTypes && distribution.breadthTypes.length ? distribution.breadthTypes[0].type : '';
    }).filter((requirement: string) => requirement).join(', ')
}

const handleVisibleUpdate = (value: boolean) => {
    if (!value) store.setDetailCardVisibility(`${props.courseData.code} ${props.courseData.sectionCode}`, false);
}
</script>