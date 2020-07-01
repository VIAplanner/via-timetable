<template>
        <v-expansion-panel style="min-width: 98%" class="mb-1">
            <v-expansion-panel-header
                class="pa-0 pr-2"
                style="max-height: 50px !important"
            >
                <div
                    class="mr-3 card-header"
                    :style="`background-color: ${course.color}`"
                >
                    <p></p>
                </div>
                <div style="color: #474747">
                    <h3>{{ course.courseCode }}</h3>
                </div>
                <v-spacer />
                <v-dialog v-model="dialog" scrollable width="825px" @input="atInput">
                    <template v-slot:activator="{ on }">
                        <v-btn
                            icon
                            v-on="on"
                            color="#474747"
                            max-width="40"
                            max-height="40"
                        >
                            <v-icon>mdi-pencil-box-outline</v-icon>
                        </v-btn>
                    </template>
                    <course-section-picker
                        v-on:done="dialog = false"
                        :code="course.courseCode"
                        ref="popUp"
                    />
                </v-dialog>
                <v-btn
                    color="#474747"
                    @click="deleteCourse({ code: course.courseCode })"
                    max-width="40"
                    max-height="40"
                    icon
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-row>
                    <v-col>
                        <div class="sections-info">
                            <v-row
                                v-for="meetingsection in meetingSections"
                                :key="meetingsection.section"
                            >
                                <v-col class="pa-0" cols="3"><p style="font-size:15px">{{ meetingsection.sectionCode }}</p></v-col>
                                <v-col cols="3" class="pa-0">
                                    <p style="font-size:15px">{{getProperDayName(meetingsection.day)}}</p>
                                    </v-col>
                                <v-col cols="5" style="margin-left: 15px">
                                  <p style="font-size:15px">{{
                                    getFormattedTime(
                                        meetingsection.start,
                                        meetingsection.end
                                    )
                                }}</p></v-col>
                                <v-col> <p style="font-size:15px">{{ meetingsection.instructorName }}</p></v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </v-expansion-panel-content>
        </v-expansion-panel>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CourseSectionPicker from "../components/CourseSectionPicker";

export default {
    name: "selected-course-card",
    components: {
        CourseSectionPicker,
    },
    props: {
        course: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        ...mapGetters(["timetable", "selectedCourses"]),
        meetingSections() {
            const sections = [];
            for (let day in this.timetable) {
                const dayEvents = this.timetable[day];
                for (let event of dayEvents) {
                    if (event.code == this.course.courseCode) {
                        const instructor =
                            event.instructors.length === 0
                                ? "TBA"
                                : event.instructors[0];
                        sections.push({
                            sectionCode: event.sectionCode,
                            day: day,
                            start: event.start,
                            end: event.end,
                            instructorName: instructor,
                        });
                    }
                }
            }
            return sections;
        },
    },
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        ...mapActions(["deleteCourse"]),
        getFormattedTime(start, end) {
            var s = (start / 3600) % 12;
            if (s == 0) {
                s = 12;
            }
            var startPeriod = start / 3600 < 12 ? "AM" : "PM";
            let startHalf = Number.isInteger(s) ? "00" : "30";
            var e = (end / 3600) % 12;
            if (e == 0) {
                e = 12;
            }
            var endPeriod = end / 3600 < 12 ? "AM" : "PM";
            let endHalf = Number.isInteger(e) ? "00" : "30";
            return `${s - startHalf / 6 / 10}:${startHalf} - ${e -
                endHalf / 6 / 10}:${endHalf}`;
        },
        getProperDayName(day) {
            return day.slice(0,3).toUpperCase();
        },
        atInput() {
            // console.log('pop up toggled')
            var courseSectionPicker = this.$refs.popUp;
            if (typeof courseSectionPicker != "undefined") {
                courseSectionPicker.resetSelectedMeetingSections();
            }
        },
    },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");
* {
    font-family: "Montserrat", sans-serif;
}
.card-header {
    max-width: 20px;
    min-width: 20px;
    height: 50px;
}
.v-expansion-panel--active > .v-expansion-panel-header {
    min-height: 50px !important;
}
</style>
