<template>
    <v-container class="background">
        <v-row>
            <NoTimetablePopup></NoTimetablePopup>
            <v-col class="time-axis">
                <div class="top-margin"></div>
                <div v-for="time in timeRange" :key="time" class="time-axis-number">
                    <h3 class="time-label">{{ time }}</h3>
                </div>
            </v-col>
            <v-col cols="11">
                <v-row name="week-days-axis">
                    <v-col v-for="weekday in weekdays" :key="weekday">
                        <weekday-switch :weekday="weekday"></weekday-switch>
                    </v-col>
                </v-row>
                <v-row name="timetable-content">
                    <v-col v-for="(meetingSections, day) in timetable" :key="day">
                        <div
                            v-for="event in getEventsForDay(meetingSections)"
                            :key="event.start"
                        >
                            <timetable-event :event="event" v-if="event.start > 0" />
                            <timetable-event :event="event" v-else :currDay="day" />
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import TimetableEvent from "./TimetableEvent";
import NoTimetablePopup from "./NoTimetablePopup";
import WeekdaySwitch from "./WeekdaySwitch";
import { mapMutations, mapGetters } from "vuex";

const convertSecondsToHours = (seconds) => {
    return seconds / 3600;
};

export default {
    name: "Timetable",
    components: {
        TimetableEvent,
        WeekdaySwitch,
        NoTimetablePopup,
    },
    props: {
        timetable: {
            type: Object,
        },
    },
    computed: {
        ...mapGetters(["getLockedSections"]),
        timetableStart() {
            var earliest = 9;
            for (let day in this.timetable) {
                const dayEvents = this.timetable[day];
                for (let event of dayEvents) {
                    const start = convertSecondsToHours(event.start);
                    if (start < earliest && !event.code.includes("Lock")) {
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
                    if (end > latest && !event.code.includes("Lock")) {
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
        getEventsForDay(meetingSections) {
            const result = [];
            let currTime = this.timetableStart;
            let invalidStart = -1;
            if (meetingSections.length === 0) {
                for (let j = 0; j < this.timetableEnd - this.timetableStart; j++) {
                    result.push({
                        start: invalidStart,
                        currStart: (currTime + j) * 3600,
                        currEnd: (currTime + j + 1) * 3600,
                    });
                    invalidStart--;
                }
                return result;
            }
            for (let i = 0; i < meetingSections.length; i++) {
                const event = meetingSections[i];
                let eventStart = convertSecondsToHours(event.start);
                let eventEnd = convertSecondsToHours(event.end);
                // Pad empty events before the start of the first class
                // one hour
                if (Number.isInteger(eventStart - currTime)) {
                    for (let j = 0; j < eventStart - currTime; j++) {
                        result.push({
                            start: invalidStart,
                            currStart: (currTime + j) * 3600,
                            currEnd: (currTime + j + 1) * 3600,
                        });
                        invalidStart--;
                    }
                } else {
                    //there is half hour exist
                    //previous end time is one hour
                    if (Number.isInteger(currTime)) {
                        for (let j = 0; j < eventStart - currTime - 1; j++) {
                            result.push({
                                start: invalidStart,
                                currStart: (currTime + j) * 3600,
                                currEnd: (currTime + j + 1) * 3600,
                            });
                            invalidStart--;
                        } //pushing in half hour
                        result.push({
                            start: invalidStart,
                            currStart: (eventStart - 0.5) * 3600,
                            currEnd: eventStart * 3600,
                        });
                        invalidStart--;
                    // previous end time is full hour
                    } else {
                        result.push({
                            start: invalidStart,
                            currStart: currTime * 3600,
                            currEnd: (currTime + 0.5) * 3600,
                        });
                        invalidStart--;
                        for (let j = 0; j < eventStart - (currTime + 0.5); j++) {
                            result.push({
                                start: invalidStart,
                                currStart: (currTime + 0.5 + j) * 3600,
                                currEnd: (currTime + 0.5 + j + 1) * 3600,
                            });
                            invalidStart--;
                        }
                    }
                    
                }
                // if the section is a user locked section, pass it in as a locked event
                if (event.code.includes("Lock")) {
                    result.push({
                        start: invalidStart,
                        currStart: event.start,
                        currEnd: event.start + 3600,
                    });
                    invalidStart--;
                } else {
                    event["currStart"] = event.start;
                    result.push(event);
                }
                currTime = eventEnd;
                //If last event, pad empty events after it
                if (i === meetingSections.length - 1) {
                    //half hour
                    if (!Number.isInteger(currTime)) {
                        result.push({
                            start: invalidStart,
                            currStart: currTime * 3600,
                            currEnd: (currTime + 0.5) * 3600,
                        });
                        invalidStart--;
                        currTime = currTime + 0.5;
                    }
                    for (let k = 0; k < this.timetableEnd - currTime; k++) {
                        result.push({
                            start: invalidStart,
                            currStart: (currTime + k) * 3600,
                            currEnd: (currTime + k + 1) * 3600,
                        });
                        invalidStart--;
                    }
                }
            }
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
</style>
