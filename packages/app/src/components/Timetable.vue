<template>
    <v-container class="background">
        <v-row>
            <v-col class="time-axis">
                <div class="top-margin"></div>
                <div v-for="time in timeRange" :key="time" class="time-axis-number">
                    <h3 class="time-label">{{ time }}</h3>
                </div>
            </v-col>
            <v-col cols="11">
                <v-row name="week-days-axis">
                    <v-col v-for="weekday in weekdays" :key="weekday">
                        <h2 class="day-label">{{ weekday }}</h2>
                    </v-col>
                </v-row>
                <v-row name="timetable-content">
                    <v-col v-for="(meetingSections, day) in timetable" :key="day">
                        <div
                            v-for="event in getEventsForDay(meetingSections)"
                            :key="event.start"
                        >
                            <timetable-event
                                :event="event"
                                ref="timetableEvent"
                                @toggleLock="onLockToggle"
                                v-if="event.start > 0"
                            />
                            <timetable-event :event="event" v-else :currDay="day"/>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import TimetableEvent from "./TimetableEvent";
import { mapMutations, mapGetters } from "vuex";

const convertSecondsToHours = (seconds) => {
    return seconds / 3600;
};

export default {
    name: "Timetable",
    components: {
        TimetableEvent,
    },
    props: {
        timetable: {
            type: Object,
        },
    },
    updated() {
        this.updateSectionLockStatus();
    },
    computed: {
        ...mapGetters(["getLockedSections"]),
        timetableStart() {
            var earliest = 9;
            for (let day in this.timetable) {
                const dayEvents = this.timetable[day];
                for (let event of dayEvents) {
                    const start = convertSecondsToHours(event.start);
                    if (start < earliest) {
                        earliest = start;
                    }
                }
            }
            return earliest;
        },
        timetableEnd() {
            var latest = 18;
            for (let day in this.timetable) {
                const dayEvents = this.timetable[day];
                for (let event of dayEvents) {
                    const end = convertSecondsToHours(event.end);
                    if (end > latest) {
                        latest = end;
                    }
                }
            }
            return latest;
        },
        timeRange() {
            const result = [];
            for (let i = this.timetableStart; i <= this.timetableEnd; i++) {
                if (i > 12) {
                    result.push(`${i % 12} PM`);
                } else if (i == 12) {
                    result.push(`${12} PM`);
                } else {
                    result.push(`${i % 12} AM`);
                }
            }
            return result;
        },
    },
    data() {
        return {
            colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
            weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        };
    },
    methods: {
        ...mapMutations(["lockSection", "unlockSection"]),
        updateSectionLockStatus() {
            for (var ref of this.$refs.timetableEvent) {
                ref.locked = false;
                for (var lockedSection of this.getLockedSections) {
                    if (
                        lockedSection.localeCompare(
                            `${ref.event.code}${ref.event.sectionCode}`
                        ) == 0
                    ) {
                        ref.locked = true;
                        break;
                    }
                }
            }
        },
        onLockToggle(payload) {
            for (var ref of this.$refs.timetableEvent) {
                if (
                    ref.event.code == payload.event.code &&
                    ref.event.sectionCode == payload.event.sectionCode
                ) {
                    ref.reverseLockStatus();
                }
            }
            if (payload.status == true) {
                this.unlockSection(`${payload.event.code}${payload.event.sectionCode}`);
            } else {
                this.lockSection(`${payload.event.code}${payload.event.sectionCode}`);
            }
        },
        getEventsForDay(meetingSections) {
            const result = [];
            let currTime = this.timetableStart;
            let invalidStart = -1;
            if (meetingSections.length === 0) {
                for (let j = 0; j < this.timetableEnd - this.timetableStart; j++) {
                    result.push({ start: invalidStart, currStart: currTime + j });
                    invalidStart--;
                }
                return result;
            }
            for (let i = 0; i < meetingSections.length; i++) {
                const event = meetingSections[i];
                const eventStart = convertSecondsToHours(event.start);
                const eventEnd = convertSecondsToHours(event.end);
                // Pad empty events before the start of the first class
                for (let j = 0; j < eventStart - currTime; j++) {
                    result.push({ start: invalidStart, currStart: currTime + j });
                    invalidStart--;
                }
                result.push(event);
                currTime = eventEnd;

                //If last event, pad empty events after it
                if (i === meetingSections.length - 1) {
                    for (let k = 0; k < this.timetableEnd - currTime; k++) {
                        result.push({ start: invalidStart, currStart: currTime + k });
                        invalidStart--;
                    }
                }
            }
            console.log(result);
            return result;
        },
    },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
* {
    font-family: "Montserrat", sans-serif;
}
.col {
    padding: 0px !important;
}

.background {
    background-color: white;
    border-radius: 16px;
}

.container {
    padding: 24px !important;
}

.time-axis-number {
    height: 84px;
}

.top-margin {
    margin-bottom: 35px;
}

.time-axis {
    margin-right: 25px;
}

.time-label {
    text-align: right;
}

.day-label {
    margin-bottom: 16px;
    text-align: center;
}
</style>
