<template>
    <div>
        <v-row>
            <v-col class="py-0">
                <v-toolbar dark color="#012B5C">
                    <v-img
                        src="../assets/VIA-Planner-White.png"
                        max-width="130"
                        contain
                    />
                    <course-search-bar
                        :allCourses="formattedCourses"
                        class="mx-4"
                        :loadingParent="$apollo.loading"
                    />
                    <switch-sem />
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                class="ml-3"
                                fab
                                dark
                                small
                                color="primary"
                                v-bind="attrs"
                                v-on="on"
                                @click="$router.push({name: 'about'})"
                            >
                                <v-icon dark>mdi-information-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>About</span>
                    </v-tooltip>
                </v-toolbar>
            </v-col>
        </v-row>

        <v-container>
            <v-row>
                <v-col>
                    <timetable-course-card
                        class="my-4"
                        v-for="(course, code) in getSelectedCourses(selectedCourses)"
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
import SwitchSem from "../components/SwitchSem";
import { mapGetters } from "vuex";
export default {
    created() {
        if (this.$isMobile()) {
            this.$router.push({ name: "mobile" });
        }
    },
    components: {
        SwitchSem,
        CourseSearchBar,
        Timetable,
        TimetableCourseCard,
    },
    computed: {
        ...mapGetters(["selectedCourses", "timetable"]),
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
