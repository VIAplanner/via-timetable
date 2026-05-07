<template>
    <div class="bg-coursecard-background rounded-md p-3">
        <div class="flex flex-col gap-3 lg:flex-row lg:justify-between">
            <div class="flex flex-row gap-x-5 items-start">
                <RadioButton v-model="sectionType.field" :inputId="section.name" :value="section.name" />
                <h2 class="text-md font-bold">
                    <span v-if="sectionConflicts.length === 0">
                        {{ section.name }}
                    </span>
                    <span v-else class="text-yellow-500"
                        v-tooltip.bottom="tooltip(`Conflicts with ${sectionConflicts.join(', ')}`)">
                        {{ section.name }}
                    </span>
                    <span> ({{ getSectionDeliveryType(section.meetingTimes) }}) </span>
                    <span v-if="section.openLimitInd === 'C'"
                        v-tooltip.bottom="tooltip('You may not be able to enrol in this section on Acorn at this time')"
                        class="text-yellow-500">
                        (Unavailable)
                    </span>
                </h2>
            </div>
            <a v-if="courseData.campus === 'University of Toronto at Mississauga'"
                :href="`https://metis.utm.utoronto.ca/CourseInfo/syllabus_display.php?course=${courseData.code}/${courseData.sectionCode}/${section.name}/${section.deliveryModes[0].session}`"
                target="_blank" rel="noopener noreferrer" class="text-text-secondary self-start lg:self-auto">
                <u>View Syllabus</u>
            </a>
        </div>
        <div class="flex flex-col gap-4 lg:flex-row">
            <div class="w-full lg:w-1/2 p-4 bg-timetablesettings-background rounded-md mt-2 lg:mr-3">
                <CourseTimetable :dateTimes="parseMeetingTimes(section.meetingTimes)" />
            </div>
            <div class="w-full lg:w-1/2">
                <!-- Instructors -->
                <p>
                    <span class="font-medium">Instructors: </span>
                    <span v-if="section.instructors && section.instructors.length">
                        {{section.instructors.map((instructor: any) => `${instructor.firstName}
                        ${instructor.lastName}`).join(', ') }}
                    </span>
                    <span v-else>To be assigned</span>
                </p>
                <!-- Availability -->
                <p>
                    <span class="font-medium">Availability: </span>
                    <span
                        :class="getAvailabilityHighlight((section.maxEnrolment - section.currentEnrolment) / section.maxEnrolment)">
                        {{ section.maxEnrolment - section.currentEnrolment }} / {{ section.maxEnrolment }}
                    </span>
                </p>
                <!-- Waitlist -->
                <p v-if="section.currentWaitlist">
                    <span class="font-medium">Waitlist: </span>
                    <span :class="getWaitlistHighlight(section.currentWaitlist / section.maxEnrolment)"
                        v-tooltip.right="tooltip('You are likely to get past the waitlist if your position is within 10% of the class size')">
                        {{ section.currentWaitlist }}
                    </span>
                </p>
                <!-- Enrolment Indicators -->
                <div class="flex flex-col gap-1">
                    <div v-if="section.enrolmentInd" class="flex flex-row items-center gap-x-3">
                        <p><span class="font-medium">Enrolment Controls: </span>{{ section.enrolmentInd }}</p>
                        <EnrolmentLegendPopup
                            v-if="divisionalData && divisionalEnrolmentIndicator && divisionalEnrolmentIndicator.codes"
                            :enrolmentIndicators="divisionalEnrolmentIndicator.codes"
                            :division="`${courseData.faculty.name} (${courseData.faculty.code})`"
                            :highlights="[section.enrolmentInd]" />
                    </div>
                    <button v-if="section.enrolmentControls && section.enrolmentControls.length" type="button"
                        class="self-start text-text-secondary no-underline underline-offset-2 hover:underline"
                        @click="showEnrolmentControls = !showEnrolmentControls" :aria-expanded="showEnrolmentControls">
                        {{ showEnrolmentControls ? 'Hide enrolment controls' : 'Show enrolment controls' }}
                    </button>
                    <div v-if="showEnrolmentControls">
                        <ul class="list-disc pl-2">
                            <li v-for="control in section.enrolmentControls" :key="control">
                                {{ control }}
                            </li>
                        </ul>
                    </div>
                </div>
                <br>
                <!-- Notes -->
                <div v-if="notes && notes.length > 0" class="ml-0">
                    <span class="font-medium">Notes: </span>
                    <ul class="list-disc pl-2">
                        <li v-for="note in notes" :key="note.name">{{ note.content.replace(/<[^>]*>/g, '') }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref, PropType } from 'vue';
