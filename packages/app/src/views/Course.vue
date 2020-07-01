<template>
    <v-row :style="contentHeight" id="export-me"> 
        <help-dial />
        <v-col class="pb-0 pr-0; timetableColumn">
            <smooth-scrollbar>
                <timetable :timetable="timetable" />
            </smooth-scrollbar>
        </v-col>
        <v-col cols="3" class="pl-0">
            <v-card :height="coursePanelHeight" class="pa-4 mr-6">
                <h1 class="text-h5">{{ sideBarTitle }}</h1>
                <hr class="mb-1" />
                <smooth-scrollbar class="left-scroll-area">
                    <v-expansion-panels
                        :v-model="whichCoursesExpanded"
                        multiple
                        class="expansion-panel-settings pa-1"
                    >
                        <selected-course-card
                            v-for="(course, code) in filterCourses(selectedCourses)"
                            :key="code"
                            :course="course"
                        />
                    </v-expansion-panels>
                </smooth-scrollbar>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import Timetable from "../components/Timetable";
import SelectedCourseCard from "../components/SelectedCourseCard";
import HelpDial from "../components/HelpDial";
import { mapGetters } from "vuex";

export default {
    created() {
        if (this.$isMobile()) {
            this.$router.push({ name: "about" });
        }
    },
    components: {
        Timetable,
        SelectedCourseCard,
        HelpDial
    },
    computed: {
        ...mapGetters([
            "selectedCourses",
            "timetable",
        ]),
        sideBarTitle() {
            if (this.getSemesterStatus === "F") {
                return "Fall Courses";
            } else {
                return "Winter Courses";
            }
        },
        contentHeight() {
            return `height: ${window.innerHeight - 99}px`;
        },
        coursePanelHeight(){
            return (window.innerHeight - 99) * 0.6 
        }
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
            whichTab: 1
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
.left-scroll-area {
    position: relative;
    height: 90% !important;
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