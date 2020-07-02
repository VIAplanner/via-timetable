<template>
    <div>
        <v-card :height="coursePanelHeight" class="pa-4">
            <h1 class="text-h5">{{ sideBarTitle }}</h1>
            <hr class="mb-1" />
            <smooth-scrollbar class="right-scroll-area">
                <v-expansion-panels
                    :v-model="whichCoursesExpanded"
                    multiple
                    hover
                    class="expansion-panel-settings pa-1"
                >
                    <selected-course-card
                        v-for="(course, code) in filterCourses"
                        :key="code"
                        :course="course"
                    />
                </v-expansion-panels>
            </smooth-scrollbar>
        </v-card>
        <v-card :height="programPanelHeight" class="mt-3 pa-4">
            <h1 class="text-h5">Programs</h1>
            <hr class="mb-1" />
            <smooth-scrollbar class="right-scroll-area">
            </smooth-scrollbar>
        </v-card>
    </div>
</template>
<script>
import SelectedCourseCard from "../components/SelectedCourseCard";
import { mapGetters } from "vuex";

export default {
    components: {
        SelectedCourseCard,
    },
    data() {
        return {
            whichCoursesExpanded: [],
        };
    },
    computed: {
        ...mapGetters(["selectedCourses", "getSemesterStatus", "timetable"]),
        sideBarTitle() {
            if (this.getSemesterStatus === "F") {
                return "Fall Courses";
            } else {
                return "Winter Courses";
            }
        },
        coursePanelHeight() {
            return (window.innerHeight - 99) * 0.6;
        },
        programPanelHeight() {
            return (window.innerHeight - 99) * 0.35;
        },
        filterCourses() {
            this.timetable; //force re-render the selected courses
            const filteredCourses = {};

            for (var code in this.selectedCourses) {
                if (!code.includes("Lock")) {
                    filteredCourses[code] = this.selectedCourses[code];
                }
            }

            return filteredCourses;
        },
    },
};
</script>
<style scoped>
.right-scroll-area {
    position: relative;
    height: 90% !important;
}
.expansion-panels-settings {
    width: 90%;
}
</style>
