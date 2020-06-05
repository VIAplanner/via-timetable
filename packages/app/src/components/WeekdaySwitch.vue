<template>
    <v-tooltip top>
        <template v-slot:activator="{ on }">
            <v-row
                @mouseover="hovered = true"
                @mouseleave="hovered = false"
                justify="center"
            >
                <h2 class="day-label">
                    {{ weekday }}
                </h2>
                <div v-if="hovered || locked" v-on="on">
                    <v-btn @click="unlockDay" v-if="locked" icon>
                        <v-icon>mdi-lock</v-icon>
                    </v-btn>
                    <v-btn @click="lockDay" v-else icon>
                        <v-icon>mdi-lock-open</v-icon>
                    </v-btn>
                </div>
            </v-row>
        </template>
        <span>{{ toolTipText }}</span>
    </v-tooltip>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
    data() {
        return {
            hovered: false,
            currStart: 32400,
        };
    },
    props: {
        weekday: String,
    },
    computed: {
        ...mapGetters([
            "getLockedSections",
            "timetable",
            "getNoTimetablePopup",
            "getLockedDayStatus",
        ]),
        locked() {
            return this.getLockedDayStatus[this.weekday]
        },
        toolTipText() {
            return !this.locked ? "Block All Times" : "Unblock All Times";
        },
        currSecData() {
            return {
                name: `Locked Section`,
                courseCode: `Lock${this.weekday.toUpperCase()}${this.currStart}`,
                meeting_sections: [
                    {
                        sectionCode: "L0001",
                        instructors: ["NA"],
                        times: [
                            {
                                day: this.weekday.toUpperCase(),
                                start: this.currStart,
                                end: this.currStart + 3600,
                                location: "NA",
                            },
                        ],
                    },
                ],
            };
        },
    },
    methods: {
        ...mapActions([
            "selectCourse",
            "deleteCourse",
            "saveTimetable",
            "revertTimetable",
        ]),
        ...mapMutations(["lockSection", "setLockedDayStatus"]),
        lockDay() {
            let i = 0;
            this.saveTimetable();
            this.setLockedDayStatus(this.weekday);

            while (i < 12) {
                this.currStart = 32400 + i * 3600;

                // if locking the day is impossible, revert to the previous timetable
                if (this.getNoTimetablePopup) {
                    this.revertTimetable();
                    break;
                }

                if (this.validLockSection()) {
                    this.lockSection(
                        `${this.currSecData.courseCode}${this.currSecData.meeting_sections[0].sectionCode}`
                    );
                    this.selectCourse({ course: this.currSecData, noSave: true });
                }
                i++;
            }
        },
        unlockDay() {
            this.setLockedDayStatus(this.weekday);
            for (let i = 0; i < 12; i++) {
                this.currStart = 32400 + i * 3600;
                for (var lockedCourse of this.getLockedSections) {
                    if (lockedCourse.includes(this.weekday.toUpperCase())) {
                        this.deleteCourse({
                            code: lockedCourse.slice(0, lockedCourse.length - 5),
                        });
                    }
                }
            }
        },
        validLockSection() {
            const currDayTimetable = this.timetable[this.weekday.toUpperCase()];
            for (let section of currDayTimetable) {
                // if the course on the timetable is locked, don't add one here
                if (
                    this.getLockedSections.includes(
                        `${section.code}${section.sectionCode}`
                    )
                ) {
                    // if the locked course is in between another course, then skip it
                    if (
                        section.start <= this.currStart &&
                        this.currStart < section.end
                    ) {
                        return false;
                    }
                }
            }

            return true;
        },
    },
    watch: {
        getLockedDayStatus() {
            this.locked = true
        }
    }
};
</script>

<style scoped>
.day-label {
    margin-bottom: 16px;
    text-align: center;
}
</style>