import { useTimetableStore } from '../../store/timetable';
import EnrolmentLegendPopup from './EnrolmentLegendPopup.vue';
import CourseTimetable from './CourseTimetable.vue';
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip';
import { DAYS } from '../../store/timetable.shared';

const store = useTimetableStore() as any;
const { tooltip } = useResponsiveTooltip();
const showEnrolmentControls: Ref<boolean> = ref(false);

const props = defineProps({
    sectionType: {
        type: Object,
        required: true
    },
    section: {
        type: Object,
        required: true
    },
    courseData: {
        type: Object,
        required: true
    },
    divisionalData: {
        type: Object as PropType<Record<string, any> | undefined>,
        required: false
    }
});

const notes = computed(() => {
    return props.section.notes.filter((note: any) => note.content)
});

const sectionConflicts = computed(() => {
    const conflicts = [];

    for (const session of props.courseData.sessions) {
        conflicts.push(...conflictsInSession(session))
    }

    return conflicts;
});

/**
 * @brief Returns a list of course activities that conflict with the course given in props
 * @param sessionCode The session to check conflicts in
 * @returns A list of course activities that conflict in the format '{ course name } { activity name }'
 */
function conflictsInSession(sessionCode: string): Array<string> {
    const conflicts: Array<string> = [];
    const currentMeetingTimes = Object.values(props.section.meetingTimes);

    const session = store.subsessionCodeToSession(sessionCode);
    if (!session) return conflicts;

    const sessionsToCheck = session === 'Y' ? ['F', 'S'] : [session];

    for (const meetingTime of currentMeetingTimes as Array<any>) {
        if (meetingTime.sessionCode !== sessionCode) continue;

        const currentStart = parseInt(meetingTime.start);
        const currentEnd = parseInt(meetingTime.end);

        for (const semester of sessionsToCheck) {
            const selectedSessionTimetable = store.timetables[semester];
            if (!selectedSessionTimetable) continue;

            const dayName = parseDayFull(meetingTime.day);
            const dayEvents = selectedSessionTimetable[dayName];

            if (!dayEvents || dayEvents.length === 0) continue;

            for (const event of dayEvents) {
                if (event.course === props.courseData.code && event.activity.substring(0, 3) === props.sectionType.key)
                    continue;

                const eventStart = parseInt(event.start);
                const eventEnd = parseInt(event.end);

                if (
                    currentStart < eventEnd && currentEnd > eventStart &&
                    !conflicts.includes(`${event.course} ${event.activity}`)
                ) {
                    conflicts.push(`${event.course} ${event.activity}`)
                }
            }
        }
    }

    return conflicts;
}

const divisionalEnrolmentIndicator = computed(() => {
    return props.divisionalData?.divisionalEnrolmentIndicators?.data?.data?.find(
        (indicator: any) => indicator.division === props.courseData.faculty.code
    );
});

/**
 * @brief Returns whether a course is online, in person, or hybrid based on its timeslots
 * @param timeslots The timeslots of the course
 * @return Either 'Online', 'Hybrid', or 'In Person'
 */
function getSectionDeliveryType(timeslots: Array<any>): string {
    const regularSlots = timeslots.filter(timeslot => timeslot.building.buildingCode !== 'ZZ');

    var online = 0;
    var inPer = 0;

    for (const timeslot of regularSlots) {
        if (timeslot.building.buildingCode.length) inPer++;
        else online++;
    }

    if (online === regularSlots.length) return 'Online';
    else if (online) return 'Hybrid';
    else return 'In Person';
}

