<template>
    <div>
        <div v-if="event.start > 0">
            <v-dialog
                v-model="dialog"
                scrollable
                width="825px"
                @input="atInput"
            >
                <template v-slot:activator="{ on }">
                    <div
                        @mouseover="hovered = true"
                        @mouseleave="hovered = false"
                        v-on="on"
                        class="event"
                        :class="durationClass(event.start, event.end)"
                        :style="{ background: getCourseColor(event.code) }"
                    >
                        <h4 class="course-code">{{ event.code }}</h4>

                        <div class="lock-button">
                            <v-btn
                                dark
                                @click.stop="lockToggle"
                                v-if="locked"
                                icon
                            >
                                <v-icon>mdi-lock</v-icon>
                            </v-btn>
                            <v-btn
                                dark
                                @click.stop="lockToggle"
                                v-if="!locked && hovered"
                                icon
                            >
                                <v-icon>mdi-lock-open</v-icon>
                            </v-btn>
                        </div>

                        <div style="margin-left: 3px;">
                            {{ event.sectionCode }}
                        </div>

                        <div style="position: relative;">
                            <div class="align-left">
                                {{ getFormattedTime(event.start, event.end) }}
                            </div>
                            <div class="align-right">{{ event.location }}</div>
                        </div>
                    </div>
                </template>
                <course-section-picker
                    v-on:done="dialog = false"
                    :code="event.code"
                    ref="popUp"
                />,
            </v-dialog>
        </div>
        <div
            v-else
            class="event empty-event one-hour"
            :style="dynamicColor"
            @mouseover="
                dynamicColor = { background: '#e6e6e6' };
                hovered = true;
            "
            @mouseleave="
                if (!locked) {
                    dynamicColor = { background: 'white' };
                }
                hovered = false;
            "
        >
            <div v-if="hovered || locked">
                <v-row>
                    <v-col>
                        <p class="center">{{ dynamicText }}</p>
                        <div style=" text-align:center;">
                            <v-btn
                                v-if="locked"
                                @click.stop="removeLockSection"
                                icon
                            >
                                <v-icon>mdi-lock</v-icon>
                            </v-btn>
                            <v-btn v-else @click.stop="addLockSection" icon>
                                <v-icon>mdi-lock-open</v-icon>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </div>
    </div>
</template>

<script>
import CourseSectionPicker from "../components/CourseSectionPicker";
import { mapGetters, mapActions, mapMutations } from "vuex";

const convertSecondsToHours = (seconds) => {
    return seconds / 3600;
};

export default {
    name: "timetable-event",
    props: {
        event: {
            type: Object,
            default: () => {},
        },
        currDay: {
            type: String,
            default: "",
        },
    },
    components: {
        CourseSectionPicker,
    },
    data() {
        return {
            locked: false,
            hovered: false,
            dialog: false,
            dynamicColor: { background: "white" },
            dynamicText: "Block This Time",
            data : {
                name: `Locked Section`,
                courseCode: `Lock${this.currDay}${this.event.currStart}`,
                meeting_sections: [
                    {
                        sectionCode: "L0001",
                        instructors: ["NA"],
                        times: [
                            {
                                day: this.currDay,
                                start: this.event.currStart * 3600,
                                end: this.event.currStart * 3600 + 3600,
                                location: "NA",
                            },
                        ],
                    },
                ],
            }
        };
    },
    computed: {
        ...mapGetters(["getCourseColor", "getLockedSections"]),
    },
    methods: {
        ...mapActions(["selectCourse", "deleteCourse"]),
        ...mapMutations(["lockSection", "unlockSection"]),
        atInput() {
            var courseSectionPicker = this.$refs.popUp;
            if (typeof courseSectionPicker != "undefined") {
                courseSectionPicker.resetSelectedMeetingSections();
            }
        },
        reverseLockStatus() {
            this.locked = !this.locked;
        },
        lockToggle() {
            this.$emit("toggleLock", {
                event: this.event,
                status: this.locked,
            });
        },
        durationClass(start, end) {
            const duration = convertSecondsToHours(end - start);
            if (duration === 1) {
                return "one-hour";
            } else if (duration === 2) {
                return "two-hours";
            } else if (duration === 3) {
                return "three-hours";
            }
        },
        getFormattedTime(start, end) {
            var s = (start / 3600) % 12;
            var e = (end / 3600) % 12;
            if (s == 0) {
                s = 12;
            }
            if (e == 0) {
                e = 12;
            }
            return `${s}:00 - ${e}:00`;
        },
        addLockSection() {
            this.reverseLockStatus();
            this.dynamicText = "Unblock This Time";
            this.selectCourse({ course: this.data });
            this.lockSection(`${this.data.courseCode}${this.data.meeting_sections[0].sectionCode}`)
        },
        removeLockSection() {
            this.reverseLockStatus();
            this.dynamicText = "Block This Time";
            this.unlockSection(`${this.data.courseCode}${this.data.meeting_sections[0].sectionCode}`)
            this.deleteCourse({code: this.data.courseCode})
        },
    },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
* {
    font-family: "Montserrat", sans-serif;
}

.center {
    color: black;
    text-align: center;
    margin: 0 !important;
}

.event {
    border: 0.2px solid gray;
    color: white;
    padding: 8px;
    position: relative;
    cursor: pointer;
}
.empty-event {
    background: white;
    border: 0.2px solid gray;
    cursor: default;
}
.one-hour {
    height: 84px;
}

.two-hours {
    height: 168px;
}

.three-hours {
    height: 252px;
}

.course-code {
    margin-bottom: 3px;
    margin-left: 3px;
}

.align-left {
    position: absolute;
    left: 3px;
}

.align-right {
    position: absolute;
    right: 5px;
}

.lock-button {
    position: absolute;
    right: 3px;
    top: 3px;
    z-index: 1;
}
</style>
