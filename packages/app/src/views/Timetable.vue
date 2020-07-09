<template>
    <div>
        <help-dial />
        <v-carousel
            v-model="whichTimetable"
            :height="carouselHeight"
            hide-delimiters
            light
            :show-arrows="false"
        >
            <v-carousel-item>
                <smooth-scrollbar :style="contentHeightCSS">
                    <timetable :timetable="timetable" id="exportMe" />
                </smooth-scrollbar>
            </v-carousel-item>
            <v-carousel-item>
                <smooth-scrollbar :style="contentHeightCSS">
                    <timetable :timetable="timetable" />
                </smooth-scrollbar>
            </v-carousel-item>
        </v-carousel>
    </div>
</template>

<script>
import Timetable from "../components/Timetable/Timetable";
import HelpDial from "../components/FloatingBtns/HelpDial";
import { mapGetters } from "vuex";

export default {
    components: {
        Timetable,
        HelpDial,
    },
    computed: {
        ...mapGetters(["timetable", "getSemesterStatus"]),
        contentHeightCSS() {
            return `height: ${window.innerHeight - 110}px`;
        },
        carouselHeight() {
            return window.innerHeight - 100;
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
