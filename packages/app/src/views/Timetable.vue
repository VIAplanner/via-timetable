<template>
    <v-row :style="contentHeight" id="export-me"> 
        <help-dial />
        <v-col class="pb-0 pr-0; timetableColumn">
            <smooth-scrollbar>
                <timetable :timetable="timetable" />
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
        HelpDial
    },
    computed: {
        ...mapGetters([
            "timetable",
        ]),
        contentHeight() {
            return `height: ${window.innerHeight - 99}px`;
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