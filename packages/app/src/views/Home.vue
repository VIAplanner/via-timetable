<template>
    <div>
        <v-row v-if="!$apollo.loading">
            <v-col class="py-0">
                <v-toolbar dark color="#012B5C">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    <v-toolbar-title class="mr-4"
                        >Timetable Planner</v-toolbar-title
                    >
                    <course-search-bar
                        :courses="formattedCourses"
                        class="mx-4"
                    />
                    <switch-time />
                </v-toolbar>
            </v-col>
        </v-row>

        <v-row v-else>
            <v-col>
                <v-progress-linear
                    indeterminate
                    color="#012B5C"
                ></v-progress-linear>
            </v-col>
        </v-row>

        <v-container>
            <v-row>
                <v-col>
                    <timetable-course-card
                        class="my-4"
                        v-for="(course, code) in getSelectedCourses(
                            selectedCourses
                        )"
                        :key="code"
                        :course="course"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="mr-8">
                    <timetable :timetable="timetable" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import Timetable from "../components/Timetable";
import TimetableCourseCard from "../components/TimetableCourseCard";
import COURSES_SEARCH_BAR_QUERY from "../graphql/CoursesSearchBar.gql";
import SwitchTime from "../components/SwitchTime";
import { mapGetters } from "vuex";
export default {
    components: {
        SwitchTime,
        CourseSearchBar,
        Timetable,
        TimetableCourseCard,
    },
    computed: {
        ...mapGetters(["selectedCourses", "timetable"]),
        formattedCourses() {
            return this.courses.map(
                (course) => `${course.code}: ${course.name}`
            );
        },
    },
    data() {
        return {
            optimizationOpen: false,
        };
    },
    apollo: {
        courses: COURSES_SEARCH_BAR_QUERY,
    },
    methods: {
        getFormattedCodeAndName(code, name) {
            return `${code} ${name}`;
        },
        // filters user lock timeslots
        getSelectedCourses(selectedCourses) {
            const filteredCourses = {};

            for (var code in selectedCourses) {
                if (!code.includes("Lock")) {
                    filteredCourses[code] = selectedCourses[code];
                }
            }

            return filteredCourses;
        },
    },
};
</script>