/**
 * @brief Returns a HTML class name that will apply a highlight effect for the availability of a course section based on
 * the ratio of available slots to total slots for the section
 * @param ratio The ratio of available slots to total slots
 * @returns Either 'highlightGreen', if there is a lot of room, down to 'highlightYellow' and 'highlightRed' as the
 * ratio decreases
 */
function getAvailabilityHighlight(ratio: number): string {
    if (ratio >= 0.5) return 'highlightGreen';
    else if (ratio > 0) return 'highlightYellow';
    else return 'highlightRed';
}

/**
 * @brief Returns a HTML class name that will apply a highlight effect for the waitlist count of a course section based
 * on the ratio of the current waitlist to the total class size of the section
 * @param ratio The ratio of the current waitlist size to the total class size of the section
 * @returns Either 'highlightGreen' if the ratio is low (good) or 'highlightYellow' or 'highlightRed' as the ratio
 * increases
 */
function getWaitlistHighlight(ratio: number): string {
    if (ratio > 0.2) return 'highlightRed';
    else if (ratio > 0.1) return 'highlightYellow';
    else return 'highlightGreen';
}

/**
 * @brief Encodes the date and location data for all meeting times of a course in by session, with each meeting time
 * having ZZ sections last
 * @param meetingTimes The meeting times of the course
 * @returns The formatted and ordered meeting time data keyed by 'first' and 'second' for the semester, mapping to a
 * sorted array of meeting times containing a time, location, and URL to a map showing the location
 */
function parseMeetingTimes(meetingTimes: any) {
    let result: Record<string, Array<any>> = {}

    for (const meetingTime of Object.values(meetingTimes) as Array<any>) {
        if (!Object.keys(result).includes(meetingTime.sessionCode)) result[meetingTime.sessionCode] = [];

        const formattedMeetingTime = {
            time: `${parseDay(meetingTime.day)} ${store.parseTime(meetingTime.start)} - ${store.parseTime(meetingTime.end)}`,
            location: meetingTime.building.buildingCode ? meetingTime.building.buildingCode : 'Online',
            locationURL: meetingTime.building.buildingUrl
        };

        const sessionCode: string = meetingTime.sessionCode;
        if (sessionCode) result[sessionCode]!.push(formattedMeetingTime);
    }

    let formattedResult: Record<string, any> = {
        first: null,
        second: null
    };

    for (const session of Object.keys(result) as Array<string>) {
        for (let i = 0; i < result[session]!.length; i++) {
            if (result[session]![i].location === 'ZZ') result[session]!.push(result[session]!.splice(i, 1)[0]);
        }

        if (['9', '5F', '5'].includes(session.substring(4))) formattedResult.first = result[session];
        else formattedResult.second = result[session];
    }

    return formattedResult;
}

/**
 * @brief Converts a day number into its full name (ex. 1 -> 'Monday')
 * @param dayInt The day number
 * @returns The day name
 */
function parseDayFull(dayInt: number): string {
    if (dayInt < 1 || dayInt > 7) return '';
    return DAYS[dayInt - 1] as string;
}

/**
 * @brief Converts a day number into its shortened name (ex. 1 -> 'Mon')
 * @param dayInt The day number
 * @returns The shortened day name
 */
function parseDay(dayInt: number): string {
    return parseDayFull(dayInt)!.substring(0, 3);
}
</script>

<style scoped>
.highlightRed {
    padding: 0 0.3rem;
    border-radius: 4px;
    border: 1px solid #ff4242;
    background-color: #f66;
}

.highlightYellow {
    padding: 0 0.3rem;
    border-radius: 4px;
    border: 1px solid #fddc20;
    background-color: #fde143;
}

.highlightGreen {
    padding: 0 0.3rem;
    border-radius: 4px;
    border: 1px solid #8ae736;
    background-color: #9deb56;
}
</style>