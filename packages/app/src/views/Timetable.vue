<template>
    <v-row :style="contentHeight">
        <help-dial />
        <v-col class="pb-0 pr-0; timetableColumn">
            <smooth-scrollbar>
                <v-carousel
                    v-model="whichTimetable"
                    :height="timetableHeight"
                    hide-delimiters
                    light
                    :show-arrows="false"
                >
                    <v-carousel-item>
                        <timetable :timetable="timetable" id="exportMe" />
                    </v-carousel-item>
                    <v-carousel-item>
                        <timetable :timetable="timetable"/>
                    </v-carousel-item>
                </v-carousel>
            </smooth-scrollbar>
        </v-col>
    </v-row>
</template>

<script>
import Timetable from "../components/Timetable";
import HelpDial from "../components/HelpDial";
import { mapGetters } from "vuex";

export default {
    components: {
        Timetable,
        HelpDial,
    },
    computed: {
        ...mapGetters(["timetable", "getSemesterStatus"]),
        contentHeight() {
            return `height: ${window.innerHeight - 110}px`;
        },
        timetableHeight() {
            return window.innerHeight - 99;
        },
        whichTimetable() {
            if (this.getSemesterStatus === "F") {
                return 0;
            } else {
                return 1;
            }
        },
    },
};
</script>
<style scoped>
.timetableColumn {
    padding-top: 0px;
    height: 100%;
}
</style>
