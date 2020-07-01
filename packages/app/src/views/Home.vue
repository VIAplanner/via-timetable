<template>
    <div>
        <!--Exporting Progress Overlay-->
        <v-overlay :value="getExportOverlay">
            <v-row>
                <h1 class="ma-3">Exporting</h1>
            </v-row>
            <v-row justify="center">
                <v-progress-circular
                    indeterminate
                    size="64"
                    style="margin-left: auto ; margin-right: auto ;"
                ></v-progress-circular>
            </v-row>
        </v-overlay>

        <v-tabs dark background-color="#012B5C" height="58px">
            <v-img
                src="../assets/VIA-Planner-White.png"
                max-width="130"
                contain
                style="margin: 7px 20px 7px 7px"
            />
            <v-tab>PROGRAMS</v-tab>
            <v-tab>COURSES</v-tab>
            <course-search-bar class="mx-4" />
            <switch-sem style="margin: 15px 30px 15px 15px" />
            <v-tab-item>
                <div>Program Choosing Page</div>
            </v-tab-item>
            <!--Course Choosing Page-->
            <v-tab-item>
                <v-row :style="contentHeight">
                    <help-dial />
                    <v-col class="pb-0 pr-0; timetableColumn" id="export-me">
                        <smooth-scrollbar>
                            <timetable :timetable="timetable" />
                        </smooth-scrollbar>
                    </v-col>
                    <v-col cols="3" class="pl-0">
                        <v-card height="500" class="pa-4 mr-6">
                            <h1 class="text-h5">Courses</h1>
                            <hr />
                            <smooth-scrollbar class="left-scroll-area">
                                <v-expansion-panels
                                    :v-model="whichCoursesExpanded"
                                    multiple
                                    class="expansion-panel-settings"
                                >
                                    <selected-course-card
                                        v-for="(course, code) in filterCourses(
                                            selectedCourses
                                        )"
                                        :key="code"
                                        :course="course"
                                    />
                                </v-expansion-panels>
                            </smooth-scrollbar>
                        </v-card>
                    </v-col>
                </v-row>
            </v-tab-item>
        </v-tabs>
        <v-row>
            <v-col class="pt-0">
                <h1 style="text-align:center" class="text-subtitle-1">
                    Copyright © 2020 VIAplanner - Data updated for the 2020 - 2021
                    school year
                </h1>
                <tutorial />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import Timetable from "../components/Timetable";
import Tutorial from "../components/Tutorial";
import SwitchSem from "../components/SwitchSem";
import HelpDial from "../components/HelpDial";
import SelectedCourseCard from "../components/SelectedCourseCard";
import { mapGetters } from "vuex";

export default {
    created() {
        if (this.$isMobile()) {
            this.$router.push({ name: "about" });
        }
    },
    components: {
        SwitchSem,
        CourseSearchBar,
        Timetable,
        Tutorial,
        HelpDial,
        SelectedCourseCard,
    },
    computed: {
        ...mapGetters([
            "getSemesterStatus",
            "selectedCourses",
            "fallSelectedCourses",
            "winterSelectedCourses",
            "timetable",
            "getExportOverlay",
        ]),
        formattedCourses() {
            if (!this.courses) {
                return [];
            }
            return this.courses.map((course) => {
                if (course.code[8] === "F") {
                    return `🍂   ${course.code}: ${course.name}`;
                } else if (course.code[8] === "S") {
                    return `❄️   ${course.code}: ${course.name}`;
                } else {
                    return `🍂❄️ ${course.code}: ${course.name}`;
                }
            });
        },
        contentHeight() {
            return `height: ${window.innerHeight - 99}px`;
        },
    },
    data() {
        return {
            optimizationOpen: false,
            whichCoursesExpanded: [],
            scrollBarSettings: {
                wheelPropagation: false,
                maxScrollbarLength: 240,
                swipeEasing: true,
                wheelSpeed: 0.1,
            },
        };
    },
    methods: {
        // filters user lock timeslots
        filterCourses(courses) {
            const filteredCourses = {};

            for (var code in courses) {
                if (!code.includes("Lock")) {
                    filteredCourses[code] = courses[code];
                }
            }

            return filteredCourses;
        },
    },
};
</script>
<style scoped>
.timetableColumn {
    padding-top: 0px;
    height: 100%;
}
.inset-shadow {
    box-shadow: inset 0px 3px 10px 0px grey;
}
.left-scroll-area {
    position: relative;
    margin: auto;
    height: 500px;
}
.left-panel {
    height: 500px;
    /* overflow-y: auto; */
    padding: 5px 10px 20px 15px;
    position: relative;
}
.expansion-panels-settings {
    width: 90%;
}
</style>
