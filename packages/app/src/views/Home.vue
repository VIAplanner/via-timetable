<template>
    <div>
        <!-- Popup tutorial -->
        <tutorial />
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

        <v-tabs dark background-color="#012B5C" height="58px" v-model="whichTab">
            <v-img
                src="../assets/VIA-Planner-White.png"
                max-width="130"
                contain
                style="margin: 7px 20px 7px 7px"
            />
            <v-tab>PROGRAMS</v-tab>
            <v-tab>COURSES</v-tab>
            <course-search-bar style="margin: auto" />
            <switch-sem style="margin: auto" />
            <v-tab-item>
                <program-view />
            </v-tab-item>
            <v-tab-item>
                <v-row>
                    <timetable-view />
                    <side-bar />
                </v-row>
            </v-tab-item>
        </v-tabs>
        <v-row>
            <v-col class="pa-0">
                <h1 style="text-align:center" class="text-subtitle-1">
                    Copyright © 2020 VIAplanner - Data updated for the 2020 - 2021
                    school year
                </h1>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import CourseSearchBar from "../components/CourseSearchBar";
import Tutorial from "../components/Tutorial";
import SwitchSem from "../components/SwitchSem";
import TimetableView from "../views/Timetable";
import ProgramView from "../views/Program";
import { mapGetters } from "vuex";
import SideBar from "../components/SideBar";

export default {
    created() {
        if (this.$isMobile()) {
            this.$router.push({ name: "about" });
        }
    },
    components: {
        SwitchSem,
        CourseSearchBar,
        Tutorial,
        TimetableView,
        ProgramView,
        SideBar,
    },
    computed: {
        ...mapGetters(["getSemesterStatus", "getExportOverlay"]),
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
            whichTab: 1,
        };
    },
};
</script>
<style scoped>
.timetableColumn {
    padding-top: 0px;
    height: 100%;
}
</style>
