<template>
    <v-row @mouseover="hovered = true" @mouseleave="hovered = false" justify="center">
        <h2 class="day-label">
            {{ weekday }}
        </h2>
        <div v-if="hovered || locked">
            <v-btn @click="unlockDay" v-if="locked" icon>
                <v-icon>mdi-lock</v-icon>
            </v-btn>
            <v-btn @click="lockDay" v-else icon>
                <v-icon>mdi-lock-open</v-icon>
            </v-btn>
        </div>
    </v-row>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
    data() {
        return {
            locked: false,
            hovered: false,
            currStart: 32400,
        };
    },
    props: {
        weekday: String,
    },
    computed: {
        ...mapGetters(["getLockedSections", "timetable"]),
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
        ...mapActions(["selectCourse", "deleteCourse"]),
        ...mapMutations(["lockSection"]),
        lockDay() {
            for (let i = 0; i < 12; i++) {
                this.currStart = 32400 + i * 3600;

                if (this.validLockSection()) {
                    this.lockSection(
                        `${this.currSecData.courseCode}${this.currSecData.meeting_sections[0].sectionCode}`
                    );
                    this.selectCourse({ course: this.currSecData });
                }
            }

            this.lockToggle();
        },
        unlockDay() {
            this.lockToggle();
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
                    // if the course has the same start time as the current iteration of the locked course
                    // then skip it
                    if (section.start === this.currStart) {
                        return false;
                    }
                }
            }

            return true;
        },
        lockToggle() {
            this.locked = !this.locked;
        },
    },
};
</script>

<style scoped>
.day-label {
    margin-bottom: 16px;
    text-align: center;
}
</style>
